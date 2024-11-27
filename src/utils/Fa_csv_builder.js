import { parse } from "papaparse";

function preparePandasData(data) {
    const helpingColumns = {
        Bilan_passif: [
            "Capitaux propres",
            "Fonds propres",
            "Dettes financières M/L terme",
            "Dettes fiscales et sociales",
            "Dettes d exploitation",
            "Dettes hors exploitation",
            "Dettes financières court terme",
            "TOTAL PASSIF",
        ],
        Bilan_actif: [
            "Immobilisations incorporelles",
            "Immobilisations corporelles",
            "Immobilisations financières",
            "Total actif immobilisé net",
            "Créances",
            "Total actif circulant net",
            "Comptes de régularisation",
            "TOTAL ACTIF",
        ],
        Compte_de_resultat: [
            "Marge brute",
            "Marge opérationnelle",
            "EBE hors groupe",
            "EBE",
            "Résultat d exploitation",
            "Résultat net",
            "Flux d exploitation",
            "Taux de Marge brute",
            "Taux de Marge opérationnelle",
            "Taux d EBE hors groupe",
            "Taux d EBE",
        ],
    };

    const dfsInDict = {
        Bilan_passif: null,
        Bilan_actif: null,
        Compte_de_resultat: null,
    };

    const htmlDfInDict = {};

    if (data.Donnee_Tabulaire) {
        // Convert CSV strings into objects
        for (const [key, value] of Object.entries(data.Donnee_Tabulaire)) {
            try {
                const parsed = parse(value, { header: true, skipEmptyLines: true });
                dfsInDict[key] = parsed.data;
            } catch (e) {
                console.error(`Error converting ${key} to object: ${e}`);
            }
        }
    }

    for (const [key, rows] of Object.entries(dfsInDict)) {
        if (rows && rows.length > 0) {
            const headers = Object.keys(rows[0]);
            const helpingCols = helpingColumns[key] || [];

            // Generate HTML table
            let html = `
                <table class="csv-table">
                    <thead>
                        <tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr>
                    </thead>
                    <tbody>
                        ${rows
                            .map((row) => {
                                const rowHtml = headers
                                    .map((header) => `<td>${formatNumberWithSpaces(row[header]) || ""}</td>`)
                                    .join("");
                                const isHelpingCategory = helpingCols.some((col) => row[headers[0]] === col);
                                return `<tr class="${isHelpingCategory ? "helping-category" : ""}">${rowHtml}</tr>`;
                            })
                            .join("")}
                    </tbody>
                </table>
            `;

            htmlDfInDict[key] = html;
        }
    }

    return { htmlDfInDict, dfsInDict };
}

function formatNumberWithSpaces(num) {
    if (typeof num === "number" || (!isNaN(num) && num.trim() !== "")) {
        return Number(num).toLocaleString("fr-FR");
    }
    return num;
}

export default preparePandasData;
