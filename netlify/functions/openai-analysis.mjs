import { authorize, complete, getEnv, json, readJson } from "./lib/http.mjs";
import { getSystemPrompt } from "./lib/prompts.mjs";

export default async function handler(request) {
  const denied = authorize(request);
  if (denied) return denied;
  const key = getEnv("OPENAI_API_KEY");
  if (!key) return json({ error: "OPENAI_API_KEY is not configured." }, 503);
  let body;
  try {
    body = await readJson(request);
    if (typeof body.userData !== "string" || !body.userData || body.userData.length > 150000 ||
        !["info", "data", "charts", "organigram"].includes(body.promptType) ||
        !body.schema || typeof body.schema !== "object" || Array.isArray(body.schema) ||
        typeof body.schema.name !== "string" || !body.schema.schema ||
        (body.secondPass !== undefined && typeof body.secondPass !== "boolean")) {
      return json({ error: "Invalid analysis parameters." }, 400);
    }
  } catch { return json({ error: "Invalid JSON request or request exceeds 200 KB." }, 400); }
  try {
    const content = await complete("https://api.openai.com/v1/chat/completions", key, {
      model: "gpt-4o",
      messages: [
        { role: "system", content: getSystemPrompt(body.promptType, body.secondPass) },
        { role: "user", content: body.userData },
      ],
      response_format: { type: "json_schema", json_schema: body.schema },
      temperature: body.promptType === "charts" ? 0.7 : 0.1,
      max_tokens: 8000,
    });
    return json({ content });
  } catch { return json({ error: "OpenAI analysis failed." }, 502); }
}

export const config = {
  rateLimit: { windowLimit: 10, windowSize: 60, aggregateBy: ["ip", "domain"] },
};
