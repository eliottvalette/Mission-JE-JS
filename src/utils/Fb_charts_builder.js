import Chart from "chart.js/auto";

async function generateAllCharts(data) {
    const charts = {};
    const chartContainer = document.createElement("div");
    chartContainer.style.display = "none"; // Hide the container to prevent it from displaying
    document.body.appendChild(chartContainer);

    // Function to generate a chart and return its Data URL after rendering
    const generateChart = (type, chartData, options) => {
        return new Promise((resolve, reject) => {
            try {
                const canvas = document.createElement("canvas");
                chartContainer.appendChild(canvas);
                const chart = new Chart(canvas, {
                    type: type,
                    data: chartData,
                    options: {
                        ...options,
                        animation: {
                            onComplete: () => {
                                const dataURL = canvas.toDataURL("image/png");
                                resolve(dataURL);
                                chart.destroy(); // Clean up the chart instance
                                canvas.remove();  // Remove the canvas from the DOM
                            },
                        },
                        responsive: true,
                        maintainAspectRatio: false,
                    },
                });
            } catch (error) {
                console.error("Error generating chart:", error);
                reject(error);
            }
        });
    };

    // Generate Diagramme Baton (Bar Chart)
    if (data.Diagramme_Baton) {
        const barChartData = {
            labels: data.Diagramme_Baton.Abscisse,
            datasets: [{
                label: 'Chiffre d\'Affaires',
                data: data.Diagramme_Baton.Ordonnee,
                backgroundColor: 'rgba(46, 108, 128, 0.6)',
                borderColor: 'rgba(46, 108, 128, 1)',
                borderWidth: 1,
            }],
        };
        const barChartOptions = {
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: true,
                    text: 'Diagramme Baton',
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        };
        const barChartURL = await generateChart('bar', barChartData, barChartOptions);
        charts["Diagramme_Baton"] = barChartURL;
        console.log("Bar chart generated successfully.");
    }

    // Generate Diagramme Circulaire (Pie Chart)
    if (data.Diagramme_Circulaire) {
        const pieChartData = {
            labels: data.Diagramme_Circulaire.Categories,
            datasets: [{
                data: data.Diagramme_Circulaire.Valeurs,
                backgroundColor: [
                    'rgba(46, 108, 128, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    // Add more colors if needed
                ],
                borderColor: [
                    'rgba(46, 108, 128, 1)',
                    'rgba(255, 99, 132, 1)',
                    // Add more border colors if needed
                ],
                borderWidth: 1,
            }],
        };
        const pieChartOptions = {
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Diagramme Circulaire',
                },
            },
        };
        const pieChartURL = await generateChart('pie', pieChartData, pieChartOptions);
        charts["Diagramme_Circulaire"] = pieChartURL;
        console.log("Pie chart generated successfully.");
    }

    document.body.removeChild(chartContainer);
    return charts;
}

export { generateAllCharts };