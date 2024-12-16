export function drawOrganigram(orgData, canvasId, companyName) {
    const canvas = document.getElementById(canvasId);
    canvas.width = 1400;
    canvas.height = 1000;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const layerColors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFA1', '#A1FF33'];

    // Draw nodes dynamically
    function drawNodes(nodes) {
        const layerCount = Math.max(...nodes.map(node => node.layer)) + 1;
        const layerHeight = canvas.height / layerCount;

        // Group nodes by layer
        const layers = Array.from({ length: layerCount }, (_, i) =>
            nodes.filter(node => node.layer === i)
        );

        layers.forEach((layer, i) => {
            const layerWidth = canvas.width / (layer.length + 1);

            layer.forEach((node, j) => {
                const x = layerWidth * (j + 1);
                const y = layerHeight * (i + 0.5);
                node.x = x;
                node.y = y;

                // Draw rectangle with distinct color for each layer
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(x - 100, y - 50, 200, 100);
                ctx.strokeStyle = layerColors[i % layerColors.length];
                ctx.lineWidth = 2;
                ctx.strokeRect(x - 100, y - 50, 200, 100);

                // Shadow effect
                ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
                ctx.shadowBlur = 5;

                // Draw text
                ctx.fillStyle = 'black';
                ctx.shadowBlur = 0; // Disable shadow for text
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const lines = node.label.split('\n');
                lines.forEach((line, index) => {
                    ctx.fillText(line, x, y - 20 + index * 16);
                });
            });
        });
    }

    // Draw edges dynamically
    function drawEdges(edges, nodes) {
        edges.forEach(edge => {
            const fromNode = nodes.find(node => node.id === edge.from);
            const toNode = nodes.find(node => node.id === edge.to);

            if (fromNode && toNode) {
                const startX = fromNode.x;
                const startY = fromNode.y + 50;
                const endX = toNode.x;
                const endY = toNode.y - 50;

                // Draw curved line to avoid overlap
                ctx.strokeStyle = '#888';
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                const controlX = (startX + endX) / 2;
                const controlY = startY + (endY - startY) / 2;
                ctx.quadraticCurveTo(controlX, controlY, endX, endY);
                ctx.stroke();

                // Draw label
                if (edge.label) {
                    ctx.fillStyle = 'black';
                    ctx.fillText(
                        edge.label,
                        (startX + endX) / 2,
                        (startY + endY) / 2 - 10
                    );
                }
            }
        });
    }

    // Render organigram
    drawNodes(orgData.nodes);
    drawEdges(orgData.edges, orgData.nodes);

    // Export as PNG
    const pngData = canvas.toDataURL('image/png');
    const organigramLink = document.createElement('a');
    organigramLink.href = pngData;
    organigramLink.download = 'organigram.png';
    organigramLink.textContent = `Télécharger l'organigram de ${companyName}`;

    return organigramLink;
}