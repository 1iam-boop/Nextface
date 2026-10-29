/*
 * Page des résultats : lit les statistiques dans la base (resultats.json) et les affiche question par question.
 * Chaque barre montre la part des répondants à la question qui ont choisi cette réponse.
 */
(function () {
  "use strict";

  const $ = (selecteur) => document.querySelector(selecteur);
  const pourcent = new Intl.NumberFormat("fr-FR", { style: "percent", maximumFractionDigits: 0 });
  const decimal = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 });
  const dateLongue = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" });

  // Les dates de la base sont en UTC (« 2026-10-29 14:05:00 »).
  const lireDate = (texte) => new Date(texte.replace(" ", "T") + "Z");

  function element(balise, classe, texte) {
    const el = document.createElement(balise);
    if (classe) el.className = classe;
    if (texte !== undefined) el.textContent = texte;
    return el;
  }

  function ligne(nom, nombre, repondants) {
    const part = repondants ? nombre / repondants : 0;
    const li = element("li", "ligne");
    li.title = nom + " : " + nombre + " réponse" + (nombre > 1 ? "s" : "") + " (" + pourcent.format(part) + " des répondants)";
    const piste = element("span", "piste");
    const remplissage = element("span", "remplissage");
    remplissage.style.width = part * 100 + "%";
    if (!nombre) remplissage.hidden = true;
    piste.append(remplissage);
    const valeur = element("span", "ligne-valeur", nombre + " ");
    valeur.append(element("small", "", "· " + pourcent.format(part)));
    li.append(element("span", "ligne-nom", nom), piste, valeur);
    return li;
  }

  function carte(q) {
    const article = element("article", "carte resultat");
    article.append(element("h2", "", "Q" + q.numero + " · " + q.intitule));
    let meta = q.repondants + " répondant" + (q.repondants > 1 ? "s" : "");
    if (q.type === "multiple") meta += " · plusieurs réponses possibles";
    if (q.type === "note" && q.moyenne !== null) meta += " · moyenne " + decimal.format(q.moyenne) + " / 5";
    article.append(element("p", "meta", meta));

    if (q.type === "texte") {
      if (!q.textes.length) {
        article.append(element("p", "vide", "Aucune réponse pour l'instant."));
        return article;
      }
      const liste = element("ul", "textes");
      q.textes.forEach((t) => {
        const li = element("li", "", t.texte);
        const temps = element("time", "", dateLongue.format(lireDate(t.date)));
        temps.dateTime = lireDate(t.date).toISOString();
        li.prepend(temps);
        liste.append(li);
      });
      article.append(liste);
      return article;
    }

    const liste = element("ul", "lignes");
    q.valeurs.forEach((v) => {
      let nom = v.valeur;
      if (q.type === "note" && v.valeur === "1") nom = "1 · " + q.etiquettes[0];
      if (q.type === "note" && v.valeur === "5") nom = "5 · " + q.etiquettes[1];
      liste.append(ligne(nom, v.nombre, q.repondants));
    });
    article.append(liste);
    return article;
  }

  async function charger() {
    const erreur = $("#erreur");
    try {
      const reponse = await fetch("resultats.json", { cache: "no-store" });
      if (!reponse.ok) throw new Error();
      const donnees = await reponse.json();
      $("#total").textContent = donnees.total;
      $("#derniere").textContent = donnees.derniere ? dateLongue.format(lireDate(donnees.derniere)) : "Aucune";
      const zone = $("#resultats");
      zone.replaceChildren();
      if (!donnees.total) zone.append(element("p", "vide", "Aucune participation pour l'instant : partagez le lien du questionnaire !"));
      else donnees.questions.forEach((q) => zone.append(carte(q)));
      erreur.hidden = true;
    } catch {
      erreur.textContent = "Les résultats n'ont pas pu être chargés. Réessayez avec le bouton « Actualiser ».";
      erreur.hidden = false;
    }
  }

  $("#actualiser").addEventListener("click", charger);
  charger();
})();
