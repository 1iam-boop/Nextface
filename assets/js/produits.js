/*
 * Données de la vitrine Chogan.
 * Pour ajouter un produit : copiez une ligne du tableau PRODUITS et modifiez-la.
 *   categorie : une des clés de CATEGORIES ci-dessous
 *   ref       : numéro du parfum (facultatif)
 *   genre     : "Femme", "Homme" ou "Unisexe" (facultatif)
 *   famille   : famille olfactive (facultatif)
 *   notes     : notes principales (facultatif)
 *   formats   : contenances disponibles
 * Aucun prix n'est affiché : le site est une vitrine, pas une boutique.
 */

const CATEGORIES = {
  "parfum-femme":   { nom: "Parfums Femme",        forme: "bottle", teinte: "#d8a7b1", texte: "Floraux, fruités, gourmands ou orientaux : les créations Olfazeta pour elle." },
  "parfum-homme":   { nom: "Parfums Homme",        forme: "bottle", teinte: "#5b7a99", texte: "Boisés, aromatiques, aquatiques ou épicés : les créations Olfazeta pour lui." },
  "parfum-unisexe": { nom: "Parfums Unisexe",      forme: "bottle", teinte: "#b9a27a", texte: "Des signatures à partager, dont la collection Luxury et Mψtologik." },
  "maison":         { nom: "Parfums d'ambiance",   forme: "diffuser", teinte: "#8fa58a", texte: "Diffuseurs, sprays et bougies Brilhome pour parfumer la maison." },
  "visage":         { nom: "Soins Visage",         forme: "jar", teinte: "#e6cfa8", texte: "Aurodhea (bio) et Peptilux : crèmes, sérums, masques et nettoyants." },
  "corps":          { nom: "Soins Corps & Hygiène", forme: "tube", teinte: "#c9b6d9", texte: "Gels douche parfumés, laits corps, crèmes mains, déodorants." },
  "cheveux":        { nom: "Soins Cheveux",        forme: "pump", teinte: "#a7c4c2", texte: "Shampooings, masques, cristaux liquides et brumes parfumées." },
  "maquillage":     { nom: "Maquillage",           forme: "lipstick", teinte: "#b5545c", texte: "Teint, yeux, lèvres et ongles." },
  "bien-etre":      { nom: "Bien-être",            forme: "jar", teinte: "#9cb380", texte: "Compléments alimentaires pour accompagner le quotidien." },
  "epicerie":       { nom: "Épicerie italienne",   forme: "jar", teinte: "#a0784f", texte: "Café et spécialités Made in Italy." },
  "animaux":        { nom: "Animaux",              forme: "tube", teinte: "#d1b46a", texte: "Chopet : hygiène et soin pour chiens et chats." },
  "accessoires":    { nom: "Accessoires & Bijoux", forme: "gem", teinte: "#c9a45c", texte: "Maroquinerie, bijoux fantaisie et accessoires de mode." }
};

const FAMILLES = [
  { nom: "Florale",              genre: "Femme",   notes: "Rose, jasmin, fleur d'oranger, pivoine" },
  { nom: "Fruitée",              genre: "Femme",   notes: "Poire, fruits rouges, pêche, cassis" },
  { nom: "Gourmande",            genre: "Femme",   notes: "Vanille, praline, caramel, fève tonka" },
  { nom: "Orientale",            genre: "Mixte",   notes: "Ambre, épices, encens, oud" },
  { nom: "Boisée",               genre: "Homme",   notes: "Cèdre, vétiver, santal, patchouli" },
  { nom: "Aromatique aquatique", genre: "Homme",   notes: "Notes marines, lavande, agrumes" },
  { nom: "Épicée cuirée",        genre: "Homme",   notes: "Cannelle, poivre, cuir, ambre" },
  { nom: "Hespéridée",           genre: "Mixte",   notes: "Bergamote, citron, mandarine, néroli" }
];

