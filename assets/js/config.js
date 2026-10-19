/*
 * Informations de la boutique AW Parfumerie.
 * Tout champ laissé vide ("") s'affiche sur le site comme un encadré « À compléter ».
 * Il suffit de remplir la valeur entre les guillemets pour qu'elle apparaisse.
 */
const CONFIG = {
  emails: ["simaowilly@gmail.com", "Arthur.brp09@gmail.com"],
  telephone: "",          // ex. "06 12 34 56 78"
  whatsapp: "",           // numéro au format international sans + ni espaces, ex. "33612345678"
  instagram: "",          // lien complet, ex. "https://www.instagram.com/awparfumerie"
  tiktok: "",             // lien complet
  zone: "",               // ex. "Livraison en main propre à Paris et envoi partout en France"

  // Engagements affichés sous l'accueil
  livraison: "",          // ex. "Envoi sous 48 h · 5,90 € · offert dès 60 €"
  paiement: "",           // ex. "Virement, espèces ou Lydia à la livraison"
  delaiReponse: "",       // ex. "Réponse sous 24 h"

  // Notre histoire : un paragraphe par ligne du tableau
  histoire: [],           // ex. ["AW Parfumerie est née en 2025 de…", "Nous…"]
  fondateurs: "",         // ex. "Willy & Arthur"

  // Avis clients : { nom: "Prénom", ville: "", note: 5, texte: "…" }
  avis: [],

  // Mentions légales (obligatoires en France pour un site professionnel)
  mentions: {
    responsable: "",      // nom et prénom ou raison sociale
    statut: "",           // ex. "Micro-entreprise" ou "Vendeur à domicile indépendant (VDI)"
    siret: "",
    adresse: "",
    hebergeur: "GitHub Pages — GitHub Inc., 88 Colin P Kelly Jr St, San Francisco, CA 94107, États-Unis"
  }
};
