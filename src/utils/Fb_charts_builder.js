import Chart from "chart.js/auto";

function generateAllCharts(data) {
    const charts = {};

    if (data.Diagramme_Baton) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Render bar chart
        new Chart(ctx, {
            type: "bar",
            data: {
                labels: data.Diagramme_Baton.Abscisse,
                datasets: [
                    {
                        label: "Moyenne",
                        data: data.Diagramme_Baton.Ordonnee,
                        backgroundColor: "rgba(75, 192, 192, 0.2)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            },
        });

        // Ensure chart is rendered before extracting Base64 data
        charts["Diagramme Baton"] = canvas.toDataURL("image/png");
        console.log("Bar chart generated successfully");
    }

    if (data.Diagramme_Circulaire) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Render pie chart
        new Chart(ctx, {
            type: "pie",
            data: {
                labels: data.Diagramme_Circulaire.Categories,
                datasets: [
                    {
                        label: "Diagramme Circulaire",
                        data: data.Diagramme_Circulaire.Valeurs,
                        backgroundColor: [
                            "rgba(255, 99, 132, 0.2)",
                            "rgba(54, 162, 235, 0.2)",
                            "rgba(255, 206, 86, 0.2)",
                            "rgba(75, 192, 192, 0.2)",
                        ],
                        borderColor: [
                            "rgba(255, 99, 132, 1)",
                            "rgba(54, 162, 235, 1)",
                            "rgba(255, 206, 86, 1)",
                            "rgba(75, 192, 192, 1)",
                        ],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            },
        });

        // Ensure chart is rendered before extracting Base64 data
        charts["Diagramme Circulaire"] = canvas.toDataURL("image/png");
        console.log("Pie chart generated successfully");
    }

    return charts;
}


export { generateAllCharts };
