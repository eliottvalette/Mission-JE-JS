import PropTypes from "prop-types";

const PERPLEXITY_AI_KEY_JE= import.meta.env.VITE_REACT_PERPLEXITY_AI_KEY_JE

async function perplexityFirstGlance(companyName) {
    const url = "https://api.perplexity.ai/chat/completions";

    const payload = {
        model: "llama-3.1-sonar-small-128k-online",
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
                    - Commencement d’Exploitation :
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

                    Autres Informations :
                    - Labels et Certifications :
                    - Marques :
                    - Partenariats Stratégiques :

                    Assure-toi que les informations proviennent de sources fiables et vérifiables. Indique si des données sont indisponibles.
                `,
            },
            {
                role: "user",
                content: `Trouve les informations détaillées pour l'entreprise ${companyName}. Assure-toi d'inclure les détails sur le secteur d'activité et les données financières si elles sont disponibles.`,
            },
        ],
    };

    const headers = {
        Authorization: `Bearer ${PERPLEXITY_AI_KEY_JE}`,
        "Content-Type": "application/json",
    };

    const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "No content found";

    return content.replace(/[*#-]/g, "");
}

perplexityFirstGlance.propTypes = {
    companyName: PropTypes.string.isRequired,
};

export { perplexityFirstGlance };
