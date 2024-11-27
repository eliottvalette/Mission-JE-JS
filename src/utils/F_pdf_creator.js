import html2pdf from "html2pdf.js";
import Handlebars from "handlebars";
import Config from "./config/config";
import preparePandasData from "./Fa_csv_builder";

async function generatePdfReport(data, pdfOutputName = "output.pdf") {
    // Process data into tables
    const { htmlDfInDict, dfsInDict } = preparePandasData(data);

    const template = Handlebars.compile(Config.htmlTemplate);
    const renderedHtml = template({
        ...data,
        tableHtml: htmlDfInDict,
    });

    console.log("Rendered HTML:", renderedHtml);


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

    const csvLinks = Object.entries(dfsInDict).map(([fileName, csvContent]) => {
        const csvBlob = new Blob([csvContent], { type: "text/csv" });
        const csvBlobUrl = URL.createObjectURL(csvBlob);
        return { name: `${fileName}.csv`, url: csvBlobUrl };
    });

    // Return links
    return {
        pdf: { name: pdfOutputName, url: blobUrl },
        csvs: csvLinks,
    };
}

export { generatePdfReport };
