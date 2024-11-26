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

const combinedData =
`
Informations utiles:
Entreprises:
Nom : Maison Coudeyrat
Téléphone : Non disponible
Code APE : 1011Z  Transformation et conservation de la viande de boucherie
Code SIREN : 311547111
Registre du Commerce : RCS Bergerac
Dénomination Sociale : Société à responsabilité limitée à associé unique
Sigle ou Enseigne : Non disponible
Adresse Siège Social : Zone Artisanale, 24260 Le Bugue, Dordogne
Objet Social : Fabrication, transformation, conditionnement et vente de tous produits de charcuterie, abattage des porcs, revente en gros demigros et détail[2][3].
Forme Juridique & Capital Social : Société à responsabilité limitée à associé unique, capital social de 130 000,00 €[1][3].
Commencement d’Exploitation : 1955[4].
Exploitation du Fonds : Actif depuis 46 ans, avec un établissement principal depuis 1989[1].

Dirigeant :
Nom : Benoît David
Prénom : Benoît
Nationalité : Non disponible
Téléphone Portable : Non disponible
Email : Non disponible

Groupe :
Appartenance : Indépendante
Structures Affiliées : Aucune information disponible
Historique des Acquisitions (Date, Montant, Description) : Aucune information disponible

Capital :
Augmentations de Capital (Date, Montant, Description) : Aucune information disponible

Autres Informations :
Labels et Certifications : Aucune information disponible
Marques : LOU TEYCHOU DU PERIGORD et LORPIC[4].
Partenariats Stratégiques : Maison Bousquet en Aveyron pour la diversification dans la viande de bœuf, de veau et d’agneau[4].

Notes :
Jugement de Plan de Redressement : Maison Coudeyrat a été déclarée en Jugement de plan de redressement par le Tribunal de Commerce de Bergerac, avec une durée du plan de 9 ans et un commissaire à l'exécution du plan nommé De Keating[2][3].
Procédure Collective : La procédure de redressement judiciaire a été ouverte le 15 octobre 2023, avec un administrateur judiciaire SCP Cbf Associes et un mandataire judiciaire SELARL De Keating[2].

Chiffres Clés :
Chiffre d’Affaires : 5 580 000 € en 2023[1].
Résultat Net : 313 300 € en 2023[1].
Effectifs Moyens : 20 à 49 salariés[1][2].

Assuretoi que les informations proviennent de sources fiables et vérifiables.

Texte des 5 premières pages:
{"page":1,"content":"hocelis\nExpertise Comptable\nCommissariat aux Comptes\nMAISON COUDEYRAT\nZone artisanale\n24260 LE BUGUE\nCOMPTES ANNUELS\nAU 30 SEPTEMBRE 2023\n(Période du 01/10/2022 au 30/09/2023)\nSociété d'Expertise comptable inscrite au tableau de l'Ordre de la Région de Bretagne - Commissaire aux\nComptes membre de la Compagnie Régionale de Rennes\nSARL Hocélis au capital de 2 000 Euros - 11 avenue des Peupliers - 35510 CESSON-SÉVIGNÉ\nSiret : 810 549 402 00024 - Tél. 09 72 60 13 51 - Port. 06 62 49 23 94 - Email : celine.hocde@hocelis.fr"},{"page":2,"content":"MAISON COUDEYRAT\nPériode du 01/10/2022 au 30/09/2023\nBILAN ACTIF\nPrésenté en Euros\nACTIF\nExercice clos le\n30/09/2023\n(12 mois)\nBrut\nAmort. & Prov\nNet\n%\nCapital souscrit non appelé\n(0)\nActif Immobilisé\nFrais d'établissement\nRecherche et développement\nConcessions, brevets, marques, logiciels et droits similaires\nFonds commercial\nAutres immobilisations incorporelles\nAvances & acomptes sur immobilisations incorporelles\n73 865\n125 916\n59 132\n14 733\n1,07\n125 916\n9,12\nTerrains\nConstructions\nInstallations techniques, matériel & outillage industriels\nAutres immobilisations corporelles\nImmobilisations en cours\nAvances & acomptes\n151 684\n855 985\n413 691\n40 265\n765 055\n90 930\n308 792\n104 899\n111 419\n8,07\n6,59\n7,60\nParticipations évaluées selon mise en équivalence\nAutres Participations\nCréances rattachées à des participations\nAutres titres immobilisés\nPrêts\nAutres immobilisations financières\n15 000\n15 000\nExercice précédent\n30/09/2022\n(12 mois)\nNet\n%\n28 879\n1,61\n125 916\n7,02\n123 971\n6,91\n89 760\n5,00\n164 469\n9,17\n1,09\n15 000\n0,84\n10 280\n10 280\n0,74\n10 280\n0,57\nTOTAL (I)\n1 646 420\n1 173 243\n473 177\n34,29\nActif circulant\nMatières premières, approvisionnements\nEn cours de production de biens\nEn cours de production de services\nProduits intermédiaires et finis\nMarchandises\n191 844\n5 000\n186 844\n13,54\nAvances & acomptes versés sur commandes\nClients et comptes rattachés\nAutres créances\n496 437\n68 526\n427 911\n31,01\n. Fournisseurs débiteurs\n. Personnel\n. Organismes sociaux\n. Etat, impôts sur les bénéfices\n. Etat, taxes sur le chiffre d'affaires\n. Autres\nCapital souscrit et appelé, non versé\n11 668\n3 849\n11 668\n3 849\n558 274\n31,12\n192 606\n10,74\n601 281\n33,51\n0,85\n782\n0,04\n0,28\n1 906\n0,11\n19 834\n4 718\n19 834\n4 718\n1,44\n27 688\n0,34\n10 700\nValeurs mobilières de placement\nInstruments financiers à terme et jetons détenus\nDisponibilités\nCharges constatées d'avance\nTOTAL (II)\n185 403\n66 510\n980 262\n73 526\n185 403\n66 510\n13,44\n4,82\n906 736\n65,71\nCharges à répartir sur plusieurs exercices\nPrimes de remboursement des obligations\nEcarts de conversion et différences d'évaluation actif\nV)\n(III)\nV)\nTOTAL ACTIF (0 à V)\n2 626 683\n1 246 770\n1 379 913 100,00\n1,54\n0,60\n298 492\n16,64\n102 389\n5,71\n1 235 843\n68,88\n1 794 116 100,00\n2"}]

Données tabulaires:
Table 1
ACTIF,Exercice clos le 30/09/2023,Exercice précédent 30/09/2022
,(12 mois),(12 mois)

Table 2
,,,,,,
,Brut,Amort. & Prov,Net,%,Net,%
Capital souscrit non appelé (0),,,,,,
Actif Immobilisé,,,,,,
Frais d'établissement,,,,,,
Recherche et développement,,,,,,
Concessions, brevets, marques, logiciels et droits similaires,73 865,59 132,14 733,1,07,28 879,1,61
Fonds commercial,125 916,,125 916,9,12,125 916,7,02
Autres immobilisations incorporelles,,,,,,
Avances & acomptes sur immobilisations incorporelles,,,,,,
Terrains,,,,,,
Constructions,151 684,40 265,111 419,8,07,123 971,6,91
Installations techniques, matériel & outillage industriels,855 985,765 055,90 930,6,59,89 760,5,00
Autres immobilisations corporelles,413 691,308 792,104 899,7,60,164 469,9,17
Immobilisations en cours,,,,,,
Avances & acomptes,,,,,,
Participations évaluées selon mise en équivalence,,,,,,
Autres Participations,15 000,,15 000,1,09,15 000,0,84
Créances rattachées à des participations,,,,,,
Autres titres immobilisés,,,,,,
Prêts,,,,,,
Autres immobilisations financières,10 280,,10 280,0,74,10 280,0,57
TOTAL (I),1 646 420,1 173 243,473 177,34,29,558 274,31,12
Actif circulant,,,,,,
Matières premières, approvisionnements,191 844,5 000,186 844,13,54,192 606,10,74
En cours de production de biens,,,,,,
En cours de production de services,,,,,,
Produits intermédiaires et finis Marchandises,,,,,,
Avances & acomptes versés sur commandes,,,,,,
Clients et comptes rattachés,496 437,68 526,427 911,31,01,601 281,33,51
Autres créances,,,,,,
. Fournisseurs débiteurs,,,,,,
. Personnel,11 668,,11 668,0,85,782,0,04
. Organismes sociaux,3 849,,3 849,0,28,1 906,0,11
. Etat, impôts sur les bénéfices,,,,,,
. Etat, taxes sur le chiffre d'affaires,19 834,,19 834,1,44,27 688,1,54
. Autres,4 718,,4 718,0,34,10 700,0,60
Capital souscrit et appelé, non versé,,,,,,
Valeurs mobilières de placement,,,,,,
Instruments financiers à terme et jetons détenus,,,,,,
Disponibilités,185 403,,185 403,13,44,298 492,16,64
Charges constatées d'avance,66 510,,66 510,4,82,102 389,5,71
TOTAL (II),980 262,73 526,906 736,65,71,1 235 843,68,88
Charges à répartir sur plusieurs exercices (III),,,,,,
Primes de remboursement des obligations V),,,,,,
Ecarts de conversion et différences d'évaluation actif V)
:selected:,,,,,,
TOTAL ACTIF (0 à V),2 626 683,1 246 770,1 379 913,100,00,1 794 116,100,00
`

