/*
 * Les 10 questions du questionnaire.
 * Ce fichier est la source : au démarrage, le serveur recopie ces questions dans la base de données.
 *
 * - id : identifiant court et unique (ne pas le changer une fois que des réponses existent)
 * - type : "unique" (une seule réponse), "multiple" (plusieurs réponses),
 *          "note" (de 1 à 5) ou "texte" (réponse libre)
 * - choix : les réponses proposées (pour "unique" et "multiple")
 * - etiquettes : les mots affichés sous 1 et sous 5 (pour "note")
 * - obligatoire : false pour une question facultative
 */
module.exports = [
  {
    id: "age",
    intitule: "Quel âge avez-vous ?",
    type: "unique",
    choix: ["Moins de 18 ans", "18 à 25 ans", "26 à 35 ans", "36 à 50 ans", "Plus de 50 ans"]
  },
  {
    id: "frequence",
    intitule: "À quelle fréquence portez-vous du parfum ?",
    type: "unique",
    choix: ["Tous les jours", "Plusieurs fois par semaine", "Pour les grandes occasions", "Rarement", "Jamais"]
  },
  {
    id: "importance",
    intitule: "Quelle place le parfum a-t-il dans votre quotidien ?",
    type: "note",
    etiquettes: ["Aucune", "Essentielle"]
  },
  {
    id: "familles",
    intitule: "Quelles familles de parfums préférez-vous ?",
    aide: "Plusieurs réponses possibles.",
    type: "multiple",
    choix: [
      "Florale (rose, jasmin…)",
      "Fruitée",
      "Boisée",
      "Orientale (ambre, épices…)",
      "Fraîche (agrumes, notes marines…)",
      "Gourmande (vanille, caramel…)"
    ]
  },
  {
    id: "prefere",
    intitule: "Quel est votre parfum préféré en ce moment ?",
    aide: "Facultatif.",
    type: "texte",
    obligatoire: false
  },
  {
    id: "budget",
    intitule: "Combien dépensez-vous en général pour un parfum ?",
    type: "unique",
    choix: ["Moins de 20 €", "De 20 à 50 €", "De 50 à 100 €", "Plus de 100 €"]
  },
  {
    id: "achat",
    intitule: "Où achetez-vous vos parfums ?",
    aide: "Plusieurs réponses possibles.",
    type: "multiple",
    choix: [
      "En parfumerie (Sephora, Nocibé…)",
      "En grande surface",
      "Sur internet",
      "Auprès d'un vendeur indépendant",
      "On me les offre"
    ]
  },
  {
    id: "critere",
    intitule: "Qu'est-ce qui compte le plus pour vous dans un parfum ?",
    type: "unique",
    choix: ["L'odeur", "La tenue", "Le prix", "La marque", "Le flacon"]
  },
  {
    id: "inspiration",
    intitule: "Connaissez-vous les parfums « d'inspiration », créés d'après de grandes fragrances et vendus à petit prix ?",
    type: "unique",
    choix: ["Oui, j'en ai déjà acheté", "Oui, mais je n'en ai jamais acheté", "Non, je ne connais pas"]
  },
  {
    id: "format",
    intitule: "Aimeriez-vous tester un parfum en petit format (15 ml) avant d'acheter un grand flacon ?",
    type: "unique",
    choix: ["Oui", "Peut-être", "Non"]
  }
];
