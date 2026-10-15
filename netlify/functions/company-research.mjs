import { authorize, complete, getEnv, json, readJson } from "./lib/http.mjs";

export default async function handler(request) {
  const denied = authorize(request);
  if (denied) return denied;
  const key = getEnv("PERPLEXITY_API_KEY");
  if (!key) return json({ error: "PERPLEXITY_API_KEY is not configured." }, 503);
  let companyName, groupData;
  try {
    const body = await readJson(request);
    companyName = body.companyName;
    groupData = body.groupData ?? "";
    if (typeof companyName !== "string" || !companyName.trim() || companyName.length > 2000 ||
        typeof groupData !== "string" || groupData.length > 100000) {
      return json({ error: "Invalid company research parameters." }, 400);
    }
  } catch { return json({ error: "Invalid JSON request or request exceeds 200 KB." }, 400); }
  try {
    const payload = {
        model: "sonar",
        max_tokens: 4000,
        messages: [
            {
                role: "system",
                content: `
                Tu es un assistant dédié à la recherche d'informations précises sur des entreprises. Tu dois analyser les données publiques disponibles (sites web, bases de données d'entreprise, articles, etc.) et donner une réponse complète et organisée au format suivant :
                    Entreprises:
                    - Nom :
                    - Téléphone :
                    - Code APE :
                    - Code SIREN :
                    - Registre du Commerce :
                    - Dénomination Sociale :
                    - Sigle ou Enseigne :
                    - Adresse Siège Social :
                    - Objet Social :
                    - Forme Juridique & Capital Social :
                    - Commencement d Exploitation :
                    - Exploitation du Fonds :

                    Dirigeant :
                    - Nom :
                    - Prénom :
                    - Nationalité :
                    - Téléphone Portable :
                    - Email :

                    Groupe :
                    - Appartenance :
                    - Structures Affiliées :
                    - Historique des Acquisitions (Date, Montant, Description) :

                    Capital :
                    - Augmentations de Capital (Date, Montant, Description) :

                    Autres Informations utiles sur le groupe ou la société :

                    Informations sur l'ensemble des acteurs ou entités cités dans les informations données par l'utilisateur :
                    Exemple :
                    - Société A : Secteur d'activité, Role dans le groupe...
                    - Société B : Secteur d'activité, Role dans le groupe...

                    Assure-toi que les informations proviennent de sources fiables et vérifiables. Indique si des données sont indisponibles.
                `,
            },
            {
                role: "user",
                content: `
                Trouve les informations détaillées pour l'entreprise ${companyName}.
                Assure-toi d'inclure les détails sur le secteur d'activité et les données financières si elles sont disponibles.
                Voici les informations supplémentaires fournies par l'utilisateur :
                ${groupData}
                `,
            },
        ],
    };

    const content = await complete("https://api.perplexity.ai/v1/sonar", key, payload);
    return json({ content: content.replace(/[*#-]/g, "") });
  } catch { return json({ error: "Company research failed." }, 502); }
}

export const config = {
  rateLimit: { windowLimit: 10, windowSize: 60, aggregateBy: ["ip", "domain"] },
};
