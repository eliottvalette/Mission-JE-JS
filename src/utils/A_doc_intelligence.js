import { requestServer } from './server_api';

async function analyzeDocument(file, mode) {
  if (!(file instanceof Blob)) throw new Error('A document file is required.');
  const body = new FormData();
  body.append('file', file, file.name || 'document.pdf');
  body.append('mode', mode);
  const result = await requestServer('document-analysis', body);
  if (!Array.isArray(result.result)) throw new Error('Invalid document analysis response.');
  return result.result;
}

export function extractReadModel(file) { return analyzeDocument(file, 'read'); }
export function extractLayoutModel(file) { return analyzeDocument(file, 'layout'); }
export async function docIntelMain(file) {
  const readContent = await extractReadModel(file);
  const layoutTables = await extractLayoutModel(file);
  return { readContent, layoutTables };
}
