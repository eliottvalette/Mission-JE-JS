import PropTypes from "prop-types";
import Config from './config/config';
import { requestServer } from './server_api';

async function callAPI(userData, schema, promptType, secondPass = false) {
  const result = await requestServer('openai-analysis', { userData, schema, promptType, secondPass });
  if (typeof result.content !== 'string') throw new Error('Invalid analysis response.');
  return result.content;
}

async function generateCaseSummary(combinedData, layoutData) {
    const firmDataSchema = Config.firmData;
    const firmInfoSchema = Config.firmInfo;
    const firmChartsSchema = Config.firmCharts;
    const operationPrecision = Config.operationPrecision

    // Generate CSVs First Pass
    const csv_first_pass = await callAPI(layoutData, firmDataSchema, "data");
    console.log('csv first pass', csv_first_pass);

    // Second pass for data completion
    const promptSecondPass = `
        Voici le CSV incomplet: ${csv_first_pass} \n
        Complète-le avec les tableaux suivants: ${layoutData} \n
        Par ailleurs : ${operationPrecision}\n
    `;

    // Generate CSVs Second Pass
    const csv_second_pass = await callAPI(promptSecondPass, firmDataSchema, "data", true);
    console.log('csv second pass', csv_second_pass);

    // Generate info JSON
    const infoJSON = await callAPI(combinedData, firmInfoSchema, "info");
    console.log('info json', infoJSON);

    // Generate charts JSON
    const chartsJSON = await callAPI(combinedData, firmChartsSchema, "charts");
    console.log('charts json', chartsJSON);

    // Merge and return results
    return {
        ...JSON.parse(infoJSON),
        ...JSON.parse(csv_second_pass),
        ...JSON.parse(chartsJSON),
    };
}

async function generateOrganigramStructure(firstGlanceData, groupData, companyName) {
    const organigramSchema = Config.organigramSchema;
    console.log('organigram schema', organigramSchema);
    const prompt = `
    Utilise les données suivantes pour générer la structure de l'organigramme pour l'entreprise ${companyName}:
    ${firstGlanceData}
    et les informations supplémentaires données par l'utilisateur :
    ${groupData}
    `;

    console.log('organigram prompt', prompt);

    const organigramStructure = await callAPI(prompt, organigramSchema, "organigram");
    console.log('organigramStructure', organigramStructure);
    return JSON.parse(organigramStructure);
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

generateOrganigramStructure.propTypes = {
    firstGlanceData: PropTypes.string.isRequired,
    companyName: PropTypes.string.isRequired,
};

export { callAPI, generateCaseSummary, generateOrganigramStructure };