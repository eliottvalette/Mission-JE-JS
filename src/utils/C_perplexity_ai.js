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
                Tu es un assistant dédié à la recherche d'informations précises sur des entreprises...
                `,
            },
            {
                role: "user",
                content: `Trouve les informations détaillées pour l'entreprise ${companyName}.`,
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
