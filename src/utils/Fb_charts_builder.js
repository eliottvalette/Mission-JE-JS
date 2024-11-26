import PropTypes from "prop-types";
import Chart from "chart.js/auto";

/**
 * Generates all charts as Base64 images.
 * @param {Object} data - Input data for charts.
 * @returns {Object} Object containing Base64 images for charts.
 */
function generateAllCharts(data) {
    const charts = {};

    // Example: Generate a bar chart
    if (data.barChart) {
        const canvas = document.createElement("canvas");
        new Chart(canvas, {
            type: "bar",
            data: {
                labels: data.barChart.labels,
                datasets: [{ data: data.barChart.values, label: "Example Bar Chart" }],
            },
        });

        charts["Bar Chart"] = canvas.toDataURL("image/png");
    }

    // Add other chart types (pie, line, etc.) similarly
    return charts;
}

/**
 * Renders HTML content for charts.
 * @param {Object} charts - Object containing Base64 images for charts.
 * @returns {string} HTML string embedding all charts.
 */
function renderHtmlWithCharts(charts) {
    return Object.entries(charts)
        .map(
            ([chartName, chartImg]) => `
            <div class="chart-section">
                <h3>${chartName}</h3>
                <img src="${chartImg}" alt="${chartName}" style="width: 100%; max-width: 600px;"/>
            </div>
        `
        )
        .join("");
}

// PropTypes definitions
generateAllCharts.propTypes = {
    data: PropTypes.object.isRequired,
};

renderHtmlWithCharts.propTypes = {
    charts: PropTypes.object.isRequired,
};

export { generateAllCharts, renderHtmlWithCharts };
