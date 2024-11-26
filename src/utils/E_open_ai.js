import PropTypes from "prop-types";
import Config from './config/config';

const OPENAI_API_KEY = import.meta.env.VITE_REACT_OPEN_AI_KEY_JE;

async function callAPI(userData, schema, promptType, secondPass = false) {
    const systemPrompt = {
        info: "Génère un JSON structuré avec des informations clés sur lentreprise, en résumant les données financières et les aspects importants des comptes.",
        data: secondPass
            ? "Génère un JSON structuré avec une structuration abrégée des comptes en format CSV. Aucune valeur ne doit être inventée; toutes les valeurs doivent être confirmées à 100%. Les valeurs manquantes doivent être remplacées par 0"
            : "Complete un JSON structuré avec une structuration abrégée des comptes en format CSV. Des chiffres sont manquants voire érronés. Aucune valeur ne doit être inventée; toutes les valeurs doivent être confirmées à 100%. Les valeurs qui restent manquantes doivent rester égales à 0.",
        charts: "Tu dois générer une réponse structurée au format JSON contenant les informations nécessaires pour créer des graphiques et diagrammes. Assure-toi que chaque tableau ou série de données nécessitant des dimensions égales (par exemple, Abscisse et Ordonnee pour les diagrammes en bâton, ou Periodes, Valeurs_Metrique, et Variation_Percent pour les courbes) contient le même nombre déléments.",
    }[promptType];

    if (!systemPrompt) {
        throw new Error("Invalid prompt type. Use info, data, or charts.");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            Authorization: `${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "gpt-4o",
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

async function generateCaseSummary(combinedData, layoutData) {
    const firmDataSchema = Config.firmData;
    const firmInfoSchema = Config.firmInfo;
    const firmChartsSchema = Config.firmCharts;

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
