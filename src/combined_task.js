import { docIntelMain } from "./utils/A_doc_intelligence";
import { transformJsonToCsv } from "./utils/B_reshaper";
import { perplexityFirstGlance } from "./utils/C_perplexity_ai";
import { gatherData } from "./utils/D_gather_data";
import { generateCaseSummary, generateOrganigramStructure } from "./utils/E_open_ai";
import { generatePdfReport } from "./utils/F_pdf_creator";
import { drawOrganigram } from "./utils/G_organigram";

function saveDebugFile(filename, data) {
    try {
        const content = typeof data === "string" ? data : JSON.stringify(data, null, 2);
        const blob = new Blob([content], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `/${filename}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error(`Failed to save debug file (${filename}):`, error);
    }
} 

async function main(file, companyName, groupData, updateStatus, updateProgress) {
    try {
        updateStatus("Démarrage de l'analyse PDF...");
        updateProgress(0);

        // Step 1: Analyze PDF with Azure
        updateStatus("Analyse du PDF en cours...");
        updateProgress(15);
        const { readContent, layoutTables } = await docIntelMain(file);
        // await saveDebugFile("step1_doc_intelligence.json", { readContent, layoutTables });
        
        // Step 2: Transform layout data to CSV
        updateStatus("Transformation des tableaux en CSV...");
        const layoutDataCsv = transformJsonToCsv(layoutTables);
        // await saveDebugFile("step2_transformed_csv.csv", layoutDataCsv);
        updateProgress(25);

        // Step 3: Fetch company data with Perplexity API
        updateStatus("Récupération des détails de l'entreprise...");
        const firstGlanceData = await perplexityFirstGlance(companyName, groupData);
        // await saveDebugFile("step3_perplexity_data.json", firstGlanceData);
        updateProgress(40);

        // Step 4: Gather all data
        updateStatus("Préparation des données pour l'analyse...");
        const combinedData = gatherData(firstGlanceData, readContent, layoutDataCsv);
        // await saveDebugFile("step4_combined_data.txt", combinedData);
        updateProgress(45);

        // Step 5: Generate structured data and summary using OpenAI
        updateStatus("Génération du résumé structuré...");
        const structuredData = await generateCaseSummary(combinedData, layoutDataCsv);
        // await saveDebugFile("step5_structured_data.txt", structuredData);
        updateProgress(50);

        // Step 6 Generate the Organigram Nodes and Hedges
        updateStatus("Génération de l'organigramme du groupe...");
        const organigramStructure = await generateOrganigramStructure(firstGlanceData, groupData, companyName);
        // await saveDebugFile("step6_organigram_structure.json", organigramStructure);
        updateProgress(85);

        // Step 6: Generate the Organigram
        updateStatus("Dessiner l'organigramme du groupe...");
        const organigramLink = drawOrganigram(organigramStructure, 'organigramCanvas', companyName);
        updateProgress(90);

        // Step 7: Generate PDF report
        updateStatus("Création du rapport PDF...");
        updateProgress(95);
        const downloadLinks = await generatePdfReport(structuredData, `${companyName}_Report.pdf`);
        downloadLinks['org'] = { name: `${companyName}_Organigram.png`, url: organigramLink };

        updateStatus("Processus terminé avec succès !");
        updateProgress(100);

        return downloadLinks;
    } catch (error) {
        updateStatus("Une erreur s'est produite lors du traitement.");
        console.error("Error in processing pipeline:", error);
        throw error;
    }
}

export default main;
