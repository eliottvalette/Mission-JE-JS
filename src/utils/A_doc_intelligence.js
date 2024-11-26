import PropTypes from "prop-types";
import { AzureKeyCredential, DocumentAnalysisClient } from "@azure/ai-form-recognizer";

// Initialize Azure Document Analysis client
const endpoint = import.meta.env.VITE_REACT_AZURE_ENDPOINT_JE ;
const key = import.meta.env.VITE_REACT_AZURE_KEY_JE;

if (!endpoint || !key) {
    throw new Error("Azure credentials are not set in the environment variables.");
}

const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key));

async function extractReadModel(file) {
    const poller = await client.beginAnalyzeDocument("prebuilt-read", file);
    const result = await poller.pollUntilDone();

    const pagesContent = result.pages.map((page, pageIndex) => ({
        page: pageIndex + 1,
        content: page.lines.map((line) => line.content),
    }));

    return pagesContent;
}

async function extractLayoutModel(file) {
    const poller = await client.beginAnalyzeDocument("prebuilt-layout", file);
    const result = await poller.pollUntilDone();

    const tables = result.tables.map((table) => ({
        row_count: table.rowCount,
        column_count: table.columnCount,
        cells: table.cells.map((cell) => ({
            row_index: cell.rowIndex,
            column_index: cell.columnIndex,
            content: cell.content,
        })),
    }));

    return tables;
}

async function docIntelMain(file) {
    const readContent = await extractReadModel(file);
    const layoutTables = await extractLayoutModel(file);

    return { readContent, layoutTables };
}

// PropTypes definitions
extractReadModel.propTypes = {
    file: PropTypes.instanceOf(File).isRequired,
};

extractLayoutModel.propTypes = {
    file: PropTypes.instanceOf(File).isRequired,
};

docIntelMain.propTypes = {
    file: PropTypes.instanceOf(File).isRequired,
};

export { docIntelMain, extractReadModel, extractLayoutModel };
