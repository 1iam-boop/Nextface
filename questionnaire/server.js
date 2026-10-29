/*
 * Serveur du questionnaire AW Parfumerie (Node.js ≥ 22.13, aucune dépendance à installer).
 *
 *   GET  /                    le questionnaire (dossier public/)
 *   GET  /api/questions       les questions, lues dans la base
 *   POST /api/reponses        enregistre un questionnaire rempli
 *   GET  /admin/              les résultats (protégés par ADMIN_PASSWORD)
 *   GET  /admin/resultats.json
 *   GET  /admin/export.csv    toutes les réponses, à ouvrir dans Excel
 *
 * Lancement : npm start (voir README.md)
 */
const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
const { ouvrirBase } = require("./base");

const PORT = Number(process.env.PORT) || 3000;
const HOTE = process.env.HOST || process.env.IP || undefined;
const MOT_DE_PASSE = process.env.ADMIN_PASSWORD || "";
const CHEMIN_BASE = process.env.DB_PATH || path.join(__dirname, "data", "questionnaire.db");
const PUBLIC = path.join(__dirname, "public");
const TAILLE_MAX = 16 * 1024;
const TEXTE_MAX = 200;

const base = ouvrirBase(CHEMIN_BASE, require("./questions"));

const TYPES_FICHIERS = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon"
};

const ENTETES_SECURITE = {
  "Content-Security-Policy": "default-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin"
};

class ErreurHttp extends Error {
  constructor(statut, message) {
    super(message);
    this.statut = statut;
  }
}

const serveur = http.createServer(async (req, res) => {
  for (const [nom, valeur] of Object.entries(ENTETES_SECURITE)) res.setHeader(nom, valeur);
  try {
    await router(req, res);
  } catch (erreur) {
    const statut = erreur instanceof ErreurHttp ? erreur.statut : 500;
    if (statut === 500) console.error(erreur);
    if (res.headersSent) return res.end();
    const message = statut === 500 ? "Une erreur est survenue sur le serveur. Réessayez dans un instant." : erreur.message;
    if (req.url.startsWith("/api/")) envoyerJson(res, statut, { erreur: message });
    else envoyer(res, statut, "text/plain; charset=utf-8", message);
  }
});

async function router(req, res) {
  let pathname;
  try {
    pathname = path.posix.normalize(decodeURIComponent(new URL(req.url, "http://localhost").pathname));
  } catch {
    throw new ErreurHttp(400, "Adresse invalide.");
  }

  if (pathname === "/api/questions") {
    exigerMethode(req, "GET");
    return envoyerJson(res, 200, { questions: base.questions.map(({ numero, ...q }) => q) });
  }

  if (pathname === "/api/reponses") {
    exigerMethode(req, "POST");
    if (!(req.headers["content-type"] || "").startsWith("application/json")) throw new ErreurHttp(415, "Format de réponse invalide.");
    let corps;
    try {
      corps = JSON.parse(await lireCorps(req));
    } catch (erreur) {
      if (erreur instanceof ErreurHttp) throw erreur;
      throw new ErreurHttp(400, "Format de réponse invalide.");
    }
    const id = base.enregistrer(verifierReponses(corps));
    return envoyerJson(res, 201, { ok: true, id });
  }

  if (pathname.startsWith("/admin")) {
    if (!MOT_DE_PASSE) throw new ErreurHttp(503, "La page des résultats est fermée : définissez ADMIN_PASSWORD (voir README.md).");
    if (!estAdmin(req)) {
      res.setHeader("WWW-Authenticate", 'Basic realm="Resultats AW Parfumerie", charset="UTF-8"');
      throw new ErreurHttp(401, "Mot de passe requis.");
    }
    res.setHeader("Cache-Control", "no-store");
    if (pathname === "/admin") {
      res.writeHead(301, { Location: "/admin/" });
      return res.end();
    }
    if (pathname === "/admin/resultats.json") {
      exigerMethode(req, "GET");
      return envoyerJson(res, 200, base.resultats());
    }
    if (pathname === "/admin/export.csv") {
      exigerMethode(req, "GET");
      res.setHeader("Content-Disposition", 'attachment; filename="reponses-questionnaire.csv"');
      return envoyer(res, 200, "text/csv; charset=utf-8", exporterCsv());
    }
  }

  exigerMethode(req, "GET");
  return servirFichier(req, res, pathname);
}

