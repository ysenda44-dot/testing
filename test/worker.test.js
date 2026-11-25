import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../web/src/worker.js';
import { verifyAccessJwt, clearCertCache, normalizeTeamDomain } from '../web/src/access.js';

/* ---------------- テスト用の Access トークン ---------------- */

const TEAM = 'example.cloudflareaccess.com';
const AUD = 'aud-123';
const enc = new TextEncoder();
const b64url = (bytes) => Buffer.from(bytes).toString('base64url');

const keyPair = await crypto.subtle.generateKey(
  { name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
  true,
  ['sign', 'verify']
);
const publicJwk = { ...(await crypto.subtle.exportKey('jwk', keyPair.publicKey)), kid: 'k1', alg: 'RS256', use: 'sig' };

async function makeToken(overrides = {}, header = { alg: 'RS256', kid: 'k1', typ: 'JWT' }) {
  const now = Math.floor(Date.now() / 1000);
  const payload = { aud: [AUD], iss: `https://${TEAM}`, exp: now + 600, iat: now, email: 'me@example.com', ...overrides };
  const head = b64url(enc.encode(JSON.stringify(header)));
  const body = b64url(enc.encode(JSON.stringify(payload)));
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', keyPair.privateKey, enc.encode(`${head}.${body}`));
  return `${head}.${body}.${b64url(new Uint8Array(sig))}`;
}

let certFetches = 0;
const fakeFetch = async (url) => {
  certFetches += 1;
  assert.equal(url, `https://${TEAM}/cdn-cgi/access/certs`);
  return new Response(JSON.stringify({ keys: [publicJwk] }), { headers: { 'content-type': 'application/json' } });
};

beforeEach(() => {
  clearCertCache();
  certFetches = 0;
});

test('Access: 正しいトークンは通す', async () => {
  const r = await verifyAccessJwt(await makeToken(), { teamDomain: TEAM, aud: AUD, fetchImpl: fakeFetch });
  assert.equal(r.ok, true);
  assert.equal(r.payload.email, 'me@example.com');
});

test('Access: 公開鍵は使い回す', async () => {
  const opts = { teamDomain: TEAM, aud: AUD, fetchImpl: fakeFetch };
  await verifyAccessJwt(await makeToken(), opts);
  await verifyAccessJwt(await makeToken(), opts);
  assert.equal(certFetches, 1);
});

test('Access: だめなトークンは理由つきで弾く', async () => {
  const opts = { teamDomain: TEAM, aud: AUD, fetchImpl: fakeFetch };
  const cases = [
    [await makeToken({ aud: ['other-app'] }), 'wrong_audience'],
    [await makeToken({ iss: 'https://evil.cloudflareaccess.com' }), 'wrong_issuer'],
    [await makeToken({ exp: Math.floor(Date.now() / 1000) - 10 }), 'expired'],
    [await makeToken({}, { alg: 'HS256', kid: 'k1' }), 'unsupported_alg'],
    [await makeToken({}, { alg: 'RS256', kid: 'unknown' }), 'unknown_key'],
    ['not-a-jwt', 'malformed_token'],
    ['', 'missing_token']
  ];
  for (const [token, reason] of cases) {
    const r = await verifyAccessJwt(token, opts);
    assert.deepEqual(r, { ok: false, reason }, reason);
  }
  const good = await makeToken();
  const [h, , s] = good.split('.');
  const tampered = `${h}.${b64url(enc.encode(JSON.stringify({ aud: [AUD], iss: `https://${TEAM}`, exp: 9999999999 })))}.${s}`;
  assert.deepEqual(await verifyAccessJwt(tampered, opts), { ok: false, reason: 'bad_signature' });
});

test('Access: チーム名だけでも、URL でも受け付ける', () => {
  assert.equal(normalizeTeamDomain('example'), TEAM);
  assert.equal(normalizeTeamDomain('https://example.cloudflareaccess.com/'), TEAM);
});

/* ---------------- Worker ---------------- */

function makeEnv(extra = {}) {
  const store = new Map();
  return {
    ASSETS: { fetch: async () => new Response('static', { status: 200 }) },
    DATA: {
      get: async (k) => (store.has(k) ? store.get(k) : null),
      put: async (k, v) => { store.set(k, v); }
    },
    INGEST_TOKEN: 'secret-token',
    ALLOW_UNAUTHENTICATED: 'true',
    ...extra,
    _store: store
  };
}

const payload = JSON.stringify({ version: 1, generatedAt: '2026-11-25T07:00:00+09:00', institutions: [], transactions: [], history: [] });
const post = (body, token = 'secret-token') =>
  new Request('https://app.example/api/data', {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body
  });

test('Worker: 送信 → 取得 ができる', async () => {
  const env = makeEnv();
  const empty = await worker.fetch(new Request('https://app.example/api/data'), env);
  assert.equal(empty.status, 404);

  const res = await worker.fetch(post(payload), env);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true, generatedAt: '2026-11-25T07:00:00+09:00' });

  const got = await worker.fetch(new Request('https://app.example/api/data'), env);
  assert.equal(got.status, 200);
  assert.equal(got.headers.get('cache-control'), 'no-store');
  assert.equal(await got.text(), payload);
});

test('Worker: 送信はトークンが違えば 401、形が違えば 400', async () => {
  const env = makeEnv();
  assert.equal((await worker.fetch(post(payload, 'wrong'), env)).status, 401);
  assert.equal((await worker.fetch(post('{broken'), env)).status, 400);
  assert.equal((await worker.fetch(post(JSON.stringify({ hello: 1 })), env)).status, 400);
  assert.equal(env._store.size, 0);
});

test('Worker: Access が未設定なら閉じたまま（403）', async () => {
  const env = makeEnv({ ALLOW_UNAUTHENTICATED: undefined });
  const res = await worker.fetch(new Request('https://app.example/api/data'), env);
  assert.equal(res.status, 403);
  assert.equal((await res.json()).reason, 'access_not_configured');
  assert.equal((await worker.fetch(post(payload), env)).status, 403);
});

test('Worker: Access を設定したら、トークンなしは 403', async () => {
  const env = makeEnv({ ALLOW_UNAUTHENTICATED: undefined, ACCESS_TEAM_DOMAIN: TEAM, ACCESS_AUD: AUD });
  const res = await worker.fetch(new Request('https://app.example/api/data'), env);
  assert.equal(res.status, 403);
  assert.equal((await res.json()).reason, 'missing_token');
});

test('Worker: 画面のファイルはそのまま返し、ほかの /api/ は 404', async () => {
  const env = makeEnv();
  assert.equal(await (await worker.fetch(new Request('https://app.example/'), env)).text(), 'static');
  assert.equal((await worker.fetch(new Request('https://app.example/api/other'), env)).status, 404);
  assert.equal((await worker.fetch(new Request('https://app.example/api/data', { method: 'DELETE' }), env)).status, 405);
});
