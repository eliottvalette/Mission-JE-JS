const Config = {
    htmlTemplate: `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
          <meta charset="UTF-8">
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
          <style>
              body { font-family: 'Roboto', Arial, sans-serif; color: #333; }
              .first-page-block { background-color: #f2f2f2; border: 4px solid #ccc; padding: 10%; text-align: center; }
              .page-header { background-color: #ffffff; border: 2px solid #2e6c80; text-align: center; margin-bottom: 8%; }
              h1 { color: #2e6c80; text-align: center; }
              h2 { color: #2e6c80; border-bottom: 2px solid #2e6c80; }
              h3 { color: #2e6c80; }
              .section { margin: 20px 0; }
              .data-field { font-weight: bold; color: #555; }
              .value { color: #000; }
              .csv-table {
                  width: 100%; border-collapse: collapse; margin-top: 20px; table-layout: fixed;
                  font-size: 14px; color: #333; background-color: #fff;
              }
              .csv-table th, .csv-table td {
                  border: 1px solid #ddd; padding: 8px; text-align: center; vertical-align: top; word-wrap: break-word;
                  text-overflow: ellipsis; white-space: normal; max-width: 150px;
              }
              .csv-table tr:first-child th {
                  background-color: #2e6c80; color: #fff; font-weight: bold; text-align: center; padding: 10px;
              }
              @media (max-width: 768px) {
                  .csv-table td { font-size: 12px; padding: 5px; }
                  .csv-table th { font-size: 13px; padding: 8px; }
              }
              @page {
                  size: A4;
                  margin: 2cm;
                  @top-center {
                      content: "Bilan Économique & Social";
                      color: #2e6c80; font-size: 14px; font-family: 'Roboto', Arial, sans-serif;
                  }
                  @bottom-right {
                      content: "Page " counter(page);
                      color: #777; font-size: 12px;
                  }
              }
          </style>
      </head>
      <body>
          <div class="section">
              <div class="first-page-block">
                  <h1>BILAN ÉCONOMIQUE & SOCIAL</h1>
              </div>
          </div>
      </body>
      </html>
    `,
    chartsTemplate: `
      <div class="section page-break">
          <h2>Visualisation des Données</h2>
          {% for chart_name, chart_img in charts.items() %}
              <div class="chart-section">
                  <h3>{{ chart_name }}</h3>
                  <img src="data:image/png;base64,{{ chart_img }}" alt="{{ chart_name }}" style="width: 100%; max-width: 600px;"/>
              </div>
          {% endfor %}
      </div>
    `,
    firmInfo: {
      name: "Summarize_Accounting_data",
      description:
        "Récupérer des informations structurées à partir des bilans comptables, incluant les données de l'entreprise, les informations du dirigeant, une analyse financière détaillée.",
      strict: true,
      schema: {
        type: "object",
        properties: {
          Entreprise: {
            type: "object",
            properties: {
              Nom: { type: "string" },
              Code_APE: { type: "string" },
              Code_SIREN: { type: "string" },
              Adresse_Siege_Social: { type: "string" },
            },
            required: ["Nom", "Code_APE", "Code_SIREN", "Adresse_Siege_Social"],
          },
          Dirigeant: {
            type: "object",
            properties: {
              Nom: { type: "string" },
              Prenom: { type: "string" },
              Nationalité: { type: "string" },
            },
            required: ["Nom", "Prenom", "Nationalité"],
          },
        },
        required: ["Entreprise", "Dirigeant"],
      },
    },
    firmData: {
      name: "Structurize_Accounting_data",
      description:
        "Structure des données comptables pour extraire et organiser des informations financières.",
      strict: true,
    },
    firmCharts: {
      name: "Generate_Enhanced_Chart_Data",
      description:
        "Données structurées pour générer divers diagrammes financiers pour accompagner un rapport textuel.",
      strict: true,
    },
    operationPrecision: `
      Pour le Bilan Passif:
      Capitaux propres = Capital social + Réserves + Report à nouveau + Résultat de l'exercice
      ...
      Pour le Compte de Résultat:
      Résultat net = Résultat d'exploitation - Résultat financier + Résultat exceptionnel - Impôt sur les Sociétés
    `,
    status: "Idle",
  };
  
  export default Config;
  