# AW Parfumerie

Site vitrine (sans paiement, panier de simulation uniquement) : recherche directe par nom ou inspiration, liste des parfums (femme, homme, mixte, luxe, luxury, créations, enfants), étuis, et soins corps, visage, rasage, cheveux, solaire, remèdes, animaux.

- `index.html` : la vitrine
- `assets/js/config.js` : **les informations à compléter** (téléphone, WhatsApp, Instagram, livraison, paiement, histoire, avis, mentions légales). Tant qu'un champ est vide, le site affiche un encadré « À compléter ».
- `mentions-legales.html` : la page des mentions légales (remplie à partir de `config.js`)
- `assets/js/parfums.js` : **la liste des parfums** (une ligne = référence + nom ; prix à la fin pour Luxe et Luxury)
- `assets/js/produits.js` : **la liste des soins** (source : AW Catalogue) ; mettre `AFFICHER_PRIX = false` pour masquer tous les prix
- `assets/css/vitrine.css` : le style (crème, prune, taupe, brun)
- `assets/img/` : photos des produits (flacons femme et homme/mixte, brumes, diffuseur, spray d'ambiance)

## Mise en ligne sur GitHub Pages
Settings → Pages → Source : « Deploy from a branch » → branche `main`, dossier `/ (root)`.
Le site sera disponible sur `https://<utilisateur>.github.io/Nextface/`.
