import PropTypes from "prop-types";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY_JE;

/**
 * Calls OpenAI's API to process user data and return a response.
 * @param {string} userData - Input data to be analyzed.
 * @param {Object} schema - JSON schema for structured output.
 * @param {string} promptType - Type of prompt (info, data, or charts).
 * @param {boolean} secondPass - Indicates if it's a second API pass for data completion.
 * @returns {Promise<string>} JSON response from OpenAI.
 */
async function callAPI(userData, schema, promptType, secondPass = false) {
    const systemPrompt = {
        info: "Génère un JSON structuré avec des informations clés sur l'entreprise...",
        data: secondPass
            ? "Complète un JSON structuré avec des données CSV..."
            : "Génère un JSON structuré avec des données CSV...",
        charts: "Génère des données JSON structurées pour des graphiques financiers...",
    }[promptType];

    if (!systemPrompt) {
        throw new Error("Invalid prompt type. Use 'info', 'data', or 'charts'.");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "gpt-4",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userData },
            ],
            functions: [{ name: "json_schema", parameters: schema }],
        }),
    });

    const responseData = await response.json();
    return responseData.choices?.[0]?.message?.content || "{}";
}

/**
 * Processes combined text and tabular data with OpenAI API and returns structured insights.
 * @param {string} combinedData - Combined text data for analysis.
 * @param {string} layoutData - Tabular data in CSV format.
 * @returns {Promise<Object>} Merged JSON response from the OpenAI API.
 */
async function generateCaseSummary(combinedData, layoutData) {
    const firmDataSchema = {}; // Replace with your firm data schema
    const firmInfoSchema = {}; // Replace with your firm info schema
    const firmChartsSchema = {}; // Replace with your firm charts schema

    // Generate data JSON
    const dataJSON = await callAPI(layoutData, firmDataSchema, "data");

    // Second pass for data completion
    const promptSecondPass = `
        Voici le CSV incomplet:
        ${dataJSON}
        Complète-le avec les tableaux suivants:
        ${layoutData}
    `;
    const completedDataJSON = await callAPI(
        promptSecondPass,
        firmDataSchema,
        "data",
        true
    );

    // Generate info JSON
    const infoJSON = await callAPI(combinedData, firmInfoSchema, "info");

    // Generate charts JSON
    const chartsJSON = await callAPI(combinedData, firmChartsSchema, "charts");

    // Merge and return results
    return {
        ...JSON.parse(infoJSON),
        ...JSON.parse(completedDataJSON),
        ...JSON.parse(chartsJSON),
    };
}

// PropTypes definitions
callAPI.propTypes = {
    userData: PropTypes.string.isRequired,
    schema: PropTypes.object.isRequired,
    promptType: PropTypes.oneOf(["info", "data", "charts"]).isRequired,
    secondPass: PropTypes.bool,
};

generateCaseSummary.propTypes = {
    combinedData: PropTypes.string.isRequired,
    layoutData: PropTypes.string.isRequired,
};

export { callAPI, generateCaseSummary };
