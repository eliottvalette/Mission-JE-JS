import html2pdf from "html2pdf.js";
import Handlebars from "handlebars";
import Config from "./config/config";
import preparePandasData from "./Fa_csv_builder";
import { generateAllCharts } from "./Fb_charts_builder";

async function generatePdfReport(data, pdfOutputName = "output.pdf") {
    // Process data into tables
    const { htmlDfInDict, dfsInDict } = preparePandasData(data);

    const chartsData = await generateAllCharts(data);

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

    // Generate PDF from the hidden container
    await html2pdf().set(options).from(renderedHtml).save();
}

export { generatePdfReport };
