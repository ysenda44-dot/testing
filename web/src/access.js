/**
 * Cloudflare Access が付けるトークン（Cf-Access-Jwt-Assertion）を検証する。
 * Access の前を通っていないリクエストや、別のアプリ向けのトークンを弾く。
 */

const CERT_TTL_MS = 60 * 60 * 1000;
const certCache = new Map();

export function normalizeTeamDomain(value) {
  let d = String(value || '').trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  if (d && !d.includes('.')) d += '.cloudflareaccess.com';
  return d;
}

function b64urlToBytes(s) {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4);
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function b64urlToJson(s) {
  return JSON.parse(new TextDecoder().decode(b64urlToBytes(s)));
}

async function getKeys(teamDomain, fetchImpl, now, force) {
  const cached = certCache.get(teamDomain);
  if (!force && cached && now - cached.at < CERT_TTL_MS) return cached.keys;
  const res = await fetchImpl(`https://${teamDomain}/cdn-cgi/access/certs`);
  if (!res.ok) throw new Error(`certs fetch failed: ${res.status}`);
  const body = await res.json();
  const keys = Array.isArray(body.keys) ? body.keys : [];
  certCache.set(teamDomain, { at: now, keys });
  return keys;
}

/**
 * @returns {Promise<{ok: true, payload: object} | {ok: false, reason: string}>}
 */
export async function verifyAccessJwt(token, { teamDomain, aud, now = Date.now(), fetchImpl = fetch } = {}) {
  const team = normalizeTeamDomain(teamDomain);
  if (!team || !aud) return { ok: false, reason: 'access_not_configured' };
  if (!token) return { ok: false, reason: 'missing_token' };

  const parts = String(token).split('.');
  if (parts.length !== 3) return { ok: false, reason: 'malformed_token' };

  let header;
  let payload;
  try {
    header = b64urlToJson(parts[0]);
    payload = b64urlToJson(parts[1]);
  } catch {
    return { ok: false, reason: 'malformed_token' };
  }
  if (header.alg !== 'RS256') return { ok: false, reason: 'unsupported_alg' };

  let keys;
  try {
    keys = await getKeys(team, fetchImpl, now, false);
    if (!keys.some((k) => k.kid === header.kid)) keys = await getKeys(team, fetchImpl, now, true);
  } catch {
    return { ok: false, reason: 'certs_unavailable' };
  }
  const jwk = keys.find((k) => k.kid === header.kid);
  if (!jwk) return { ok: false, reason: 'unknown_key' };

  let valid = false;
  try {
    const key = await crypto.subtle.importKey(
      'jwk',
      { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: 'RS256', ext: true },
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify']
    );
    valid = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      key,
      b64urlToBytes(parts[2]),
      new TextEncoder().encode(`${parts[0]}.${parts[1]}`)
    );
  } catch {
    return { ok: false, reason: 'bad_signature' };
  }
  if (!valid) return { ok: false, reason: 'bad_signature' };

  const nowSec = Math.floor(now / 1000);
  if (typeof payload.exp !== 'number' || payload.exp < nowSec) return { ok: false, reason: 'expired' };
  if (typeof payload.nbf === 'number' && payload.nbf > nowSec + 60) return { ok: false, reason: 'not_yet_valid' };
  const auds = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!auds.includes(aud)) return { ok: false, reason: 'wrong_audience' };
  if (payload.iss !== `https://${team}`) return { ok: false, reason: 'wrong_issuer' };

  return { ok: true, payload };
}

export function clearCertCache() {
  certCache.clear();
}