const layoutDataCsv = 
`

Données tabulaires:
Table 1
ACTIF,Exercice clos le 30/09/2023,Exercice précédent 30/09/2022
,(12 mois),(12 mois)

Table 2
,,,,,,
,Brut,Amort. & Prov,Net,%,Net,%
Capital souscrit non appelé (0),,,,,,
Actif Immobilisé,,,,,,
Frais d'établissement,,,,,,
Recherche et développement,,,,,,
Concessions, brevets, marques, logiciels et droits similaires,73 865,59 132,14 733,1,07,28 879,1,61
Fonds commercial,125 916,,125 916,9,12,125 916,7,02
Autres immobilisations incorporelles,,,,,,
Avances & acomptes sur immobilisations incorporelles,,,,,,
Terrains,,,,,,
Constructions,151 684,40 265,111 419,8,07,123 971,6,91
Installations techniques, matériel & outillage industriels,855 985,765 055,90 930,6,59,89 760,5,00
Autres immobilisations corporelles,413 691,308 792,104 899,7,60,164 469,9,17
Immobilisations en cours,,,,,,
Avances & acomptes,,,,,,
Participations évaluées selon mise en équivalence,,,,,,
Autres Participations,15 000,,15 000,1,09,15 000,0,84
Créances rattachées à des participations,,,,,,
Autres titres immobilisés,,,,,,
Prêts,,,,,,
Autres immobilisations financières,10 280,,10 280,0,74,10 280,0,57
TOTAL (I),1 646 420,1 173 243,473 177,34,29,558 274,31,12
Actif circulant,,,,,,
Matières premières, approvisionnements,191 844,5 000,186 844,13,54,192 606,10,74
En cours de production de biens,,,,,,
En cours de production de services,,,,,,
Produits intermédiaires et finis Marchandises,,,,,,
Avances & acomptes versés sur commandes,,,,,,
Clients et comptes rattachés,496 437,68 526,427 911,31,01,601 281,33,51
Autres créances,,,,,,
. Fournisseurs débiteurs,,,,,,
. Personnel,11 668,,11 668,0,85,782,0,04
. Organismes sociaux,3 849,,3 849,0,28,1 906,0,11
. Etat, impôts sur les bénéfices,,,,,,
. Etat, taxes sur le chiffre d'affaires,19 834,,19 834,1,44,27 688,1,54
. Autres,4 718,,4 718,0,34,10 700,0,60
Capital souscrit et appelé, non versé,,,,,,
Valeurs mobilières de placement,,,,,,
Instruments financiers à terme et jetons détenus,,,,,,
Disponibilités,185 403,,185 403,13,44,298 492,16,64
Charges constatées d'avance,66 510,,66 510,4,82,102 389,5,71
TOTAL (II),980 262,73 526,906 736,65,71,1 235 843,68,88
Charges à répartir sur plusieurs exercices (III),,,,,,
Primes de remboursement des obligations V),,,,,,
Ecarts de conversion et différences d'évaluation actif V)
:selected:,,,,,,
TOTAL ACTIF (0 à V),2 626 683,1 246 770,1 379 913,100,00,1 794 116,100,00
`


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
        `

        // Step 5: Generate structured data and summary using OpenAI
        updateStatus("Generating structured summary...");
        const structuredData = await generateCaseSummary(combinedData, layoutDataCsv);
        await saveDebugFile("step5_structured_data.json", structuredData);
        updateProgress(90);

        // Step 6: Generate PDF report
        updateStatus("Creating PDF report...");
        await generatePdfReport(structuredData, `${companyName}_Report.pdf`);
        updateStatus("Process completed successfully!");
        updateProgress(100);
    } catch (error) {
        updateStatus("An error occurred during processing.");
        console.error("Error in processing pipeline:", error);
    }
}

export default main;
