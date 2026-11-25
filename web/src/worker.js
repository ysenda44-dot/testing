/**
 * /api/data
 *   GET  … スマホ画面がデータを読む
 *   POST … 毎朝 GAS がデータを送る（Authorization: Bearer <INGEST_TOKEN>）
 * それ以外のパスは public/ の静的ファイル（画面）を返す。
 *
 * 設定（すべて `wrangler secret put` で入れる）:
 *   ACCESS_TEAM_DOMAIN  例: yourteam.cloudflareaccess.com
 *   ACCESS_AUD          Access アプリの Application Audience (AUD) Tag
 *   INGEST_TOKEN        GAS と共有する長いランダム文字列
 * ACCESS_* が未設定のあいだは /api/data を一切返さない（閉じた状態で失敗する）。
 * 手元で試すときだけ .dev.vars に ALLOW_UNAUTHENTICATED=true を書く。
 */
import { verifyAccessJwt } from './access.js';

const MAX_BYTES = 5 * 1024 * 1024;
const DATA_KEY = 'latest';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/data') return handleData(request, env);
    if (url.pathname.startsWith('/api/')) return json({ error: 'not_found' }, 404);
    return env.ASSETS.fetch(request);
  }
};

async function handleData(request, env) {
  const access = await checkAccess(request, env);
  if (!access.ok) return json({ error: 'forbidden', reason: access.reason }, 403);

  if (request.method === 'GET') {
    const body = await env.DATA.get(DATA_KEY);
    if (body === null) return json({ error: 'no_data' }, 404);
    return new Response(body, {
      headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
    });
  }

  if (request.method === 'POST') {
    if (!env.INGEST_TOKEN) return json({ error: 'ingest_disabled' }, 503);
    const given = request.headers.get('authorization') || '';
    if (!(await safeEqual(given, `Bearer ${env.INGEST_TOKEN}`))) return json({ error: 'unauthorized' }, 401);

    const declared = Number(request.headers.get('content-length') || 0);
    if (declared > MAX_BYTES) return json({ error: 'too_large' }, 413);
    const text = await request.text();
    if (new TextEncoder().encode(text).length > MAX_BYTES) return json({ error: 'too_large' }, 413);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return json({ error: 'invalid_json' }, 400);
    }
    if (!data || typeof data.generatedAt !== 'string' || !Array.isArray(data.institutions)) {
      return json({ error: 'invalid_payload' }, 400);
    }
    await env.DATA.put(DATA_KEY, text);
    return json({ ok: true, generatedAt: data.generatedAt });
  }

  return json({ error: 'method_not_allowed' }, 405, { allow: 'GET, POST' });
}

async function checkAccess(request, env) {
  if (env.ACCESS_TEAM_DOMAIN && env.ACCESS_AUD) {
    const token = request.headers.get('cf-access-jwt-assertion') || readCookie(request, 'CF_Authorization');
    return verifyAccessJwt(token, { teamDomain: env.ACCESS_TEAM_DOMAIN, aud: env.ACCESS_AUD });
  }
  if (env.ALLOW_UNAUTHENTICATED === 'true') return { ok: true };
  return { ok: false, reason: 'access_not_configured' };
}

function readCookie(request, name) {
  const cookie = request.headers.get('cookie') || '';
  for (const part of cookie.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return v.join('=');
  }
  return '';
}

async function safeEqual(a, b) {
  const enc = new TextEncoder();
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(a)),
    crypto.subtle.digest('SHA-256', enc.encode(b))
  ]);
  const x = new Uint8Array(ha);
  const y = new Uint8Array(hb);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

function json(obj, status = 200, headers = {}) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers }
  });
}
