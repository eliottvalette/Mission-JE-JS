import Chart from "chart.js/auto";

async function generateOneChart(data, type) {
    return new Promise((resolve, reject) => {
        try {
            // Get the hidden canvas element
            const canvas = document.getElementById(`chart-${type}`);
            if (!canvas) {
                throw new Error("Canvas element with id 'chart' not found.");
            }
            const ctx = canvas.getContext('2d');

            let myChart;
            // 1. Bar Chart (Diagramme_Baton)
            if (type ==="bar") {
                const { Abscisse, Ordonnee, Moyenne, Unite } = data.Diagramme_Baton;
                myChart = new Chart(ctx, {
                    type: "bar",
                    data: {
                        labels: Abscisse,
                        datasets: [
                            {
                                label: `Moyenne (${Unite})`,
                                data: Ordonnee,
                                backgroundColor: "rgba(75, 192, 192, 0.2)",
                                borderColor: "rgba(75, 192, 192, 1)",
                                borderWidth: 1,
                            },
                        ],
                    },
                    options: {
                        responsive: false,
                        scales: {
                            y: { beginAtZero: true },
                        },
                    },
                });
            }

            // 2. Pie Chart (Diagramme_Circulaire)
            else if (type == "pie") {
                const { Categories, Valeurs, Total } = data.Diagramme_Circulaire;
                myChart = new Chart(ctx, {
                    type: "pie",
                    data: {
                        labels: Categories,
                        datasets: [
                            {
                                data: Valeurs,
                                backgroundColor: [
                                    "rgba(255, 99, 132, 0.2)",
                                    "rgba(54, 162, 235, 0.2)",
                                ],
                                borderColor: [
                                    "rgba(255, 99, 132, 1)",
                                    "rgba(54, 162, 235, 1)",
                                ],
                                borderWidth: 1,
                            },
                        ],
                    },
                    options: {
                        responsive: false,
                    },
                });
            }

            // 3. Line Chart (Courbes)
            else if (type == "line") {
                const { Periodes, Libelle_Metrique, Valeurs_Metrique, Unite } = data.Courbes;
                myChart = new Chart(ctx, {
                    type: "line",
                    data: {
                        labels: Periodes,
                        datasets: [
                            {
                                label: `${Libelle_Metrique} (${Unite})`,
                                data: Valeurs_Metrique,
                                backgroundColor: "rgba(153, 102, 255, 0.2)",
                                borderColor: "rgba(153, 102, 255, 1)",
                                borderWidth: 1,
                            },
                        ],
                    },
                    options: {
                        responsive: false,
                        scales: {
                            y: { beginAtZero: true },
                        },
                    },
                });
            }

            // 5. Radar Chart (Radar)
            else if (type == "radar") {
                const { Indicateurs, Scores, Echelle } = data.Radar;
                myChart = new Chart(ctx, {
                    type: "radar",
                    data: {
                        labels: Indicateurs,
                        datasets: [
                            {
                                label: `Scores (${Echelle})`,
                                data: Scores,
                                backgroundColor: "rgba(255, 159, 64, 0.2)",
                                borderColor: "rgba(255, 159, 64, 1)",
                                borderWidth: 1,
                            },
                        ],
                    },
                    options: {
                        responsive: false,
                        scales: {
                            r: { beginAtZero: true },
                        },
                    },
                });
            }
            // Wait for the chart to be fully rendered
            myChart.update();

            // Get the chart's base64 image string
            setTimeout(() => {
                const image = myChart.toBase64Image();
                console.log("Generated Chart Image:", image);
                resolve(image);
            }, 1000); // Wait for chart to be fully rendered
        } catch (error) {
            console.error("Failed to generate chart:", error);
            reject(error);
}})};

async function generateAllCharts(data) {
    const types = ["bar", "pie", "line", "radar"];
    const images = []
    for (let type of types) {
        const image = await generateOneChart(data, type);
        images.push(image);
    }
    return images;
}


export { generateAllCharts };
