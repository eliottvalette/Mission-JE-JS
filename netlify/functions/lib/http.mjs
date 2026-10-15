import { createHash, timingSafeEqual } from "node:crypto";

export function json(body, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export function getEnv(name) {
  return globalThis.Netlify?.env?.get?.(name) ?? process.env[name];
}

export function authorize(request) {
  if (request.method !== "POST") return new Response(null, { status: 405, headers: { Allow: "POST" } });
  const url = new URL(request.url);
  if (url.protocol !== "https:" && !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) {
    return json({ error: "HTTPS is required." }, 403);
  }
  const origin = request.headers.get("origin");
  if (origin && origin !== url.origin) return json({ error: "Cross-origin requests are not allowed." }, 403);
  const password = getEnv("APP_ACCESS_PASSWORD");
  if (!password || password.length < 20) return json({ error: "APP_ACCESS_PASSWORD must be configured with at least 20 characters." }, 503);
  const match = /^Basic ([A-Za-z0-9+/=]+)$/.exec(request.headers.get("authorization") || "");
  const supplied = match ? Buffer.from(match[1], "base64").toString("utf8") : "";
  const hash = value => createHash("sha256").update(value).digest();
  if (!timingSafeEqual(hash(supplied), hash("access:" + password))) return json({ error: "Authentication required." }, 401);
  return null;
}

export async function readJson(request) {
  if (!request.headers.get("content-type")?.includes("application/json")) throw new Error("JSON request body required.");
  const text = await request.text();
  if (Buffer.byteLength(text) > 200000) throw new Error("Request body exceeds 200 KB.");
  const value = JSON.parse(text);
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("JSON object required.");
  return value;
}

export async function complete(url, key, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(50000),
  });
  if (!response.ok) throw new Error("Provider returned HTTP " + response.status + ".");
  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content) throw new Error("Provider returned no content.");
  return content;
}
