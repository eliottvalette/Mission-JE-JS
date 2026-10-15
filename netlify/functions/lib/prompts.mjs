export function getSystemPrompt(promptType, secondPass) {
    const systemPrompt = {
        info: "Génère un JSON structuré avec des informations clés sur lentreprise, en résumant les données financières et les aspects importants des comptes.",
        data: secondPass
            ? "Génère un JSON structuré avec une structuration abrégée des comptes en format CSV. Aucune valeur ne doit être inventée; toutes les valeurs doivent être confirmées à 100%. Les valeurs manquantes doivent être remplacées par 0"
            : "Complete un JSON structuré avec une structuration abrégée des comptes en format CSV. Des chiffres sont manquants voire érronés. Aucune valeur ne doit être inventée; toutes les valeurs doivent être confirmées à 100%. Les valeurs qui restent manquantes doivent rester égales à 0.",
        charts: "Tu dois générer une réponse structurée au format JSON contenant les informations nécessaires pour créer des graphiques et diagrammes. Assure-toi que chaque tableau ou série de données nécessitant des dimensions égales (par exemple, Abscisse et Ordonnee pour les diagrammes en bâton, ou Periodes, Valeurs_Metrique, et Variation_Percent pour les courbes) contient le même nombre déléments.",
        organigram: "Génère un JSON structuré avec la structure de l'organigramme de l'entreprise, en utilisant les données fournies.",
    }[promptType];

  return systemPrompt;
}
