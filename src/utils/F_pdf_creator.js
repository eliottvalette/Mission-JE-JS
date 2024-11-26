import html2pdf from "html2pdf.js";
import PropTypes from "prop-types";
import { preparePandasData } from "./Fa_csv_builder";
import { generateAllCharts, renderHtmlWithCharts } from "./Fb_charts_builder";

/**
 * Generates a PDF report from structured data.
 * @param {Object} data - Structured data for the report.
 * @param {string} pdfOutputName - Name for the generated PDF file.
 */
async function generatePdfReport(data, pdfOutputName = "output.pdf") {
    // Ensure `data` is an object
    if (typeof data !== "object" || data === null) {
        throw new Error("Data provided to generatePdfReport must be a non-null object.");
    }

    // Prepare data for CSV and charts
    const { htmlDfInDict, dfsInDict } = preparePandasData(data);

    // Generate charts data
    const chartsData = generateAllCharts(data);

    // Render the main HTML template
    const renderedHtml = `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
            <style>
                /* Include your custom CSS here */
                body { font-family: 'Roboto', Arial, sans-serif; color: #333; }
                .section { margin: 20px 0; }
                .csv-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                .csv-table th, .csv-table td { border: 1px solid #ddd; padding: 8px; }
                .csv-table th { background-color: #f2f2f2; text-align: center; }
            </style>
        </head>
        <body>
            <h1>Bilan Économique & Social</h1>
            <div class="section">
                <h2>1. Informations Générales</h2>
                <p>${data.info || "Pas d'informations disponibles."}</p>
            </div>
            <div class="section">
                <h2>2. Données Tabulaires</h2>
                ${htmlDfInDict}
            </div>
            <div class="section">
                <h2>3. Visualisations</h2>
                ${renderHtmlWithCharts(chartsData)}
            </div>
        </body>
        </html>
    `;

    // Convert HTML to PDF
    const options = {
        filename: pdfOutputName,
        html2canvas: {},
        jsPDF: { format: "a4" },
    };

    await html2pdf().set(options).from(renderedHtml).save();
}

// PropTypes definitions
generatePdfReport.propTypes = {
    data: PropTypes.object.isRequired,
    pdfOutputName: PropTypes.string,
};

export { generatePdfReport };
