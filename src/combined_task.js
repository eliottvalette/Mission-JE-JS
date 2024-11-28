import { docIntelMain } from "./utils/A_doc_intelligence";
import { transformJsonToCsv } from "./utils/B_reshaper";
import { perplexityFirstGlance } from "./utils/C_perplexity_ai";
import { gatherData } from "./utils/D_gather_data";
import { generateCaseSummary } from "./utils/E_open_ai";
import { generatePdfReport } from "./utils/F_pdf_creator";

function saveDebugFile(filename, data) {
    try {
        const content = typeof data === "string" ? data : JSON.stringify(data, null, 2);
        const blob = new Blob([content], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error(`Failed to save debug file (${filename}):`, error);
    }
} 

async function main(file, companyName, updateStatus, updateProgress) {
    try {
        updateStatus("Starting PDF analysis...");
        updateProgress(0);

        // Step 1: Analyze PDF with Azure
        updateStatus("Analyzing PDF...");
        const { readContent, layoutTables } = await docIntelMain(file);
        await saveDebugFile("step1_doc_intelligence.json", { readContent, layoutTables });
        updateProgress(20);

        // Step 2: Transform layout data to CSV
        updateStatus("Transforming tables into CSV...");
        const layoutDataCsv = transformJsonToCsv(layoutTables);
        await saveDebugFile("step2_transformed_csv.csv", layoutDataCsv);
        updateProgress(40);

        // Step 3: Fetch company data with Perplexity API
        updateStatus("Fetching company details...");
        const firstGlanceData = await perplexityFirstGlance(companyName);
        await saveDebugFile("step3_perplexity_data.json", firstGlanceData);
        updateProgress(60);

        // Step 4: Gather all data
        updateStatus("Preparing data for analysis...");
        const combinedData = gatherData(firstGlanceData, readContent, layoutDataCsv);
        await saveDebugFile("step4_combined_data.txt", combinedData);
        updateProgress(80);

        // Step 5: Generate structured data and summary using OpenAI
        updateStatus("Generating structured summary...");
        const structuredData = await generateCaseSummary(combinedData, layoutDataCsv);
        await saveDebugFile("step5_structured_data.json", structuredData);
        updateProgress(90);

        // Step 6: Generate PDF report
        updateStatus("Creating PDF report...");
        const downloadLinks = await generatePdfReport(structuredData, `${companyName}_Report.pdf`);
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
