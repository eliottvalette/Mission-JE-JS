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

const firstGlanceData = 
`
 Entreprises:
 Nom : Maison Coudeyrat
 Téléphone : Non disponible
 Code APE : 1011Z  Transformation et conservation de la viande de boucherie[1][5]
 Code SIREN : 311547111[1][5]
 Registre du Commerce : Immatriculée au Registre du Commerce et des Sociétés de Bergerac sous le numéro 311547111[1]
 Dénomination Sociale : Société à responsabilité limitée à associé unique[1][5]
 Sigle ou Enseigne : Non disponible
 Adresse Siège Social : Zone Artisanale, 24260 Le Bugue, Dordogne[1][5]
 Objet Social : Fabrication, transformation, conditionnement et vente de tous produits de charcuterie, abattage des porcs, revente en gros demigros et détail[5]
 Forme Juridique & Capital Social : Société à responsabilité limitée à associé unique, capital social de 130000,00 EURO[1]
 Commencement d'Exploitation : 1900[1][5]
 Exploitation du Fonds : Actif depuis 46 ans, avec un effectif compris entre 20 et 49 salariés en 2021[1][5]

 Dirigeant :
 Nom : Benoit David
 Prénom : Benoit
 Nationalité : Non disponible
 Téléphone Portable : Non disponible
 Email : Non disponible

 Groupe :
 Appartenance : Non disponible
 Structures Affiliées : Non disponible
 Historique des Acquisitions (Date, Montant, Description) : Non disponible

 Capital :
 Augmentations de Capital (Date, Montant, Description) : Non disponible

 Autres Informations utiles sur le groupe ou la société :
 Secteur d'Activité : Transformation et conservation de la viande de boucherie[1][5]
 Données Financières : Chiffre d'affaires de 5 580 000,00 EU en 2023[1]
 Situation Actuelle : En procédure de redressement judiciaire, cherchant un repreneur pour pérenniser son savoirfaire[2]

 Remarques :
 Les données fournies ne mentionnent pas de structures affiliées ou d'acquisitions. Les informations sur le dirigeant et le capital social sont disponibles, mais les téléphones et emails ne sont pas accessibles.

Les informations fournies sont basées sur les sources disponibles et ne comprennent pas les détails sur les relations organisationnelles mentionnées dans l'exemple fourni par l'utilisateur.
`;


async function main(file, companyName, groupData, updateStatus, updateProgress) {
    try {
        updateStatus("Starting PDF analysis...");
        updateProgress(0);

        // Step 1: Analyze PDF with Azure
        updateStatus("Analyzing PDF...");
        // const { readContent, layoutTables } = await docIntelMain(file);
        // await saveDebugFile("step1_doc_intelligence.json", { readContent, layoutTables });
        updateProgress(20);

        // Step 2: Transform layout data to CSV
        updateStatus("Transforming tables into CSV...");
        // const layoutDataCsv = transformJsonToCsv(layoutTables);
        // await saveDebugFile("step2_transformed_csv.csv", layoutDataCsv);
        updateProgress(40);

        // Step 3: Fetch company data with Perplexity API
        updateStatus("Fetching company details...");
        // const firstGlanceData = await perplexityFirstGlance(companyName, groupData);
        // await saveDebugFile("step3_perplexity_data.json", firstGlanceData);
        updateProgress(60);

        // Step 4: Gather all data
        updateStatus("Preparing data for analysis...");
        // const combinedData = gatherData(firstGlanceData, readContent, layoutDataCsv);
        // await saveDebugFile("step4_combined_data.txt", combinedData);
        updateProgress(80);

        // Step 5: Generate structured data and summary using OpenAI
        updateStatus("Generating structured summary...");
        // const structuredData = await generateCaseSummary(combinedData, layoutDataCsv);
        // await saveDebugFile("step5_structured_data.txt", structuredData);
        updateProgress(90);

        // Step 6 Generate the Organigram Nodes and Hedges
        updateStatus("Generating Group Organigram...");
        const organigramStructure = await generateOrganigramStructure(firstGlanceData, groupData, companyName);
        // await saveDebugFile("step6_organigram_structure.json", organigramStructure);
        updateProgress(92);

        // Step 6: Generate the Organigram
        updateStatus("Drawing Group Organigram...");
        const organigramLink = drawOrganigram(organigramStructure, 'organigramCanvas', companyName);
        updateProgress(95);

        // Step 7: Generate PDF report
        updateStatus("Creating PDF report...");
        // const downloadLinks = await generatePdfReport(structuredData, `${companyName}_Report.pdf`);
        // create a dummy downloadLinks
        const downloadLinks = {
            pdf: { name: `${companyName}_Report.pdf`, url: "https://example.com/report.pdf" },
            csvs: [
                { name: "data.csv", url: "https://example.com/data.csv" },
                { name: "info.csv", url: "https://example.com/info.csv" },
                { name: "charts.csv", url: "https://example.com/charts.csv" },
            ],
            org: { name: `${companyName}_Organigram.png`, url: organigramLink },
        };

        updateStatus("Process completed successfully!");
        updateProgress(100);

        return downloadLinks;
    } catch (error) {
        updateStatus("An error occurred during processing.");
        console.error("Error in processing pipeline:", error);
        return null;
    }
}

export default main;
