import html2pdf from "html2pdf.js";
import Handlebars from "handlebars";
import Config from "./config/config";
import preparePandasData from "./Fa_csv_builder";
import { generateAllCharts, renderHtmlWithCharts } from "./Fb_charts_builder";

async function generatePdfReport(data, pdfOutputName = "output.pdf") {
    const { htmlDfInDict } = preparePandasData(data);

    const chartsData = generateAllCharts(data);
    const chartsHtml = renderHtmlWithCharts(chartsData);

    const template = Handlebars.compile(Config.htmlTemplate);
    const renderedHtml = template({
        ...data,
        tableHtml: htmlDfInDict,
        chartsHtml: chartsHtml,
    });

    for (const chart of chartsData) {
        await chart.toBlob();
    }

    console.log("Rendered HTML:", renderedHtml);

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

    await html2pdf().set(options).from(renderedHtml).save();
}


export { generatePdfReport };