const PRODUITS = [
  // ——— Parfums (exemples de références, à compléter avec le catalogue officiel) ———
  { nom: "Parfum N°001", ref: "001", categorie: "parfum-homme", genre: "Homme", famille: "Épicée cuirée", notes: "Mandarine, cannelle, cuir, ambre", formats: ["50 ml", "Échantillon"], description: "Une signature chaleureuse et affirmée, épicée et cuirée." },
  { nom: "Parfum N°002", ref: "002", categorie: "parfum-homme", genre: "Homme", famille: "Aromatique aquatique", notes: "Agrumes, notes marines, cèdre, patchouli", formats: ["50 ml", "Échantillon"], description: "La fraîcheur marine par excellence, élégante et intemporelle." },
  { nom: "Parfum N°003", ref: "003", categorie: "parfum-homme", genre: "Homme", famille: "Boisée", notes: "Violette, cuir, bois", formats: ["50 ml", "Échantillon"], description: "Un boisé audacieux au caractère singulier." },
  { nom: "Parfum N°010", ref: "010", categorie: "parfum-femme", genre: "Femme", famille: "Boisée", notes: "Bois sensuels, fleurs blanches", formats: ["50 ml", "Échantillon"], description: "Un boisé féminin sensuel et lumineux." },
  { nom: "Parfum N°031", ref: "031", categorie: "parfum-homme", genre: "Homme", famille: "Aromatique", notes: "Lavande, bois, notes fraîches", formats: ["50 ml", "Échantillon"], description: "Un parfum subtil et envoûtant." },
  { nom: "Parfum N°073", ref: "073", categorie: "parfum-unisexe", genre: "Unisexe", famille: "Orientale", notes: "Épices, bois précieux, ambre", formats: ["70 ml Luxury", "Échantillon"], description: "Collection Luxury : un charisme secret et raffiné." },
  { nom: "Collection Florale Femme", categorie: "parfum-femme", genre: "Femme", famille: "Florale", notes: "Rose, jasmin, pivoine", formats: ["50 ml", "Échantillon"], description: "Les références florales de la gamme Olfazeta pour elle." },
  { nom: "Collection Gourmande Femme", categorie: "parfum-femme", genre: "Femme", famille: "Gourmande", notes: "Vanille, praline, caramel", formats: ["50 ml", "Échantillon"], description: "Des sillages doux et addictifs." },
  { nom: "Collection Fruitée Femme", categorie: "parfum-femme", genre: "Femme", famille: "Fruitée", notes: "Poire, fruits rouges, pêche", formats: ["50 ml", "Échantillon"], description: "Pétillants, joyeux et lumineux." },
  { nom: "Collection Mψtologik", categorie: "parfum-unisexe", genre: "Unisexe", famille: "Orientale boisée", notes: "Oud, ambre, encens", formats: ["Flacon collection"], description: "Une ligne de parfums d'exception inspirée des mythes." },
  { nom: "Parfum pour enfants", categorie: "parfum-unisexe", genre: "Unisexe", famille: "Fruitée douce", notes: "Notes fruitées et légères", formats: ["Flacon"], description: "Des senteurs douces et légères pour les plus petits." },
  { nom: "Brume parfumée corps", categorie: "parfum-unisexe", genre: "Unisexe", famille: "Variable", notes: "Disponible dans les senteurs de la gamme", formats: ["Spray"], description: "Une touche de parfum légère pour le corps." },

  // ——— Maison ———
  { nom: "Diffuseur à bâtonnets", categorie: "maison", notes: "Plusieurs senteurs", formats: ["Flacon + bâtonnets", "Recharge"], description: "Parfume une pièce en continu, sans flamme." },
  { nom: "Spray d'ambiance", categorie: "maison", notes: "Plusieurs senteurs", formats: ["Spray"], description: "Rafraîchit instantanément l'atmosphère." },
  { nom: "Bougie parfumée", categorie: "maison", notes: "Plusieurs senteurs", formats: ["Pot en verre"], description: "Une lumière chaleureuse et un parfum enveloppant." },
  { nom: "Parfum de lessive", categorie: "maison", notes: "Notes fraîches et florales", formats: ["Flacon"], description: "Pour un linge délicatement parfumé plus longtemps." },
  { nom: "Parfum pour voiture", categorie: "maison", notes: "Plusieurs senteurs", formats: ["Diffuseur voiture"], description: "Votre parfum préféré, aussi sur la route." },
  { nom: "Produits d'entretien Brilhome", categorie: "maison", notes: "Parfumés", formats: ["Flacon"], description: "Nettoyants pour la maison au parfum soigné." },

  // ——— Visage ———
  { nom: "Crème visage hydratante Aurodhea", categorie: "visage", notes: "Ingrédients d'origine biologique", formats: ["Pot"], description: "Hydrate et protège au quotidien." },
  { nom: "Sérum visage Aurodhea", categorie: "visage", notes: "Formule bio concentrée", formats: ["Flacon pipette"], description: "Un concentré d'actifs pour une peau éclatante." },
  { nom: "Crème anti-âge Peptilux", categorie: "visage", notes: "Peptides", formats: ["Pot"], description: "Soin aux peptides pour lisser les signes de l'âge." },
  { nom: "Contour des yeux", categorie: "visage", notes: "Texture légère", formats: ["Tube"], description: "Défatigue et lisse le regard." },
  { nom: "Masque visage", categorie: "visage", notes: "Purifiant ou hydratant", formats: ["Tube", "Masque tissu"], description: "Un moment de soin intense." },
  { nom: "Démaquillant & nettoyant", categorie: "visage", notes: "Doux pour la peau", formats: ["Flacon"], description: "Nettoie en douceur, matin et soir." },

  // ——— Corps ———
  { nom: "Gel douche parfumé", categorie: "corps", notes: "Dans les senteurs de la gamme", formats: ["Flacon"], description: "Votre parfum préféré dès la douche." },
  { nom: "Lait corps parfumé", categorie: "corps", notes: "Dans les senteurs de la gamme", formats: ["Flacon"], description: "Nourrit et prolonge le sillage du parfum." },
  { nom: "Crème mains", categorie: "corps", notes: "Nourrissante", formats: ["Tube"], description: "Des mains douces et protégées." },
  { nom: "Déodorant", categorie: "corps", notes: "Fraîcheur longue durée", formats: ["Spray", "Roll-on"], description: "Protection et fraîcheur au quotidien." },
  { nom: "Savon liquide mains", categorie: "corps", notes: "Parfumé", formats: ["Flacon pompe"], description: "Nettoie et parfume délicatement." },

  // ——— Cheveux ———
  { nom: "Shampooing", categorie: "cheveux", notes: "Tous types de cheveux", formats: ["Flacon"], description: "Lave en douceur et respecte la fibre." },
  { nom: "Après-shampooing", categorie: "cheveux", notes: "Démêlant", formats: ["Flacon"], description: "Démêle et apporte de la brillance." },
  { nom: "Masque capillaire", categorie: "cheveux", notes: "Nutrition intense", formats: ["Pot"], description: "Répare et nourrit en profondeur." },
  { nom: "Cristaux liquides", categorie: "cheveux", notes: "Soin sans rinçage", formats: ["Flacon"], description: "Pointes brillantes et disciplinées." },
  { nom: "Brume parfumée cheveux", categorie: "cheveux", notes: "Dans les senteurs de la gamme", formats: ["100 ml"], description: "Parfume la chevelure en toute légèreté." },
  { nom: "Crème protectrice coloration", categorie: "cheveux", notes: "Protège la peau", formats: ["Tube"], description: "Évite les taches lors de la coloration." },

  // ——— Maquillage ———
  { nom: "Rouge à lèvres", categorie: "maquillage", notes: "Plusieurs teintes", formats: ["Stick"], description: "Couleur intense et confort." },
  { nom: "Mascara", categorie: "maquillage", notes: "Volume et longueur", formats: ["Tube"], description: "Un regard intensifié." },
  { nom: "Fond de teint", categorie: "maquillage", notes: "Plusieurs teintes", formats: ["Flacon"], description: "Un teint unifié et naturel." },
  { nom: "Vernis à ongles", categorie: "maquillage", notes: "Plusieurs teintes", formats: ["Flacon"], description: "Des ongles brillants et colorés." },

  // ——— Bien-être ———
  { nom: "Compléments alimentaires", categorie: "bien-etre", notes: "Vitalité, sommeil, beauté", formats: ["Gélules", "Sticks"], description: "Pour accompagner l'équilibre au quotidien." },

  // ——— Épicerie ———
  { nom: "Café italien", categorie: "epicerie", notes: "Grains, moulu ou capsules", formats: ["Paquet", "Capsules"], description: "L'espresso à l'italienne." },
  { nom: "Spécialités Made in Italy", categorie: "epicerie", notes: "Sélection italienne", formats: ["Divers"], description: "Le goût authentique de l'Italie." },

  // ——— Animaux ———
  { nom: "Shampooing Chopet", categorie: "animaux", notes: "Chiens et chats", formats: ["Flacon"], description: "Un pelage propre et doux." },
  { nom: "Parfum pour animaux Chopet", categorie: "animaux", notes: "Senteur délicate", formats: ["Spray"], description: "Une fraîcheur légère pour votre compagnon." },

  // ——— Accessoires ———
  { nom: "Bijoux fantaisie", categorie: "accessoires", notes: "Colliers, bracelets, boucles", formats: ["Divers"], description: "Des pièces élégantes pour chaque occasion." },
  { nom: "Maroquinerie", categorie: "accessoires", notes: "Sacs et petite maroquinerie", formats: ["Divers"], description: "Accessoires de mode au style italien." },
  { nom: "Coffrets cadeaux", categorie: "accessoires", notes: "Parfums et soins", formats: ["Coffret"], description: "L'idée cadeau parfaite." }
];
