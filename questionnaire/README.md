# Questionnaire « Le parfum et vous » · AW Parfumerie

Un petit site en trois étapes :

1. **un questionnaire de 10 questions** sur le parfum (habitudes, goûts, budget…), affichées une par une ;
2. **une présentation d'AW Parfumerie en 3 phrases** ;
3. **un lien vers le site AW Parfumerie** (https://1iam-boop.github.io/Nextface/).

Chaque questionnaire envoyé est enregistré dans **une petite base de données SQLite** (un simple fichier, `data/questionnaire.db`). Une page protégée par mot de passe affiche les résultats et permet de tout télécharger pour Excel.

Les réponses sont anonymes : ni nom, ni e-mail, ni adresse IP ne sont enregistrés.

## Lancer le site sur son ordinateur

Il faut seulement [Node.js](https://nodejs.org/) version 22.13 ou plus récente (aucun paquet à installer).

```bash
cd questionnaire
```

```bash
cp .env.exemple .env
```

Ouvrez `.env` et choisissez un mot de passe après `ADMIN_PASSWORD=`, puis :

```bash
npm start
```

- Questionnaire : http://localhost:3000
- Résultats : http://localhost:3000/admin/ (le navigateur demande un identifiant, mettez ce que vous voulez, et le mot de passe choisi)

## Les fichiers

| Fichier | Rôle |
|---|---|
| `questions.js` | **Les 10 questions** : intitulés, types et réponses proposées. À modifier ici, la base se met à jour au redémarrage. |
| `public/index.html` | La page du questionnaire, avec **les 3 phrases de présentation** et **le lien** vers AW Parfumerie |
| `public/app.js` | Affiche les questions une par une et envoie les réponses |
| `public/style.css` | Le style (mêmes couleurs et polices que le site AW Parfumerie) |
| `public/admin/` | La page des résultats |
| `server.js` | Le serveur : envoie les pages, vérifie et enregistre les réponses |
| `base.js` | La base de données (création des tables, statistiques, export) |

### La base de données

| Table | Contenu |
|---|---|
| `questions` | les questions (recopiées depuis `questions.js` à chaque démarrage) |
| `participations` | une ligne par questionnaire envoyé, avec sa date |
| `reponses` | une ligne par réponse (plusieurs lignes pour une question à choix multiples) |

Le fichier `data/questionnaire.db` n'est pas envoyé sur GitHub (voir `.gitignore`). Pensez à le sauvegarder de temps en temps, ou téléchargez le CSV depuis la page des résultats. Il s'ouvre aussi avec [DB Browser for SQLite](https://sqlitebrowser.org/).

### Modifier les questions

Dans `questions.js`, chaque question a un `type` :

- `"unique"` : une seule réponse parmi les `choix`
- `"multiple"` : plusieurs réponses possibles parmi les `choix`
- `"note"` : une note de 1 à 5 (les `etiquettes` s'affichent sous 1 et sous 5)
- `"texte"` : une réponse libre (200 caractères au plus)

Ne changez pas l'`id` d'une question qui a déjà des réponses. Si vous changez l'intitulé d'un choix, les anciennes réponses restent comptées sous l'ancien intitulé.

## Mettre le site en ligne

GitHub Pages ne sait afficher que des pages fixes : ce site a besoin d'un hébergeur qui fait tourner **Node.js** et qui **garde les fichiers** entre deux redémarrages (sinon la base de données serait effacée). Par exemple [alwaysdata](https://www.alwaysdata.com/fr/) (hébergeur français, offre gratuite de 100 Mo), ou un petit serveur VPS.

Ce qu'il faut renseigner chez l'hébergeur :

- dossier du site : `questionnaire`
- commande de démarrage : `node --disable-warning=ExperimentalWarning server.js`
- variable d'environnement `ADMIN_PASSWORD` : le mot de passe de la page des résultats
- le port est lu dans la variable `PORT` (et l'adresse dans `HOST` ou `IP`), que la plupart des hébergeurs fournissent d'eux-mêmes ;
  `DB_PATH` permet de placer la base ailleurs que dans `data/`

Une fois en ligne, l'adresse du questionnaire peut être transformée en QR code, comme sur l'affiche du site.
