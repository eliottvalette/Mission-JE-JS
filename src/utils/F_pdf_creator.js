import html2pdf from "html2pdf.js";
import Handlebars from "handlebars";
import Config from "./config/config";
import preparePandasData from "./Fa_csv_builder";
import { generateAllCharts } from "./Fb_charts_builder";

async function generatePdfReport(data, pdfOutputName = "output.pdf") {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Process data into tables
    const { htmlDfInDict, dfsInDict } = preparePandasData(data);

    // Generate the chart base64 image
    const chartImages = await generateAllCharts(data);
    const imageBar = chartImages[0];
    const imagePie = chartImages[1];
    const imageLine = chartImages[2];
    const imageRadar = chartImages[3];

    // Compile the Handlebars template
    const template = Handlebars.compile(Config.htmlTemplate);
    
    // Render the HTML with the chart image
    const renderedHtml = template({
        ...data,
        tableHtml: htmlDfInDict,
        imageBar: imageBar,
        imagePie: imagePie,
        imageLine: imageLine,
        imageRadar: imageRadar,
    });

    // PDF options
    const options = {
        margin: [2, 1, 2, 1],
        filename: pdfOutputName,
        html2canvas: {
            scale: 2,
            logging: true,
            useCORS: true,
        },
        image: { type: 'jpeg', quality: 0.98 },
        jsPDF: {
            unit: "cm",
            format: "a4",
            orientation: "portrait",
        },
    };

    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate the PDF from the rendered HTML string
    const pdfBlob = await html2pdf().set(options).from(renderedHtml).output("blob");
    const blobUrl = URL.createObjectURL(pdfBlob);

    // Generate CSV download links (existing functionality)
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

    console.log('html :', renderedHtml)

    // Return links
    return {
        pdf: { name: pdfOutputName, url: blobUrl },
        csvs: csvLinks,
    };
}

export { generatePdfReport };
