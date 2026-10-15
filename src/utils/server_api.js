let authorization = "";

export async function requestServer(endpoint, body) {
  const multipart = body instanceof FormData;
  const send = () => fetch("/.netlify/functions/" + endpoint, {
    method: "POST",
    headers: { ...(multipart ? {} : { "Content-Type": "application/json" }), ...(authorization ? { Authorization: authorization } : {}) },
    body: multipart ? body : JSON.stringify(body),
  });
  let response = await send();
  if (response.status === 401) {
    const password = window.prompt("Mot de passe d’accès à l’analyse :");
    if (!password) throw new Error("Un mot de passe d’accès est requis.");
    authorization = "Basic " + btoa(String.fromCharCode(...new TextEncoder().encode("access:" + password)));
    response = await send();
  }
  if (!response.headers.get("content-type")?.includes("application/json")) {
    throw new Error("Service d’analyse indisponible (HTTP " + response.status + ").");
  }
  const result = await response.json();
  if (!response.ok) {
    if (response.status === 401) authorization = "";
    throw new Error(result.error || "Échec de la requête (HTTP " + response.status + ").");
  }
  return result;
}
