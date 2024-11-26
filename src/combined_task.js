import { docIntelMain } from "./A_doc_intelligence";
import { transformJsonToCsv } from "./B_reshaper";
import { perplexityFirstGlance } from "./C_perplexity_ai";
import { gatherData } from "./D_gather_data";
import { generateCaseSummary } from "./E_open_ai";
import { generatePdfReport } from "./F_pdf_creator";

/**
 * Main pipeline function to process the file and generate a structured report.
 * @param {File} file - PDF file to process.
 * @param {string} companyName - Name of the company.
 * @param {function} updateStatus - Callback to update status messages.
 * @param {function} updateProgress - Callback to update progress.
 */
async function main(file, companyName, updateStatus, updateProgress) {
    try {
        // Update progress
        updateStatus("Starting PDF analysis...");
        updateProgress(0);

        // Step 1: Analyze PDF with Azure (doc_intelligence equivalent)
        updateStatus("Analyzing PDF...");
        const { readContent, layoutTables } = await docIntelMain(file);
        updateProgress(20);

        // Step 2: Transform layout data to CSV
        updateStatus("Transforming tables into CSV...");
        const layoutDataCsv = transformJsonToCsv(layoutTables);
        updateProgress(40);

        // Step 3: Fetch initial company data with Perplexity API
        updateStatus("Fetching company details...");
        const firstGlanceData = await perplexityFirstGlance(companyName);
        updateProgress(60);

        // Step 4: Gather and prepare data
        updateStatus("Preparing data for analysis...");
        const combinedData = gatherData(firstGlanceData, readContent, layoutDataCsv);
        updateProgress(80);

        // Step 5: Generate structured data and summary using OpenAI
        updateStatus("Generating structured summary...");
        const structuredData = await generateCaseSummary(combinedData, layoutDataCsv);
        updateProgress(90);

        // Step 6: Generate PDF report
        updateStatus("Creating PDF report...");
        await generatePdfReport(structuredData, `${companyName}_Report.pdf`);
        updateProgress(100);

        updateStatus("Process completed successfully!");
    } catch (error) {
        updateStatus("An error occurred during processing.");
        console.error("Error in processing pipeline:", error);
    }
}

export default main;
