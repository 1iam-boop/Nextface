/*
 * La petite base de données SQLite du questionnaire (un seul fichier, aucun serveur à installer).
 *
 * Tables :
 * - questions      : les questions affichées (recopiées depuis questions.js à chaque démarrage)
 * - participations : une ligne par questionnaire envoyé, avec sa date
 * - reponses       : une ligne par réponse donnée (plusieurs lignes pour une question à choix multiples)
 *
 * Aucune donnée personnelle n'est enregistrée : ni nom, ni e-mail, ni adresse IP.
 */
const fs = require("node:fs");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");

const TYPES = ["unique", "multiple", "note", "texte"];

function ouvrirBase(chemin, questions) {
  verifierQuestions(questions);
  if (chemin !== ":memory:") fs.mkdirSync(path.dirname(chemin), { recursive: true });

  const db = new DatabaseSync(chemin);
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS questions (
      id          TEXT PRIMARY KEY,
      numero      INTEGER NOT NULL,
      intitule    TEXT NOT NULL,
      aide        TEXT NOT NULL DEFAULT '',
      type        TEXT NOT NULL CHECK (type IN ('unique', 'multiple', 'note', 'texte')),
      choix       TEXT NOT NULL DEFAULT '[]',
      etiquettes  TEXT NOT NULL DEFAULT '[]',
      obligatoire INTEGER NOT NULL DEFAULT 1,
      active      INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS participations (
      id      INTEGER PRIMARY KEY AUTOINCREMENT,
      cree_le TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS reponses (
      participation_id INTEGER NOT NULL REFERENCES participations(id) ON DELETE CASCADE,
      question_id      TEXT NOT NULL REFERENCES questions(id),
      valeur           TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS reponses_par_question ON reponses (question_id, valeur);
    CREATE INDEX IF NOT EXISTS reponses_par_participation ON reponses (participation_id);
  `);

  // Les questions retirées de questions.js restent dans la base (pour garder leurs réponses) mais ne s'affichent plus.
  const ecrireQuestion = db.prepare(`
    INSERT INTO questions (id, numero, intitule, aide, type, choix, etiquettes, obligatoire, active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
    ON CONFLICT (id) DO UPDATE SET
      numero = excluded.numero, intitule = excluded.intitule, aide = excluded.aide, type = excluded.type,
      choix = excluded.choix, etiquettes = excluded.etiquettes, obligatoire = excluded.obligatoire, active = 1
  `);
  transaction(db, () => {
    db.exec("UPDATE questions SET active = 0");
    questions.forEach((q, i) => ecrireQuestion.run(
      q.id, i + 1, q.intitule, q.aide || "", q.type,
      JSON.stringify(q.choix || []), JSON.stringify(q.etiquettes || []), q.obligatoire === false ? 0 : 1
    ));
  });

  const questionsActives = db.prepare(`
    SELECT id, numero, intitule, aide, type, choix, etiquettes, obligatoire
    FROM questions WHERE active = 1 ORDER BY numero
  `).all().map((q) => ({
    id: q.id,
    numero: q.numero,
    intitule: q.intitule,
    aide: q.aide,
    type: q.type,
    choix: JSON.parse(q.choix),
    etiquettes: JSON.parse(q.etiquettes),
    obligatoire: q.obligatoire === 1
  }));

  const nouvelleParticipation = db.prepare("INSERT INTO participations DEFAULT VALUES");
  const nouvelleReponse = db.prepare("INSERT INTO reponses (participation_id, question_id, valeur) VALUES (?, ?, ?)");
  const resume = db.prepare("SELECT COUNT(*) AS total, MAX(cree_le) AS derniere FROM participations");
  const repondants = db.prepare("SELECT COUNT(DISTINCT participation_id) AS n FROM reponses WHERE question_id = ?");
  const comptes = db.prepare("SELECT valeur, COUNT(*) AS nombre FROM reponses WHERE question_id = ? GROUP BY valeur");
  const moyenne = db.prepare("SELECT AVG(CAST(valeur AS INTEGER)) AS m FROM reponses WHERE question_id = ?");
  const textes = db.prepare(`
    SELECT r.valeur, p.cree_le FROM reponses r JOIN participations p ON p.id = r.participation_id
    WHERE r.question_id = ? ORDER BY p.id DESC LIMIT 200
  `);
  const toutesParticipations = db.prepare("SELECT id, cree_le FROM participations ORDER BY id");
  const toutesReponses = db.prepare("SELECT participation_id, question_id, valeur FROM reponses ORDER BY participation_id, rowid");

  return {
    questions: questionsActives,

    // lignes : [[idQuestion, valeur], …] déjà vérifiées par le serveur
    enregistrer(lignes) {
      return transaction(db, () => {
        const id = Number(nouvelleParticipation.run().lastInsertRowid);
        for (const [question, valeur] of lignes) nouvelleReponse.run(id, question, valeur);
        return id;
      });
    },

    resultats() {
      const { total, derniere } = resume.get();
      return {
        total,
        derniere,
        questions: questionsActives.map((q) => {
          const base = { id: q.id, numero: q.numero, intitule: q.intitule, type: q.type, repondants: repondants.get(q.id).n };
          if (q.type === "texte") return { ...base, textes: textes.all(q.id).map((t) => ({ texte: t.valeur, date: t.cree_le })) };

          const nombres = new Map(comptes.all(q.id).map((c) => [c.valeur, c.nombre]));
          const attendues = q.type === "note" ? ["1", "2", "3", "4", "5"] : q.choix;
          // Les réponses dont l'intitulé a changé depuis sont gardées à la fin de la liste.
          const valeurs = [...new Set([...attendues, ...nombres.keys()])].map((v) => ({ valeur: v, nombre: nombres.get(v) || 0 }));
          if (q.type === "note") return { ...base, etiquettes: q.etiquettes, valeurs, moyenne: moyenne.get(q.id).m };
          return { ...base, valeurs };
        })
      };
    },

    // Une ligne par participation, une colonne par question (pour le fichier CSV).
    exporter() {
      const parParticipation = new Map(toutesParticipations.all().map((p) => [p.id, { date: p.cree_le, reponses: {} }]));
      for (const r of toutesReponses.all()) {
        const p = parParticipation.get(r.participation_id);
        (p.reponses[r.question_id] ||= []).push(r.valeur);
      }
      return [...parParticipation].map(([id, p]) => ({ id, date: p.date, reponses: p.reponses }));
    },

    fermer() {
      db.close();
    }
  };
}

function transaction(db, action) {
  db.exec("BEGIN");
  try {
    const resultat = action();
    db.exec("COMMIT");
    return resultat;
  } catch (erreur) {
    db.exec("ROLLBACK");
    throw erreur;
  }
}

// Repère tout de suite une faute de frappe dans questions.js, avec un message clair.
function verifierQuestions(questions) {
  const vus = new Set();
  questions.forEach((q, i) => {
    const ou = `questions.js, question ${i + 1}`;
    if (!q.id || !/^[a-z0-9_-]+$/i.test(q.id)) throw new Error(`${ou} : « id » doit être un mot simple, sans espace ni accent.`);
    if (vus.has(q.id)) throw new Error(`${ou} : l'id « ${q.id} » est déjà utilisé.`);
    vus.add(q.id);
    if (!q.intitule) throw new Error(`${ou} : « intitule » est vide.`);
    if (!TYPES.includes(q.type)) throw new Error(`${ou} : « type » doit être ${TYPES.join(", ")}.`);
    if ((q.type === "unique" || q.type === "multiple") && !(Array.isArray(q.choix) && q.choix.length >= 2)) {
      throw new Error(`${ou} : il faut au moins deux « choix ».`);
    }
  });
}

module.exports = { ouvrirBase };
