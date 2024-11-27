import html2pdf from "html2pdf.js";
import Handlebars from "handlebars";
import Config from "./config/config";
import preparePandasData from "./Fa_csv_builder";
import { generateAllCharts } from "./Fb_charts_builder";

async function generatePdfReport(data, pdfOutputName = "output.pdf") {
    // Process data into tables
    const { htmlDfInDict, dfsInDict } = preparePandasData(data);

    const template = Handlebars.compile(Config.htmlTemplate);
    const renderedHtml = template({
        ...data,
        tableHtml: htmlDfInDict,
    });

    console.log("dfsInDict:", dfsInDict);


    // PDF options
    const options = {
        filename: pdfOutputName,
        html2canvas: {
            scale: 2,
            logging: true,
            useCORS: true,
        },
        jsPDF: {
            unit: "cm",
            format: "a4",
            orientation: "portrait",
        },
    };
    const pdfBlob = await html2pdf().set(options).from(renderedHtml).output("blob");
    const blobUrl = URL.createObjectURL(pdfBlob);

    // Generate CSV download links
    const csvLinks = Object.entries(dfsInDict).map(([key, records]) => {
        // Convert records (array of objects) to CSV string
        const csvContent = [
            Object.keys(records[0]).join(","), // Header row
            ...records.map((row) => Object.values(row).join(",")), // Data rows
        ].join("\n");

        // Create Blob for CSV
        const csvBlob = new Blob([csvContent], { type: "text/csv" });
        const csvBlobUrl = URL.createObjectURL(csvBlob);

        // Return CSV link details
        return { name: `${key}.csv`, url: csvBlobUrl };
    });

    // Return links
    return {
        pdf: { name: pdfOutputName, url: blobUrl },
        csvs: csvLinks,
    };
}

export { generatePdfReport };