// Ne garde que des réponses prévues par les questions de la base, et refuse un questionnaire incomplet.
function verifierReponses(corps) {
  const reponses = corps && typeof corps.reponses === "object" && !Array.isArray(corps.reponses) ? corps.reponses : null;
  if (!reponses) throw new ErreurHttp(400, "Format de réponse invalide.");

  const lignes = [];
  for (const q of base.questions) {
    let valeur = Object.hasOwn(reponses, q.id) ? reponses[q.id] : undefined;
    if (typeof valeur === "string") valeur = valeur.trim();
    if (valeur === undefined || valeur === null || valeur === "" || (Array.isArray(valeur) && valeur.length === 0)) {
      if (q.obligatoire) throw new ErreurHttp(400, `Merci de répondre à la question ${q.numero}.`);
      continue;
    }

    const valide =
      q.type === "unique" ? q.choix.includes(valeur) :
      q.type === "multiple" ? Array.isArray(valeur) && valeur.every((c) => q.choix.includes(c)) :
      q.type === "note" ? Number.isInteger(valeur) && valeur >= 1 && valeur <= 5 :
      typeof valeur === "string";
    if (!valide) throw new ErreurHttp(400, `La réponse à la question ${q.numero} n'est pas valide.`);

    if (q.type === "multiple") for (const c of new Set(valeur)) lignes.push([q.id, c]);
    else if (q.type === "texte") lignes.push([q.id, valeur.slice(0, TEXTE_MAX)]);
    else lignes.push([q.id, String(valeur)]);
  }
  return lignes;
}

function exporterCsv() {
  const colonnes = base.questions;
  const entete = ["N°", "Date (UTC)", ...colonnes.map((q) => `Q${q.numero} · ${q.intitule}`)];
  const lignes = base.exporter().map((p) => [p.id, p.date, ...colonnes.map((q) => (p.reponses[q.id] || []).join(" | "))]);
  // Point-virgule et BOM : le fichier s'ouvre directement dans Excel en français, accents compris.
  return "﻿" + [entete, ...lignes].map((l) => l.map(celluleCsv).join(";")).join("\r\n") + "\r\n";
}

function celluleCsv(valeur) {
  let texte = String(valeur);
  if (/^[=+\-@\t\r]/.test(texte)) texte = "'" + texte; // empêche Excel d'y voir une formule
  return '"' + texte.replace(/"/g, '""') + '"';
}

function estAdmin(req) {
  const [schema, jeton] = (req.headers.authorization || "").split(" ");
  if (schema !== "Basic" || !jeton) return false;
  const identifiants = Buffer.from(jeton, "base64").toString("utf8");
  const motDePasse = identifiants.slice(identifiants.indexOf(":") + 1);
  const empreinte = (texte) => crypto.createHash("sha256").update(texte).digest();
  return crypto.timingSafeEqual(empreinte(motDePasse), empreinte(MOT_DE_PASSE));
}

async function servirFichier(req, res, pathname) {
  const fichier = path.join(PUBLIC, path.normalize(pathname.endsWith("/") ? pathname + "index.html" : pathname));
  const type = TYPES_FICHIERS[path.extname(fichier)];
  if (!fichier.startsWith(PUBLIC + path.sep) || !type) throw new ErreurHttp(404, "Page introuvable.");

  let contenu;
  try {
    contenu = await fs.readFile(fichier);
  } catch {
    throw new ErreurHttp(404, "Page introuvable.");
  }
  res.setHeader("Cache-Control", type.startsWith("text/html") ? "no-cache" : "public, max-age=3600");
  envoyer(res, 200, type, req.method === "HEAD" ? null : contenu, contenu.length);
}

function exigerMethode(req, methode) {
  if (req.method === methode || (methode === "GET" && req.method === "HEAD")) return;
  throw new ErreurHttp(405, "Méthode non autorisée.");
}

function lireCorps(req) {
  if (Number(req.headers["content-length"]) > TAILLE_MAX) return Promise.reject(new ErreurHttp(413, "Réponse trop volumineuse."));
  return new Promise((resolve, reject) => {
    const morceaux = [];
    let taille = 0;
    req.on("data", (morceau) => {
      taille += morceau.length;
      if (taille > TAILLE_MAX) {
        reject(new ErreurHttp(413, "Réponse trop volumineuse."));
        req.destroy();
      } else {
        morceaux.push(morceau);
      }
    });
    req.on("end", () => resolve(Buffer.concat(morceaux).toString("utf8")));
    req.on("error", reject);
  });
}

function envoyerJson(res, statut, donnees) {
  envoyer(res, statut, "application/json; charset=utf-8", JSON.stringify(donnees));
}

function envoyer(res, statut, type, contenu, longueur) {
  res.writeHead(statut, { "Content-Type": type, "Content-Length": longueur ?? Buffer.byteLength(contenu || "") });
  res.end(contenu || undefined);
}

serveur.listen(PORT, HOTE, () => {
  console.log(`Questionnaire en ligne : http://localhost:${PORT}`);
  console.log(`Base de données : ${CHEMIN_BASE}`);
  console.log(MOT_DE_PASSE
    ? `Résultats : http://localhost:${PORT}/admin/`
    : "Résultats fermés : définissez ADMIN_PASSWORD pour ouvrir /admin/ (voir README.md).");
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    serveur.close();
    base.fermer();
    process.exit(0);
  });
}
