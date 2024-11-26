import html2pdf from "html2pdf.js";
import Handlebars from "handlebars";
import Config from "./config"; // Ensure this path is correct
import { preparePandasData } from "./Fa_csv_builder";
import { generateAllCharts, renderHtmlWithCharts } from "./Fb_charts_builder";

/**
 * Generates a PDF report from structured data.
 * @param {Object} data - Structured data for the report.
 * @param {string} pdfOutputName - Name for the generated PDF file.
 */
async function generatePdfReport(data, pdfOutputName = "output.pdf") {
    // Prepare CSV and table data for the report
    const { htmlDfInDict, dfsInDict } = preparePandasData(data);

    // Generate chart data
    const chartsData = generateAllCharts(data);

    // Combine chart HTML
    const chartsHtml = renderHtmlWithCharts(chartsData);

    // Compile the main template with Handlebars
    const template = Handlebars.compile(Config.htmlTemplate);

    // Render the HTML with dynamic data
    const renderedHtml = template({
        ...data,
        tableHtml: htmlDfInDict,
        chartsHtml: chartsHtml,
    });

    // Configure options for PDF generation
    const options = {
        filename: pdfOutputName,
        html2canvas: {},
        jsPDF: { format: "a4" },
    };

    // Generate and save the PDF
    await html2pdf().set(options).from(renderedHtml).save();
}

export { generatePdfReport };
