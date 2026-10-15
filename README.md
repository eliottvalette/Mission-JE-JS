# Front-End a revoir (shadcn et on passe sur Vite)
# Optimisation massive des coûts (NSM Azure)

## Private provider credentials

OpenAI, Perplexity, and Azure requests run in Netlify Functions. The frontend contains no provider keys. Configure OPENAI_API_KEY, PERPLEXITY_API_KEY, AZURE_DOCUMENT_ENDPOINT, AZURE_DOCUMENT_KEY, and APP_ACCESS_PASSWORD (at least 20 characters) in Netlify with the Functions scope. Import the ignored local .env if needed; .env.example contains names only. Remove all legacy VITE_REACT_* credential variables from Netlify and use rotated provider keys.

The browser requests the application access password on first analysis and keeps it only in memory for that page session. Share it only with authorized users. Requests require HTTPS in production, reject cross-origin browser calls, and are limited to 10 per minute per IP and domain per endpoint. PDF uploads are limited to 4 MiB. A standalone static host cannot serve these APIs; use Netlify or netlify dev.

Run npm test and npm run build. The build disables custom browser environment variables and rejects private keys/provider SDKs in generated assets. The Perplexity server call uses the documented Sonar-compatible endpoint (/v1/sonar) and sonar model. Rotate credentials already present in older deployments; a new build does not invalidate downloaded keys.
