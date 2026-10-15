export function assertSafeBundle(bundle, secrets) {
  for (const output of Object.values(bundle)) {
    const content = output.type === "chunk" ? output.code : typeof output.source === "string" ? output.source : new TextDecoder().decode(output.source);
    if (secrets.some(value => value && content.includes(value)) || /sk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{30,}|pplx-[A-Za-z0-9_-]{20,}/.test(content)) {
      throw new Error("Build blocked: a private credential was found in a browser asset.");
    }
    if (output.type === "chunk" && Object.keys(output.modules).some(id => /node_modules\/(?:openai|@azure\/ai-form-recognizer|@mistralai)\//.test(id))) {
      throw new Error("Build blocked: a private provider SDK was imported into the browser.");
    }
  }
}
