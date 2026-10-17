(function () {
  const $ = (sel) => document.querySelector(sel);
  const echapper = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const prix = (v) => v == null ? "Prix sur demande" : v.toFixed(2).replace(".", ",") + " €";
  const parRef = Object.fromEntries(PRODUITS.map((p, i) => [p.ref, i]));

  // Petite illustration SVG selon le type de produit (pas d'images externes).
  function visuel(forme, teinte) {
    const formes = {
      spray: '<rect x="42" y="8" width="16" height="10" rx="2" fill="#c9a45c"/><rect x="58" y="11" width="10" height="4" fill="#a8873f"/><rect x="40" y="18" width="20" height="10" fill="#a8873f"/><rect x="28" y="28" width="44" height="64" rx="10" fill="TEINTE"/><rect x="35" y="36" width="8" height="46" rx="4" fill="#fff" opacity=".35"/>',
      jar:   '<rect x="22" y="34" width="56" height="14" rx="3" fill="#c9a45c"/><rect x="24" y="48" width="52" height="40" rx="8" fill="TEINTE"/><rect x="32" y="56" width="36" height="16" rx="3" fill="#fff" opacity=".4"/>',
      tube:  '<path d="M34 14h32l-4 66H38z" fill="TEINTE"/><rect x="38" y="80" width="24" height="12" rx="3" fill="#c9a45c"/><rect x="34" y="12" width="32" height="5" fill="#a8873f"/>',
      pump:  '<rect x="46" y="8" width="20" height="6" rx="2" fill="#c9a45c"/><rect x="46" y="10" width="6" height="22" fill="#c9a45c"/><rect x="40" y="30" width="20" height="10" fill="#a8873f"/><rect x="30" y="40" width="40" height="52" rx="8" fill="TEINTE"/>'
    };
    return '<svg viewBox="0 0 100 100" aria-hidden="true">' + (formes[forme] || formes.pump).replace(/TEINTE/g, teinte) + '</svg>';
  }
  const labels = (p) => (p.bio ? '<span class="tag">Bio</span>' : '') + (p.vegan ? '<span class="tag">Vegan</span>' : '');

  // Univers
  $("#universeGrid").innerHTML = Object.entries(UNIVERS).map(([cle, u]) => {
    const n = PRODUITS.filter((p) => p.univers === cle).length;
    return '<a class="universe" href="#catalogue" data-cat="' + cle + '">' +
      '<div class="universe-visual" style="--tint:' + u.teinte + '">' + visuel(u.forme, u.teinte) + '</div>' +
      '<h3>' + echapper(u.nom) + '</h3><p>' + echapper(u.texte) + '</p>' +
      '<span class="universe-count">' + n + ' produit' + (n > 1 ? 's' : '') + ' →</span></a>';
  }).join("");

  // Brumes Lush Cloud
  $("#mists").innerHTML = PRODUITS.filter((p) => p.notes).map((p) =>
    '<button class="mist" data-i="' + parRef[p.ref] + '"><span class="mist-ref">' + p.ref + '</span>' +
    '<h3>' + echapper(p.nom.replace("Brume corps ", "")) + '</h3>' +
    '<dl><dt>Tête</dt><dd>' + echapper(p.notes.tete) + '</dd><dt>Cœur</dt><dd>' + echapper(p.notes.coeur) + '</dd>' +
    '<dt>Fond</dt><dd>' + echapper(p.notes.fond) + '</dd></dl>' +
    (AFFICHER_PRIX ? '<span class="mist-price">' + prix(p.prix) + '</span>' : '') + '</button>'
  ).join("");

  // Ingrédients phares
  const motCle = (nom) => nom.toLowerCase().replace(" vera", "");
  $("#ingredientsGrid").innerHTML = INGREDIENTS.map((ing) => {
    const n = PRODUITS.filter((p) => p.actifs.toLowerCase().includes(motCle(ing.nom)) || p.nom.toLowerCase().includes(motCle(ing.nom))).length;
    return '<button class="ingredient" data-q="' + echapper(motCle(ing.nom)) + '"><h3>' + echapper(ing.nom) + '</h3>' +
      '<p>' + echapper(ing.texte) + '</p><span class="universe-count">' + n + ' produits →</span></button>';
  }).join("");

  // Routines visage
  const etape = (ref, label) => {
    const p = PRODUITS[parRef[ref]];
    return '<li><button class="step" data-i="' + parRef[ref] + '"><span class="step-ref">' + ref + '</span>' +
      '<span>' + (label ? '<em>' + label + '</em> ' : '') + echapper(p.nom) + '</span></button></li>';
  };
  $("#routinesGrid").innerHTML = ROUTINES.map((r) =>
    '<article class="routine"><h3>' + echapper(r.nom) + '</h3><ol>' + r.etapes.map((ref) => etape(ref)).join("") + '</ol>' +
    '<ul class="routine-mask">' + etape(r.masque, "2×/semaine :") + '</ul></article>'
  ).join("");

  // Catalogue
  const filtre = { univers: "tout", rubrique: "toutes" };
  const chips = [["tout", "Tout"]].concat(Object.entries(UNIVERS).map(([k, u]) => [k, u.nom]));
  $("#chips").innerHTML = chips.map(([k, nom]) => '<button class="chip" role="tab" data-cat="' + k + '">' + echapper(nom) + '</button>').join("");

  function remplirRubriques() {
    const rubs = [...new Set(PRODUITS.filter((p) => filtre.univers === "tout" || p.univers === filtre.univers).map((p) => p.rubrique))];
    $("#rubrique").innerHTML = '<option value="toutes">Toutes les rubriques</option>' + rubs.map((r) => '<option>' + echapper(r) + '</option>').join("");
    $("#rubrique").hidden = rubs.length < 2;
    filtre.rubrique = "toutes";
  }

  function afficher() {
    const q = $("#search").value.trim().toLowerCase();
    const bio = $("#fBio").checked, vegan = $("#fVegan").checked;
    const liste = PRODUITS.filter((p) =>
      (filtre.univers === "tout" || p.univers === filtre.univers) &&
      (filtre.rubrique === "toutes" || p.rubrique === filtre.rubrique) &&
      (!bio || p.bio) && (!vegan || p.vegan) &&
      (!q || [p.ref, p.nom, p.actifs, p.rubrique, p.format].join(" ").toLowerCase().includes(q))
    );
    document.querySelectorAll(".chip").forEach((b) => b.classList.toggle("active", b.dataset.cat === filtre.univers));
    $("#count").textContent = liste.length + " produit" + (liste.length > 1 ? "s" : "");
    $("#productGrid").innerHTML = liste.length ? liste.map((p) => {
      const u = UNIVERS[p.univers];
      return '<article class="card" tabindex="0" data-i="' + parRef[p.ref] + '">' +
        '<div class="card-visual" style="--tint:' + u.teinte + '">' + visuel(u.forme, u.teinte) +
        '<span class="card-ref">' + echapper(p.ref.split(" ")[0]) + '</span><span class="card-tags">' + labels(p) + '</span></div>' +
        '<div class="card-body"><span class="card-cat">' + echapper(p.rubrique) + '</span>' +
        '<h3>' + echapper(p.nom) + '</h3><p>' + echapper(p.actifs) + '</p>' +
        '<div class="card-foot"><span>' + echapper(p.format) + '</span>' + (AFFICHER_PRIX ? '<strong>' + prix(p.prix) + '</strong>' : '') + '</div>' +
        '</div></article>';
    }).join("") : '<p class="empty">Aucun produit ne correspond à votre recherche.</p>';
  }

  function choisirUnivers(cat) {
    filtre.univers = cat;
    remplirRubriques();
    afficher();
  }

  $("#chips").addEventListener("click", (e) => { const b = e.target.closest(".chip"); if (b) choisirUnivers(b.dataset.cat); });
  $("#rubrique").addEventListener("change", (e) => { filtre.rubrique = e.target.value; afficher(); });
  ["#search", "#fBio", "#fVegan"].forEach((s) => $(s).addEventListener("input", afficher));
  $("#universeGrid").addEventListener("click", (e) => {
    const a = e.target.closest(".universe");
    if (!a) return;
    $("#search").value = "";
    choisirUnivers(a.dataset.cat);
  });
  $("#ingredientsGrid").addEventListener("click", (e) => {
    const b = e.target.closest(".ingredient");
    if (!b) return;
    $("#search").value = b.dataset.q;
    choisirUnivers("tout");
    $("#catalogue").scrollIntoView({ behavior: "smooth" });
  });

  // Fiche produit (fenêtre)
  const modal = $("#modal");
  function ouvrir(i) {
    const p = PRODUITS[i], u = UNIVERS[p.univers];
    const ligne = (label, val) => val ? '<dt>' + label + '</dt><dd>' + echapper(val) + '</dd>' : '';
    $("#modalBody").innerHTML =
      '<div class="modal-visual" style="--tint:' + u.teinte + '">' + visuel(u.forme, u.teinte) + '</div>' +
      '<span class="card-cat">' + echapper(u.nom) + ' · ' + echapper(p.rubrique) + '</span><h3 id="modalTitle">' + echapper(p.nom) + '</h3>' +
      '<div class="modal-tags">' + labels(p) + '</div><dl>' +
      ligne("Référence", p.ref) + ligne("Actifs", p.actifs) +
      (p.notes ? ligne("Tête", p.notes.tete) + ligne("Cœur", p.notes.coeur) + ligne("Fond", p.notes.fond) : '') +
      ligne("Format", p.format) + (AFFICHER_PRIX ? ligne("Prix indicatif", prix(p.prix)) : '') + '</dl>' +
      '<a href="#contact" class="btn btn-gold modal-cta">Demander un conseil</a>';
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function fermer() { modal.hidden = true; document.body.style.overflow = ""; }
  document.addEventListener("click", (e) => {
    const c = e.target.closest(".card, .mist, .step");
    if (c && !modal.contains(c)) ouvrir(+c.dataset.i);
  });
  $("#productGrid").addEventListener("keydown", (e) => { const c = e.target.closest(".card"); if (c && e.key === "Enter") ouvrir(+c.dataset.i); });
  modal.addEventListener("click", (e) => { if (e.target === modal || e.target.closest(".modal-close") || e.target.closest(".modal-cta")) fermer(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) fermer(); });

  // Menu mobile
  const toggle = $(".menu-toggle");
  toggle.addEventListener("click", () => {
    const ouvert = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", ouvert);
  });
  document.querySelectorAll(".nav a").forEach((a) => a.addEventListener("click", () => document.body.classList.remove("nav-open")));

  remplirRubriques();
  afficher();
})();
