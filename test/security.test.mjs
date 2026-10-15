import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import openai from "../netlify/functions/openai-analysis.mjs";
import research from "../netlify/functions/company-research.mjs";
import documents from "../netlify/functions/document-analysis.mjs";
import { authorize } from "../netlify/functions/lib/http.mjs";
import { assertSafeBundle } from "../build/client_security.mjs";

const originalFetch = globalThis.fetch;
const saved = Object.fromEntries(["APP_ACCESS_PASSWORD", "OPENAI_API_KEY", "PERPLEXITY_API_KEY", "AZURE_DOCUMENT_ENDPOINT", "AZURE_DOCUMENT_KEY"].map(name => [name, process.env[name]]));
afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const [name, value] of Object.entries(saved)) {
    if (value === undefined) delete process.env[name];
    else process.env[name] = value;
  }
});
const password = "test-access-password-with-32-characters";
function configure() {
  process.env.APP_ACCESS_PASSWORD = password;
  process.env.OPENAI_API_KEY = "server-openai-test-key";
  process.env.PERPLEXITY_API_KEY = "server-perplexity-test-key";
  process.env.AZURE_DOCUMENT_ENDPOINT = "https://azure.example.test";
  process.env.AZURE_DOCUMENT_KEY = "server-azure-test-key";
}
function request(body, authenticated = true, extra = {}) {
  return new Request("https://example.test/api", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(authenticated ? { Authorization: "Basic " + Buffer.from("access:" + password).toString("base64") } : {}), ...extra },
    body: JSON.stringify(body),
  });
}

test("all paid endpoints reject anonymous and wrong-password calls without provider requests", async () => {
  configure();
  globalThis.fetch = () => { throw new Error("Unexpected provider call"); };
  for (const handler of [openai, research, documents]) {
    assert.equal((await handler(request({}, false))).status, 401);
    assert.equal((await handler(request({}, true, { Authorization: "Basic " + Buffer.from("access:wrong").toString("base64") }))).status, 401);
  }
});

test("missing access configuration fails closed", async () => {
  delete process.env.APP_ACCESS_PASSWORD;
  for (const handler of [openai, research, documents]) assert.equal((await handler(request({}))).status, 503);
});

test("HTTP and cross-origin requests are refused", () => {
  configure();
  assert.equal(authorize(new Request("http://remote.example/api", { method: "POST" })).status, 403);
  assert.equal(authorize(request({}, true, { Origin: "https://attacker.example" })).status, 403);
  assert.equal(authorize(new Request("https://example.test/api")).status, 405);
});

test("invalid analysis input does not reach the upstream provider", async () => {
  configure();
  globalThis.fetch = () => { throw new Error("Unexpected provider call"); };
  assert.equal((await openai(request({ userData: "test", promptType: "unknown", schema: {} }))).status, 400);
  assert.equal((await openai(request({ userData: "x".repeat(200001), promptType: "info", schema: {} }))).status, 400);
  assert.equal((await research(request({ companyName: "", groupData: "" }))).status, 400);
});

test("OpenAI uses server credentials, fixed model and bounded output", async () => {
  configure();
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "https://api.openai.com/v1/chat/completions");
    assert.equal(options.headers.Authorization, "Bearer server-openai-test-key");
    const body = JSON.parse(options.body);
    assert.equal(body.model, "gpt-4o");
    assert.equal(body.max_tokens, 8000);
    assert.equal(body.messages[1].content, "test data");
    return Response.json({ choices: [{ message: { content: '{"ok":true}' } }] });
  };
  const response = await openai(request({ userData: "test data", promptType: "info", schema: { name: "test", schema: { type: "object" } } }));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { content: '{"ok":true}' });
});

test("provider failures cannot echo private credentials to the browser", async () => {
  configure();
  globalThis.fetch = async () => Response.json({ error: "server-openai-test-key" }, { status: 401 });
  const response = await openai(request({ userData: "test", promptType: "info", schema: { name: "test", schema: { type: "object" } } }));
  assert.equal(response.status, 502);
  assert.ok(!(await response.text()).includes("server-openai-test-key"));
});

test("Perplexity uses the server key and preserves the frontend content contract", async () => {
  configure();
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "https://api.perplexity.ai/v1/sonar");
    assert.equal(options.headers.Authorization, "Bearer server-perplexity-test-key");
    assert.equal(JSON.parse(options.body).max_tokens, 4000);
    return Response.json({ choices: [{ message: { content: "# Company" } }] });
  };
  const response = await research(request({ companyName: "Example", groupData: "" }));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { content: " Company" });
});

test("Azure rejects empty files without invoking the provider", async () => {
  configure();
  const form = new FormData();
  form.append("file", new Blob([]), "empty.pdf");
  form.append("mode", "read");
  const response = await documents(new Request("https://example.test/api", {
    method: "POST", headers: { Authorization: "Basic " + Buffer.from("access:" + password).toString("base64") }, body: form,
  }));
  assert.equal(response.status, 400);
});

test("build guard detects credentials in chunks and byte assets and rejects provider SDKs", () => {
  const chunk = (code, modules = {}) => ({ main: { type: "chunk", code, modules } });
  assert.throws(() => assertSafeBundle(chunk("private-test-key"), ["private-test-key"]), /private credential/);
  assert.throws(() => assertSafeBundle({ asset: { type: "asset", source: new TextEncoder().encode("private-test-key") } }, ["private-test-key"]), /private credential/);
  assert.throws(() => assertSafeBundle(chunk("", { "/app/node_modules/@azure/ai-form-recognizer/index.js": {} }), []), /provider SDK/);
  assert.doesNotThrow(() => assertSafeBundle(chunk("fetch('/.netlify/functions/openai-analysis')"), []));
});
