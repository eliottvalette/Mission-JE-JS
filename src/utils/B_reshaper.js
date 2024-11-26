import PropTypes from "prop-types";

function transformJsonToCsv(layoutTables) {
    let csvData = "";

    layoutTables.forEach((table, tableIndex) => {
        csvData += `Table ${tableIndex + 1}\n`;
        const rows = [];

        // Iterate through table rows
        for (let rowIndex = 0; rowIndex < table.row_count; rowIndex++) {
            const row = Array(table.column_count).fill("");

            // Fill cells based on their row and column indices
            table.cells.forEach((cell) => {
                if (cell.row_index === rowIndex) {
                    row[cell.column_index] = cell.content;
                }
            });

            rows.push(row.join(","));
        }

        csvData += rows.join("\n") + "\n\n";
    });

    return csvData;
}

// PropTypes definitions
transformJsonToCsv.propTypes = {
    layoutTables: PropTypes.arrayOf(
        PropTypes.shape({
            row_count: PropTypes.number.isRequired,
            column_count: PropTypes.number.isRequired,
            cells: PropTypes.arrayOf(
                PropTypes.shape({
                    row_index: PropTypes.number.isRequired,
                    column_index: PropTypes.number.isRequired,
                    content: PropTypes.string.isRequired,
                })
            ).isRequired,
        })
    ).isRequired,
};


export { transformJsonToCsv };
