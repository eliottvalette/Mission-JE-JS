const Config = {
    htmlTemplate: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
            <style>
            body { padding: 5%; font-family: 'Roboto', Arial, sans-serif; color: #333; }
            .first-page-block { background-color: #f2f2f2; border: 4px solid #ccc; padding: 10%; text-align: center; }
            .page-header { background-color: #ffffff; border: 2px solid #2e6c80; text-align: center; margin-bottom: 8%; }
            h1 { color: #2e6c80; text-align: center; }
            h2 { color: #2e6c80; border-bottom: 2px solid #2e6c80; }
            h3 { color: #2e6c80}
            .section { margin: 20px 0; }
            .data-field { font-weight: bold; color: #555; }
            .value { color: #000; }
            .section-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            .section-table th, .section-table td { border: 1px solid #ddd; padding: 8px; }
            .section-table th { background-color: #f2f2f2; color: #333; }

            /* Styling for the CSV table */
            .csv-table {
                width: 100%;
                border-collapse: collapse; 
                margin-top: 20px;
                table-layout: fixed;
                font-size: 14px;
                color: #333;
                background-color: #fff;
            }

            /* Header styling (first row) */
            .csv-table tr:first-child th{
                background-color: #2e6c80 !important;
                color: #fff !important;
                font-weight: 700 !important;
                text-align: center;
                padding: 10px; /* Padding for a better appearance */
                border: 1px solid #ddd; /* Light border for separation */
            }

            /* Regular cell styling */
            .csv-table td, .csv-table th {
                border: 1px solid #ddd; 
                padding: 8px; 
                text-align: center; 
                vertical-align: top; 
                word-wrap: break-word;
                text-overflow: ellipsis;
                white-space: normal; 
                max-width: 150px;
            }

            /* Helping categories */
            .csv-table tr.helping-category th,
            .csv-table tr.helping-category td {
                background-color: #e7f0ff; /* Light blue background for helping rows */
                color: #2e6c80; /* Blue text */
                font-weight: bold; /* Bold text */
            }


            /* Responsive design */
            @media (max-width: 768px) {
                .csv-table td {
                    font-size: 12px; /* Smaller font size for mobile */
                    padding: 5px; /* Reduce padding for small screens */
                }

                .csv-table th {
                    font-size: 13px; /* Smaller font size for headers */
                    padding: 8px;
                }
            }

            
            /* Page break properties */
            .page-break { page-break-before: always; }

            @page {
                size: A4;
                margin: 2cm;
            }
            @page {
                @top-center {
                    content: "Bilan Économique & Social";
                    color: #2e6c80;
                    font-size: 14px;
                    font-family: 'Roboto', Arial, sans-serif;
                }
                @bottom-right {
                    content: "Page " counter(page);
                    color: #777;
                    font-size: 12px;
                }
            }
            .page-wrapper {
                padding: 2cm;
                margin: 0;
                box-sizing: border-box;
                width: 100%;
                height: 100%;
                background: white;
            }
            </style>
        </head>
        <body>
            <div class="page-wrapper">

                <div class="section">
                    <div class="first-page-block">
                        <h1>BILAN ÉCONOMIQUE & SOCIAL</h1>
                    </div>
                </div>
                <h2>1. Entreprise</h2>
                    <p><span class="data-field">Nom:</span> <span class="value">{{ Entreprise.Nom }}</span></p>
                    <p><span class="data-field">Code APE:</span> <span class="value">{{ Entreprise.Code_APE }}</span></p>
                    <p><span class="data-field">Code SIREN:</span> <span class="value">{{ Entreprise.Code_SIREN }}</span></p>
                    <p><span class="data-field">Registre du Commerce:</span> <span class="value">{{ Entreprise.Registre_du_Commerce }}</span></p>
                    <p><span class="data-field">Dénomination sociale:</span> <span class="value">{{ Entreprise.Dénomination_Sociale }}</span></p>
                    <p><span class="data-field">Adresse du Siège Social:</span> <span class="value">{{ Entreprise.Adresse_Siege_Social }}</span></p>
                    <p><span class="data-field">Forme Juridique et Capital Social:</span> <span class="value">{{ Entreprise.Forme_Juridique_Capital_Social }}</span></p>
                    <p><span class="data-field">Commencement Exploitation:</span> <span class="value">{{ Entreprise.Commencement_Exploitation }}</span></p>
                    <p><span class="data-field">Exploitation du Fonds:</span> <span class="value">{{ Entreprise.Exploitation_du_Fonds }}</span></p>
                
                <h2>2. Dirigeant</h2>
                    <p><span class="data-field">Nom:</span> <span class="value">{{ Dirigeant.Nom }}</span></p>
                    <p><span class="data-field">Prénom:</span> <span class="value">{{ Dirigeant.Prenom }}</span></p>
                    <p><span class="data-field">Nationalité:</span> <span class="value">{{ Dirigeant.Nationalité }}</span></p>
                    <p><span class="data-field">Téléphone:</span> <span class="value">{{ Dirigeant.Telephone_Portable }}</span></p>
                    <p><span class="data-field">Email:</span> <span class="value">{{ Dirigeant.Email }}</span></p>

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

                        <h3>Augmentations de Capital</h3>
                        <table class="csv-table">
                            <tr>
                                <th>Date</th>
                                <th>Montant</th>
                                <th>Description</th>
                            </tr>
                            {{#each Group_Info.Capital_Increase}}
                                <tr>
                                    <td>{{Date}}</td>
                                    <td>{{Montant}}</td>
                                    <td>{{Description}}</td>
                                </tr>
                            {{/each}}
                        </table>

                        <h3>Autres Informations</h3>
                        <p><span class="data-field">Labels et Certifications:</span> <span class="value">{{ Group_Info.Autres_Informations.Labels}}</span></p>
                        <p><span class="data-field">Partenariats Stratégiques:</span> <span class="value">{{ Group_Info.Autres_Informations.Partenariats}}</span></p>
                    </div>

                <div class="section page-break">
                    <h2>4. Analyse Financière</h2>
                    <h2>4. Analyse Financière</h2>
                    <p><span class="data-field">Vue d'ensemble:</span> <span class="value">{{ Analyse_Financiere.Vue_d_ensemble }}</span></p>
                    
                    <h3>Actifs</h3>
                    <p><span class="data-field">Actifs Immobilisés:</span> <span class="value">{{ Analyse_Financiere.Actifs.Actifs_Immobilises }}</span></p>
                    <p><span class="data-field">Actifs Circulants:</span> <span class="value">{{ Analyse_Financiere.Actifs.Actifs_Circulants }}</span></p>

                    <h3>Passifs</h3>
                    <p><span class="data-field">Capitaux Propres:</span> <span class="value">{{ Analyse_Financiere.Passifs.Capitaux_Propres }}</span></p>
                    <p><span class="data-field">Dettes Financières:</span> <span class="value">{{ Analyse_Financiere.Passifs.Dettes_Financieres }}</span></p>
                    <p><span class="data-field">Dettes d'Exploitation:</span> <span class="value">{{ Analyse_Financiere.Passifs.Dettes_d_Exploitation }}</span></p>

                    <h3>Résultats Financiers</h3>
                    <p><span class="data-field">Résultat d'exploitation:</span> <span class="value">{{ Analyse_Financiere.Resultats_Financiers.Resultat_Exploitation }}</span></p>
                    <p><span class="data-field">Résultat Net:</span> <span class="value">{{ Analyse_Financiere.Resultats_Financiers.Resultat_Net }}</span></p>
                    <p><span class="data-field">Ratios Financiers:</span> <span class="value">{{ Analyse_Financiere.Resultats_Financiers.Ratios_Financiers }}</span></p>

                    <h3>Perspectives</h3>
                    <p><span class="data-field">Perspectives:</span> <span class="value">{{ Analyse_Financiere.Perspectives }}</span></p>
                </div>

                <div class="section page-break">
                    <h2>Tableau des Données Importées</h2>
                    <h3>Bilan Actif</h3>
                        {{{tableHtml.Bilan_actif}}}
                    <h3>Bilan Passif</h3>
                        {{{tableHtml.Bilan_passif}}}
                    <h3>Compte de résultat</h3>
                        {{{tableHtml.Compte_de_resultat}}}
                </div>

                <div class="page-break">
                <h2>Visualisation des Données</h2>
                    {{{chartsHtml}}}
                </div>
            </div>
        </body>
        </html>
    `,


    firmInfo: {
        "name": "Summarize_Accounting_data",
        "description": "Récupérer des informations structurées à partir des bilans comptables, incluant les données de l'entreprise, les informations du dirigeant, une analyse financière détaillée. Les informations resituées doivent être confiantes.",
        "strict": true,
        "schema": {
            "type": "object",
            "properties": {
                "Entreprise": {
                    "type": "object",
                    "description": "Informations sur l'entreprise.",
                    "properties": {
                        "Nom": {"type": "string", "description": "Nom de l'entreprise."},
                        "Telephone": {"type": "string", "description": "Numéro de téléphone de l'entreprise."},
                        "Code_APE": {"type": "string", "description": "Code APE de l'entreprise."},
                        "Code_SIREN": {"type": "string", "description": "Code SIREN de l'entreprise."},
                        "Registre_du_Commerce": {"type": "string", "description": "Numéro au Registre du Commerce."},
                        "Dénomination_Sociale": {"type": "string", "description": "Dénomination sociale de l'entreprise."},
                        "Sigle_Ou_Enseigne": {"type": "string", "description": "Sigle ou enseigne."},
                        "Adresse_Siege_Social": {"type": "string", "description": "Adresse du siège social."},
                        "Objet_Social": {"type": "string", "description": "Objet social de l'entreprise."},
                        "Forme_Juridique_Capital_Social": {"type": "string", "description": "Forme juridique."},
                        "Commencement_Exploitation": {"type": "string", "description": "Date de commencement d'exploitation."},
                        "Exploitation_du_Fonds": {"type": "string", "description": "Description de l'exploitation."}
                    },
                    "required": [
                        "Nom", "Telephone", "Code_APE", "Code_SIREN", "Registre_du_Commerce",
                        "Dénomination_Sociale", "Sigle_Ou_Enseigne", "Adresse_Siege_Social",
                        "Objet_Social", "Forme_Juridique_Capital_Social", "Commencement_Exploitation",
                        "Exploitation_du_Fonds"
                    ],
                    "additionalProperties": false
                },
                "Dirigeant": {
                    "type": "object",
                    "description": "Informations sur le dirigeant de l'entreprise",
                    "properties": {
                        "Nom": {"type": "string", "description": "Nom du dirigeant"},
                        "Prenom": {"type": "string", "description": "Prénom du dirigeant"},
                        "Nationalité": {"type": "string", "description": "Nationalité du dirigeant"},
                        "Telephone_Portable": {"type": "string", "description": "Numéro de téléphone"},
                        "Email": {"type": "string", "description": "Adresse email du dirigeant"}
                    },
                    "required": ["Nom", "Prenom", "Nationalité", "Telephone_Portable", "Email"],
                    "additionalProperties": false
                },
                "Group_Info": {
                    "type": "object",
                    "description": "Informations détaillées sur le groupe et ses affiliations.",
                    "properties": {
                        "Structure_du_Groupe": {
                            "type": "string",
                            "description": "Nom ou description du groupe auquel appartient l'entreprise."
                        },
                        "Structure_Affiliees": {
                            "type": "array",
                            "items": {"type": "string"},
                            "description": "Liste des structures affiliées au groupe."
                        },
                        "Historique_Acquisitions": {
                            "type": "array",
                            "description": "Liste des acquisitions du groupe.",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "Date": {"type": "string", "description": "Date de l'acquisition."},
                                    "Montant": {"type": "string", "description": "Montant de l'acquisition."},
                                    "Description": {"type": "string", "description": "Description de l'acquisition."}
                                },
                                "required": ["Date", "Montant", "Description"],
                                "additionalProperties": false
                            }
                        },
                        "Capital_Increase": {
                            "type": "array",
                            "description": "Liste des augmentations de capital.",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "Date": {"type": "string", "description": "Date de l'augmentation de capital."},
                                    "Montant": {"type": "string", "description": "Montant de l'augmentation."},
                                    "Description": {"type": "string", "description": "Description de l'augmentation."}
                                },
                                "required": ["Date", "Montant", "Description"],
                                "additionalProperties": false
                            }
                        },
                        "Autres_Informations": {
                            "type": "object",
                            "description": "Informations complémentaires non financières.",
                            "properties": {
                                "Labels": {
                                    "type": "array",
                                    "items": {"type": "string"},
                                    "description": "Labels ou certifications obtenus par le groupe."
                                },
                                "Partenariats": {
                                    "type": "array",
                                    "items": {"type": "string"},
                                    "description": "Partenariats stratégiques établis par le groupe."
                                }
                            },
                            "required": ["Labels", "Partenariats"],
                            "additionalProperties": false
                        }
                    },
                    "required": [
                        "Structure_du_Groupe",
                        "Structure_Affiliees",
                        "Historique_Acquisitions",
                        "Capital_Increase",
                        "Autres_Informations"
                    ],
                    "additionalProperties": false
                },
                "Analyse_Financiere": {
                    "type": "object",
                    "description": "Analyse financière détaillée et structurée de la société avec interprétation critique.",
                    "properties": {
                        "Vue_d_ensemble": {
                            "type": "string",
                            "description": "Introduction synthétique et critique sur l'état financier de la société, incluant les points forts, les risques identifiés et les perspectives."
                        },
                        "Actifs": {
                            "type": "object",
                            "description": "Analyse critique des actifs, en mettant en avant leur structure et leur pertinence pour les besoins opérationnels de la société. Utilise les chiffres de comptes pour illustrer ton propos",
                            "properties": {
                                "Actifs_Immobilises": {
                                    "type": "string",
                                    "description": "Analyse détaillée et critique des actifs immobilisés, incluant leur utilité opérationnelle, leur niveau d'amortissement, et leur impact sur les performances à long terme."
                                },
                                "Actifs_Circulants": {
                                    "type": "string",
                                    "description": "Analyse critique des actifs circulants, en mettant en avant la gestion des créances clients, des stocks, et des liquidités."
                                }
                            },
                            "required": ["Actifs_Immobilises", "Actifs_Circulants"],
                            "additionalProperties": false
                        },
                        "Passifs": {
                            "type": "object",
                            "description": "Analyse critique des passifs de la société, incluant leur structure et leur impact sur la trésorerie et les marges financières. Utilise les chiffres de comptes pour illustrer ton propos",
                            "properties": {
                                "Capitaux_Propres": {
                                    "type": "string",
                                    "description": "Analyse des capitaux propres, en mettant en avant leur évolution et leur rôle dans le financement des opérations."
                                },
                                "Dettes_Financieres": {
                                    "type": "string",
                                    "description": "Analyse critique des dettes financières, incluant leur utilisation pour les investissements et leur impact sur la trésorerie à court terme."
                                },
                                "Dettes_d_Exploitation": {
                                    "type": "string",
                                    "description": "Analyse des dettes d'exploitation, incluant les relations avec les fournisseurs et la gestion des échéances."
                                }
                            },
                            "required": ["Capitaux_Propres", "Dettes_Financieres", "Dettes_d_Exploitation"],
                            "additionalProperties": false
                        },
                        "Resultats_Financiers": {
                            "type": "object",
                            "description": "Analyse approfondie des résultats financiers avec interprétation des performances de la société et des raisons sous-jacentes des variations. Utilise les chiffres de comptes pour illustrer ton propos",
                            "properties": {
                                "Resultat_Exploitation": {
                                    "type": "string",
                                    "description": "Analyse critique du résultat d'exploitation, mettant en avant les évolutions des charges et des revenus opérationnels."
                                },
                                "Resultat_Net": {
                                    "type": "string",
                                    "description": "Analyse détaillée du résultat net, y compris les éléments exceptionnels et leur impact sur la performance globale."
                                },
                                "Ratios_Financiers": {
                                    "type": "string",
                                    "description": "Analyse des ratios financiers clés, avec une explication de leurs implications pour la rentabilité et la solvabilité de la société."
                                }
                            },
                            "required": ["Resultat_Exploitation", "Resultat_Net", "Ratios_Financiers"],
                            "additionalProperties": false
                        },
                        "Perspectives": {
                            "type": "string",
                            "description": "Recommandations et perspectives basées sur l'analyse critique, avec des suggestions pour améliorer la performance financière et opérationnelle."
                        }
                    },
                    "required": ["Vue_d_ensemble", "Actifs", "Passifs", "Resultats_Financiers", "Perspectives"],
                    "additionalProperties": false
                }
    
            },
            "required": ["Entreprise", "Dirigeant", "Group_Info", "Analyse_Financiere"],
            "additionalProperties": false
        }
    },


    firmData: {
        "name": "Structurize_Accounting_data",
        "description": "Structure des données comptables pour extraire et organiser des informations financières, avec des tableaux de données au format CSV.",
        "strict": true,
        "schema": {
          "type": "object",
          "properties": {
            "Donnee_Tabulaire": {
              "type": "object",
              "description": "Données financières structurées sous forme de tableaux CSV pour le bilan actif, bilan passif, et compte de résultat.",
              "properties": {
                "Bilan_actif": {
                  "type": "string",
                  "description": "Tableau pivoté des dernières années du bilan actif au format CSV. Les colonnes incluent les dates, et les lignes incluent les catégories suivantes (strictement et uniquement celles-ci): Licences, Fonds de commerce, Immobilisations incorporelles, Constructions, Matériel et outillage, Mobilier, Immobilisations corporelles, Actions SEMAB, Cautions versées, Immobilisations financières, Total actif immobilisé net, Stocks et en-cours, Clients, Fournisseurs, Fiscales et sociales, Factor, Créances, Comptes courants, Disponibilités, Total actif circulant net, Charges constatées d avances, Comptes de régularisation, TOTAL ACTIF Respecte le format suivant : Date,Date1,Date2,Date3\nLicences,Montant1,Montant2,Montant3\n..."
                },
                "Bilan_passif": {
                  "type": "string",
                  "description": "Tableau pivoté des dernières années du bilan passif au format CSV. Les colonnes incluent les dates, et les lignes incluent les catégories suivantes (strictement et uniquement celles-ci): Capital social, Réserves, Report à nouveau, Résultat de l exercice, Capitaux propres, Subventions, Fonds propres, Emprunts bancaires, Dettes financières M/L terme, Acomptes clients, Dettes fournisseurs, Rémunérations dues, Organismes sociaux, Impôts et taxes, Dettes fiscales et sociales, Dettes d exploitation, Comptes courants, Dettes hors exploitation, Découverts, Dettes financières court terme, TOTAL PASSIFRespecte le format suivant : Date,Date1,Date2,Date3\nCapital social,Montant1,Montant2,Montant3..."
                },
                "Compte_de_resultat": {
                  "type": "string",
                  "description": "Tableau pivoté des dernières années du compte de résultat au format CSV. Les colonnes incluent les dates, et les lignes incluent les catégories suivantes (strictement et uniquement celles-ci): Chiffre d affaires, Achats de marchandises, Sous-traitance, Transports, Marge brute, Charges liées à l exploitation, Impôts et taxes, Masse salariale, Autres charges liées à l activité, Marge opérationnelle, Charges restantes, EBE hors groupe, Facturation holding, EBE, Autres produits et charges, Dotations aux Amortissements et Provisions, Résultat d exploitation, Résultat financier, Résultat exceptionnel, Impôt sur les Sociétés, Résultat net, Capacité d Autofinancement, Acquisition actif, Acomptes versés, Prise participation SEMAB, Variation compte courant, Déblocage d emprunts, Remboursement d emprunts, Flux d exploitationRespecte le format suivant : Date,Date1,Date2,Date3\nChiffre d affaires,Montant1,Montant2,Montant3\n..."
                }
              },
              "required": [
                "Bilan_actif",
                "Bilan_passif",
                "Compte_de_resultat"
              ],
              "additionalProperties": false
            }
          },
          "required": [
            "Donnee_Tabulaire"
          ],
          "additionalProperties": false
        }
      },


    firmCharts: {
        "name": "Generer_Donnees_Ameliorees_Pour_Diagrammes_Financiers",
        "description": "Données structurées pour générer divers diagrammes financiers et sectoriels pour une entreprise pour accompagner un rapport textuel sur son activité.",
        "strict": true,
        "schema": {
            "type": "object",
            "properties": {
                "Diagramme_Baton": {
                    "type": "object",
                    "description": "Données pour un diagramme en bâton pertinent par rapport au secteur d'activité de la société",
                    "properties": {
                        "Abscisse": {
                            "type": "array",
                            "items": {"type": "string"},
                            "description": "Les labels sur l'axe des abscisses, représentant par exemple des périodes ou des catégories"
                        },
                        "Ordonnee": {
                            "type": "array",
                            "items": {"type": "number"},
                            "description": "Les valeurs numériques pour l'axe des ordonnées, correspondant aux valeurs à représenter"
                        },
                        "Moyenne": {
                            "type": "number",
                            "description": "La moyenne des valeurs représentées dans le diagramme pour faciliter la comparaison"
                        },
                        "Unite": {
                            "type": "string",
                            "description": "L'unité de mesure pour les valeurs (ex: Euros, Jours, etc.)"
                        }
                    },
                    "required": ["Abscisse", "Ordonnee", "Moyenne", "Unite"],
                    "additionalProperties": false
                },
                "Diagramme_Circulaire": {
                    "type": "object",
                    "description": "Données pour générer un diagramme circulaire de répartition des actifs ou d'autres catégories",
                    "properties": {
                        "Categories": {
                            "type": "array",
                            "items": {"type": "string"},
                            "description": "Les différentes catégories représentées dans le diagramme (ex: types d'actifs)"
                        },
                        "Valeurs": {
                            "type": "array",
                            "items": {"type": "number"},
                            "description": "Valeurs numériques associées à chaque catégorie pour représenter leur proportion"
                        },
                        "Total": {
                            "type": "number",
                            "description": "Somme totale des valeurs pour valider la cohérence des proportions"
                        }
                    },
                    "required": ["Categories", "Valeurs", "Total"],
                    "additionalProperties": false
                },
                "Courbes": {
                    "type": "object",
                    "description": "Données pour tracer des courbes de l'évolution du prix d'un produit ou d'un service en lien avec la société sur au moins 5 ans",
                    "properties": {
                        "Periodes": {
                            "type": "array",
                            "items": {"type": "string"},
                            "description": "Périodes représentées sur l'axe des abscisses"
                        },
                        "Libelle_Metrique": {
                            "type": "string",
                            "description": "Label de la métrique affichée dans le graphique"
                        },
                        "Valeurs_Metrique": {
                            "type": "array",
                            "items": {"type": "number"},
                            "description": "Valeurs numériques de la métrique pour chaque période représentée"
                        },
                        "Variation_Percent": {
                            "type": "array",
                            "items": {"type": "number"},
                            "description": "Pourcentage de variation de la métrique d'une période à l'autre pour identifier les tendances"
                        },
                        "Unite": {
                            "type": "string",
                            "description": "Unité de la métrique (ex: kWh, Euros, %)"
                        }
                    },
                    "required": ["Periodes", "Libelle_Metrique", "Valeurs_Metrique", "Variation_Percent", "Unite"],
                    "additionalProperties": false
                },
                "Histogramme": {
                    "type": "object",
                    "description": "Données pour générer un histogramme de distribution de valeurs financières avec au moins 4 catégories",
                    "properties": {
                        "Categories": {
                            "type": "array",
                            "items": {"type": "string"},
                            "description": "Labels des catégories représentées dans l'histogramme"
                        },
                        "Frequence": {
                            "type": "array",
                            "items": {"type": "number"},
                            "description": "Fréquence ou quantité pour chaque catégorie"
                        },
                        "Unite": {
                            "type": "string",
                            "description": "Unité de mesure pour la fréquence (ex: Comptes, Transactions)"
                        }
                    },
                    "required": ["Categories", "Frequence", "Unite"],
                    "additionalProperties": false
                },
                "Radar": {
                    "type": "object",
                    "description": "Données pour générer un diagramme radar de performance ou d'indicateurs clés avec moins 5 catégories",
                    "properties": {
                        "Indicateurs": {
                            "type": "array",
                            "items": {"type": "string"},
                            "description": "Labels des indicateurs sur le radar"
                        },
                        "Scores": {
                            "type": "array",
                            "items": {"type": "number"},
                            "description": "Scores associés à chaque indicateur"
                        },
                        "Echelle": {
                            "type": "string",
                            "description": "Echelle du radar (ex: 0 à 100, 1 à 10)"
                        }
                    },
                    "required": ["Indicateurs", "Scores", "Echelle"],
                    "additionalProperties": false
                }
            },
            "required": ["Diagramme_Baton", "Diagramme_Circulaire", "Courbes", "Histogramme", "Radar"],
            "additionalProperties": false
        }
    },


    operationPrecision: `
      Pour le Bilan Passif:
        Capitaux propres = Capital social + Réserves + Report à nouveau + Résultat de l exercice
        Fonds propres = Subventions
        Dettes financières M/L terme = Emprunts bancaires
        Dettes fiscales et sociales = Rémunérations dues + Organismes sociaux + Impôts et taxes
        Dettes d exploitation = Acomptes clients + Dettes fournisseurs + Dettes fiscales et sociales
        Dettes hors exploitation = Comptes courants
        Dettes financières court terme = Découverts
        TOTAL PASSIF = Capitaux propres + Fonds propres + Dettes financières M/L terme + Dettes d exploitation + Dettes hors exploitation + Dettes financières court terme

      Pour le Bilan Actif:
        Immobilisations incorporelles = Licences + Fonds de commerce
        Immobilisations corporelles = Constructions + Matériel et outillage + Mobilier
        Immobilisations financières = Actions SEMAB + Cautions versées
        Total actif immobilisé net = Immobilisations incorporelles + Immobilisations corporelles + Immobilisations financières
        Créances = Clients + Fournisseurs + Fiscales et sociales + Factor
        Total actif circulant net = Stocks et en-cours + Créances + Comptes courants + Disponibilités
        Comptes de régularisation = Charges constatées d avances
        TOTAL ACTIF = Total actif immobilisé net + Total actif circulant net + Comptes de régularisation

      Pour le Compte de Résultat:
        Marge brute = Chiffre d affaires - Achats de marchandises - Sous-traitance - Transports
        Marge opérationnelle = Marge brute - Charges liées à l exploitation - Impôts et taxes - Masse salariale - Autres charges liées à l activité
        EBE hors groupe = Marge opérationnelle - Charges restantes
        EBE = EBE hors groupe - Facturation holding
        Résultat d exploitation = EBE - Autres produits et charges - Dotations aux Amortissements et Provisions
        Résultat net = Résultat d exploitation - Résultat financier + Résultat exceptionnel - Impôt sur les Sociétés
        Flux d exploitation = - Acquisition actif - Acomptes versés - Prise participation SEMAB + Variation compte courant + Déblocage d emprunts - Remboursement d emprunts
        Taux de Marge brute = (Marge brute / Chiffre d affaires) * 100
        Taux de Marge opérationnelle = (Marge opérationnelle / Chiffre d affaires) * 100
        Taux d EBE hors groupe = (EBE hors groupe / Chiffre d affaires) * 100
        Taux d EBE = (EBE / Chiffre d affaires) * 100
    `,
    status: "Idle",
  };
  
  export default Config;
  