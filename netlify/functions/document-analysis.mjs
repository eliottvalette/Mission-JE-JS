import { authorize, getEnv, json } from "./lib/http.mjs";

export default async function handler(request) {
  const denied = authorize(request);
  if (denied) return denied;
  const endpoint = getEnv("AZURE_DOCUMENT_ENDPOINT");
  const key = getEnv("AZURE_DOCUMENT_KEY");
  if (!endpoint || !key) return json({ error: "Azure document credentials are not configured." }, 503);
  let file, mode;
  try {
    const form = await request.formData();
    file = form.get("file");
    mode = form.get("mode");
    if (!(file instanceof Blob) || file.size < 1 || file.size > 4 * 1024 * 1024 || !["read", "layout"].includes(mode)) {
      return json({ error: "A document between 1 byte and 4 MiB and a read/layout mode are required." }, 400);
    }
  } catch { return json({ error: "Invalid multipart document upload." }, 400); }
  try {
    const { AzureKeyCredential, DocumentAnalysisClient } = await import("@azure/ai-form-recognizer");
    const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key));
    const poller = await client.beginAnalyzeDocument("prebuilt-" + mode, Buffer.from(await file.arrayBuffer()));
    const result = await poller.pollUntilDone();
    if (mode === "read") {
      if (!Array.isArray(result.pages)) throw new Error("Azure returned no pages.");
      return json({ result: result.pages.map((page, index) => ({ page: index + 1, content: (page.lines || []).map(line => line.content) })) });
    }
    if (!Array.isArray(result.tables)) throw new Error("Azure returned no tables.");
    return json({ result: result.tables.map(table => ({
      row_count: table.rowCount, column_count: table.columnCount,
      cells: table.cells.map(cell => ({ row_index: cell.rowIndex, column_index: cell.columnIndex, content: cell.content })),
    })) });
  } catch { return json({ error: "Azure document analysis failed." }, 502); }
}

export const config = {
  rateLimit: { windowLimit: 10, windowSize: 60, aggregateBy: ["ip", "domain"] },
};
