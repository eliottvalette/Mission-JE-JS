import { requestServer } from './server_api';

export async function perplexityFirstGlance(companyName, groupData) {
  const result = await requestServer('company-research', { companyName, groupData });
  if (typeof result.content !== 'string') throw new Error('Invalid company research response.');
  return result.content;
}
