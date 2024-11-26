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
                .csv-table { width: 100%; border-collapse: collapse; margin-top: 20px; table-layout: fixed; font-size: 14px; color: #333; background-color: #fff; }
                .csv-table th, .csv-table td { border: 1px solid #ddd; padding: 8px; text-align: center; vertical-align: top; word-wrap: break-word; text-overflow: ellipsis; white-space: normal; max-width: 150px; }
                .csv-table th { background-color: #2e6c80; color: #fff; font-weight: bold; }
                .page-break { page-break-before: always; }
            </style>
        </head>
        <body>

        <div class="section">
            <div class="first-page-block">
                <h1>BILAN ÉCONOMIQUE & SOCIAL</h1>
            </div>
        </div>

        <div class="section page-break">
            <div class="page-header"><h1>Volet Juridique</h1></div>
            <h2>1. Entreprise</h2>
            <p><span class="data-field">Nom:</span> <span class="value">{{Entreprise.Nom}}</span></p>
            <p><span class="data-field">Code APE:</span> <span class="value">{{Entreprise.Code_APE}}</span></p>
            <p><span class="data-field">Code SIREN:</span> <span class="value">{{Entreprise.Code_SIREN}}</span></p>
            <p><span class="data-field">Registre du Commerce:</span> <span class="value">{{Entreprise.Registre_du_Commerce}}</span></p>

            <h2>2. Dirigeant</h2>
            <p><span class="data-field">Nom:</span> <span class="value">{{Dirigeant.Nom}}</span></p>
            <p><span class="data-field">Prénom:</span> <span class="value">{{Dirigeant.Prenom}}</span></p>
            <p><span class="data-field">Nationalité:</span> <span class="value">{{Dirigeant.Nationalité}}</span></p>
        </div>

        <div class="section page-break">
            <h2>3. Informations sur le Groupe</h2>
            <h3>Structure du Groupe</h3>
            <p><span class="data-field">Appartenance:</span> <span class="value">{{Group_Info.Structure_du_Groupe}}</span></p>
            <p><span class="data-field">Affiliations:</span> <span class="value">{{Group_Info.Structure_Affiliees}}</span></p>

            <h3>Historique des Acquisitions</h3>
            <table class="csv-table">
                <tr>
                    <th>Date</th>
                    <th>Montant</th>
                    <th>Description</th>
                </tr>
                {{#each Group_Info.Historique_Acquisitions}}
                <tr>
                    <td>{{Date}}</td>
                    <td>{{Montant}}</td>
                    <td>{{Description}}</td>
                </tr>
                {{/each}}
            </table>
        </div>

        <div class="section page-break">
            <h2>4. Analyse Financière</h2>
            <h3>Actifs</h3>
            <p><span class="data-field">Actifs Immobilisés:</span> <span class="value">{{Analyse_Financiere.Actifs.Actifs_Immobilises}}</span></p>
            <p><span class="data-field">Actifs Circulants:</span> <span class="value">{{Analyse_Financiere.Actifs.Actifs_Circulants}}</span></p>

            <h3>Passifs</h3>
            <p><span class="data-field">Capitaux Propres:</span> <span class="value">{{Analyse_Financiere.Passifs.Capitaux_Propres}}</span></p>
        </div>

        <div class="section page-break">
            <h2>Tableau des Données Importées</h2>
            <div>
                {{Donnee_Tabulaire.Bilan_actif}}
            </div>
            <div>
                {{Donnee_Tabulaire.Bilan_passif}}
            </div>
            <div>
                {{Donnee_Tabulaire.Compte_de_resultat}}
            </div>
        </div>

        </body>
        </html>
    `,


    chartsTemplate: `
      <div class="section page-break">
        <h2>Visualisation des Données</h2>
        {{#each charts}}
        <div class="chart-section">
            <h3>{{name}}</h3>
            <img src="{{data}}" alt="{{name}}" style="width: 100%; max-width: 600px;"/>
        </div>
        {{/each}}
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
  