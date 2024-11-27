import PropTypes from "prop-types";

function gatherData(firstGlance, readContent, layoutTables) {
    // Process text content from the first 5 pages
    const first5Pages = JSON.stringify(
        readContent.slice(0, 5).map((page, index) => ({
            page: index + 1,
            content: page.content.join("\n"),
        }))
    );

    // Combine all data
    let combinedData = `
        Informations utiles:
        ${firstGlance}

        Texte des 5 premières pages:
        ${first5Pages}

        Données tabulaires:
        ${layoutTables}
    `;

    // Filter out lines containing "unselected"
    combinedData = combinedData
        .split("\n")
        .filter((line) => !line.includes("unselected"))
        .join("\n");

    return combinedData;
}

// PropTypes definitions
gatherData.propTypes = {
    firstGlance: PropTypes.string.isRequired,
    readContent: PropTypes.arrayOf(
        PropTypes.shape({
            page: PropTypes.number.isRequired,
            content: PropTypes.arrayOf(PropTypes.string).isRequired,
        })
    ).isRequired,
    layoutTables: PropTypes.string.isRequired,
};

export { gatherData };
