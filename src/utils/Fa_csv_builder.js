import PropTypes from "prop-types";

/**
 * Prepares data for CSV files and HTML tables.
 * @param {Object} data - Input structured data.
 * @returns {Object} Object containing HTML tables and CSV data as strings.
 */
function preparePandasData(data) {
    const dfsInDict = {};
    const htmlDfInDict = Object.keys(data).map((key) => {
        const rows = data[key];
        if (!Array.isArray(rows)) return "";
        
        const tableHtml = `
            <table class="csv-table">
                <thead>
                    <tr>${Object.keys(rows[0]).map((col) => `<th>${col}</th>`).join("")}</tr>
                </thead>
                <tbody>
                    ${rows.map((row) => `<tr>${Object.values(row).map((val) => `<td>${val}</td>`).join("")}</tr>`).join("")}
                </tbody>
            </table>
        `;

        dfsInDict[key] = rows;
        return tableHtml;
    });

    return { htmlDfInDict: htmlDfInDict.join(""), dfsInDict };
}

// PropTypes definitions
preparePandasData.propTypes = {
    data: PropTypes.object.isRequired,
};

export { preparePandasData };
