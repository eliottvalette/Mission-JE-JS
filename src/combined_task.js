import { docIntelMain } from "./utils/A_doc_intelligence";
import { transformJsonToCsv } from "./utils/B_reshaper";
import { perplexityFirstGlance } from "./utils/C_perplexity_ai";
import { gatherData } from "./utils/D_gather_data";
import { generateCaseSummary } from "./utils/E_open_ai";
import { generatePdfReport } from "./utils/F_pdf_creator";

function saveDebugFile(filename, data) {
    try {
        const content = typeof data === "string" ? data : JSON.stringify(data, null, 2);
        const blob = new Blob([content], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error(`Failed to save debug file (${filename}):`, error);
    }
}

const structuredData = {
    "Entreprise": {
      "Nom": "Maison Coudeyrat",
      "Telephone": "Non disponible",
      "Code_APE": "1011Z",
      "Code_SIREN": "311547111",
      "Registre_du_Commerce": "RCS Bergerac",
      "Dénomination_Sociale": "Société à responsabilité limitée à associé unique",
      "Sigle_Ou_Enseigne": "Non disponible",
      "Adresse_Siege_Social": "Zone Artisanale, 24260 Le Bugue, Dordogne",
      "Objet_Social": "Fabrication, transformation, conditionnement et vente de tous produits de charcuterie, abattage des porcs, revente en gros demigros et détail.",
      "Forme_Juridique_Capital_Social": "Société à responsabilité limitée à associé unique, capital social de 130 000,00 €",
      "Commencement_Exploitation": "1955",
      "Exploitation_du_Fonds": "Actif depuis 46 ans"
    },
    "Dirigeant": {
      "Nom": "Benoît David",
      "Prenom": "Benoît",
      "Nationalité": "Non disponible",
      "Telephone_Portable": "Non disponible",
      "Email": "Non disponible"
    },
    "Group_Info": {
      "Structure_du_Groupe": "Indépendante",
      "Structure_Affiliees": [],
      "Historique_Acquisitions": [],
      "Capital_Increase": [],
      "Autres_Informations": {
        "Labels": [
          "Médaille au Concours Général Agricole de Paris pour le saucisson sec « Lou Teychou »"
        ],
        "Partenariats": [
          "Maison Bousquet en Aveyron pour la viande de bœuf, de veau et d’agneau"
        ]
      }
    },
    "Analyse_Financiere": {
      "Vue_d_ensemble": "Maison Coudeyrat, spécialisée dans la transformation et conservation de la viande, a connu une année difficile avec un résultat net négatif de -279 950 € pour l'exercice 2023. Malgré un chiffre d'affaires de 5 580 118 €, l'entreprise fait face à des défis financiers importants, notamment un plan de redressement sur 9 ans. Les perspectives de redressement dépendent de la gestion efficace des coûts et de l'amélioration des marges.",
      "Actifs": {
        "Actifs_Immobilises": "Les actifs immobilisés s'élèvent à 473 177 €, représentant 34,29% du total des actifs. Les installations techniques et le matériel industriel constituent une part importante, mais leur amortissement élevé (765 055 €) indique une utilisation intensive et un besoin potentiel de renouvellement.",
        "Actifs_Circulants": "Les actifs circulants, principalement composés de créances clients (427 911 €) et de disponibilités (185 403 €), représentent 65,71% du total des actifs. La gestion des créances et des stocks est cruciale pour maintenir la liquidité."
      },
      "Passifs": {
        "Capitaux_Propres": "Les capitaux propres sont faibles à 469 766 €, soit 34,04% du passif total, en raison du résultat net négatif. Cela limite la capacité de l'entreprise à financer ses opérations par ses propres moyens.",
        "Dettes_Financieres": "Les dettes financières, incluant des emprunts de 260 443 €, représentent 18,87% du passif. Ces dettes sont utilisées pour financer les investissements, mais elles pèsent sur la trésorerie.",
        "Dettes_d_Exploitation": "Les dettes d'exploitation, principalement envers les fournisseurs (401 692 €), représentent 29,11% du passif. Une gestion rigoureuse des échéances est nécessaire pour éviter des tensions de trésorerie."
      },
      "Resultats_Financiers": {
        "Resultat_Exploitation": "Le résultat d'exploitation est négatif à -310 669 €, impacté par des charges d'exploitation élevées, notamment les achats de marchandises et les charges de personnel.",
        "Resultat_Net": "Le résultat net de -279 950 € est aggravé par des charges exceptionnelles et un faible résultat financier. Les éléments exceptionnels ont contribué à une réduction du résultat exceptionnel de 45,29%.",
        "Ratios_Financiers": "Les ratios financiers montrent une rentabilité en baisse avec un résultat net sur chiffre d'affaires de -5,02%. La solvabilité est également préoccupante avec des capitaux propres représentant seulement 34,04% du passif total."
      },
      "Perspectives": "Pour améliorer sa situation financière, Maison Coudeyrat doit se concentrer sur la réduction des coûts d'exploitation, l'optimisation de la gestion des stocks et des créances, et la recherche de nouvelles opportunités de marché pour augmenter ses revenus."
    },
    "Donnee_Tabulaire": {
      "Bilan_actif": "Date,30/09/2023,30/09/2022\nLicences,14 733,28 879\nFonds de commerce,125 916,125 916\nImmobilisations incorporelles,140 649,154 795\nConstructions,111 419,123 971\nMatériel et outillage,90 930,89 760\nMobilier,104 899,164 469\nImmobilisations corporelles,307 248,378 200\nActions SEMAB,15 000,15 000\nCautions versées,10 280,10 280\nImmobilisations financières,25 280,25 280\nTotal actif immobilisé net,473 177,558 274\nStocks et en-cours,186 844,192 606\nClients,427 911,601 281\nFournisseurs,0,0\nFiscales et sociales,0,0\nFactor,0,0\nCréances,427 911,601 281\nComptes courants,0,0\nDisponibilités,185 403,298 492\nTotal actif circulant net,800 158,1 092 379\nCharges constatées d avances,66 510,102 389\nComptes de régularisation,66 510,102 389\nTOTAL ACTIF,1 339 845,1 753 042",
      "Bilan_passif": "Date,30/09/2023,30/09/2022\nCapital social,130 000,130 000\nRéserves,498 367,576 413\nReport à nouveau,0,0\nRésultat de l exercice,-279 950,-78 047\nCapitaux propres,348 417,628 366\nSubventions,121 350,153 742\nFonds propres,121 350,153 742\nEmprunts bancaires,260 443,314 099\nDettes financières M/L terme,260 443,314 099\nAcomptes clients,0,0\nDettes fournisseurs,401 692,432 362\nRémunérations dues,97 446,125 341\nOrganismes sociaux,80 006,92 476\nImpôts et taxes,9 065,10 015\nDettes fiscales et sociales,186 517,227 832\nDettes d exploitation,588 209,660 194\nComptes courants,59 062,29 971\nDettes hors exploitation,59 062,29 971\nDécouverts,61,206\nDettes financières court terme,61,206\nTOTAL PASSIF,1 339 845,1 753 042",
      "Compte_de_resultat": "Date,30/09/2023,30/09/2022\nChiffre d affaires,5 580 118,6 278 601\nAchats de marchandises,3 753 147,4 085 890\nSous-traitance,0,0\nTransports,26 091,25 067\nMarge brute,1 800 880,2 167 644\nCharges liées à l exploitation,621 186,582 828\nImpôts et taxes,36 470,42 142\nMasse salariale,865 001,948 381\nAutres charges liées à l activité,215 425,256 642\nMarge opérationnelle,62 798,337 651\nCharges restantes,0,0\nEBE hors groupe,62 798,337 651\nFacturation holding,0,0\nEBE,62 798,337 651\nAutres produits et charges,239,5 102\nDotations aux Amortissements et Provisions,124 799,168 256\nRésultat d exploitation,-62 240,164 293\nRésultat financier,-1 322,-1 451\nRésultat exceptionnel,30 843,56 388\nImpôt sur les Sociétés,-1 198,-1 290\nRésultat net,-279 950,-78 047\nCapacité d Autofinancement,0,0\nAcquisition actif,0,0\nAcomptes versés,0,0\nPrise participation SEMAB,0,0\nVariation compte courant,0,0\nDéblocage d emprunts,0,0\nRemboursement d emprunts,0,0\nFlux d exploitation,0,0"
    },
    "Diagramme_Baton": {
      "Abscisse": ["2021", "2022", "2023"],
      "Ordonnee": [5500000, 6278601, 5580118],
    "Moyenne": 5786239.67,
    "Unite": "Euros"
  },
  "Diagramme_Circulaire": {
    "Categories": ["Ventes de marchandises", "Production vendue services"],
    "Valeurs": [5557467, 22651],
    "Total": 5580118
  },
  "Courbes": {
    "Periodes": ["2019", "2020", "2021", "2022", "2023"],
    "Libelle_Metrique": "Chiffre d'affaires",
    "Valeurs_Metrique": [5000000, 5200000, 5500000, 6278601, 5580118],
    "Variation_Percent": [4, 5.77, 5.77, 14.16, -11.11],
    "Unite": "Euros"
  },
  "Histogramme": {
    "Categories": ["1-10k", "10-50k", "50-100k", "100k+"],
    "Frequence": [5, 12, 20, 8],
    "Unite": "Comptes"
  },
  "Radar": {
    "Indicateurs": ["Qualité", "Innovation", "Satisfaction client", "Croissance", "Durabilité"],
    "Scores": [85, 70, 80, 60, 75],
    "Echelle": "0 à 100"
  }
}

  


async function main(file, companyName, updateStatus, updateProgress) {
    try {
        `
        updateStatus("Starting PDF analysis...");
        updateProgress(0);

        // Step 1: Analyze PDF with Azure
        updateStatus("Analyzing PDF...");
        const { readContent, layoutTables } = await docIntelMain(file);
        await saveDebugFile("step1_doc_intelligence.json", { readContent, layoutTables });
        updateProgress(20);

        // Step 2: Transform layout data to CSV
        updateStatus("Transforming tables into CSV...");
        const layoutDataCsv = transformJsonToCsv(layoutTables);
        await saveDebugFile("step2_transformed_csv.csv", layoutDataCsv);
        updateProgress(40);

        // Step 3: Fetch company data with Perplexity API
        updateStatus("Fetching company details...");
        const firstGlanceData = await perplexityFirstGlance(companyName);
        await saveDebugFile("step3_perplexity_data.json", firstGlanceData);
        updateProgress(60);

        // Step 4: Gather all data
        updateStatus("Preparing data for analysis...");
        const combinedData = gatherData(firstGlanceData, readContent, layoutDataCsv);
        await saveDebugFile("step4_combined_data.txt", combinedData);
        updateProgress(80);

        // Step 5: Generate structured data and summary using OpenAI
        updateStatus("Generating structured summary...");
        const structuredData = await generateCaseSummary(combinedData, layoutDataCsv);
        await saveDebugFile("step5_structured_data.json", structuredData);
        updateProgress(90);
        `

        // Step 6: Generate PDF report
        updateStatus("Creating PDF report...");
        const downloadLinks = await generatePdfReport(structuredData, `${companyName}_Report.pdf`);
        updateStatus("Process completed successfully!");
        updateProgress(100);

        return downloadLinks;
    } catch (error) {
        updateStatus("An error occurred during processing.");
        console.error("Error in processing pipeline:", error);
        return null;
    }
}

export default main;
