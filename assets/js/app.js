(function () {
  const $ = (sel) => document.querySelector(sel);
  const echapper = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const euros = (v) => v == null ? "Prix sur demande" : (Number.isInteger(v) ? v : v.toFixed(2).replace(".", ",")) + " €";
  const parRef = Object.fromEntries(PRODUITS.map((p, i) => [p.ref, i]));
  const sansAccent = (t) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  // ——— Parfums ———
  const pFiltre = { genre: "Tous", gamme: "toutes" };
  const genresChips = ["Tous", "Femme", "Homme", "Mixte"];
  const gammesChips = [["toutes", "Toutes les gammes"]].concat(Object.entries(GAMMES).map(([k, g]) => [k, g.nom]));
  $("#pGenres").innerHTML = genresChips.map((g) => '<button class="chip" data-c="' + g + '">' + g + '</button>').join("");
  $("#pGammes").innerHTML = gammesChips.map(([k, n]) => '<button class="chip" data-c="' + k + '">' + n + '</button>').join("");

  function enTete(gamme, genre) {
    const g = GAMMES[gamme];
    let prix = "";
    if (gamme === "classique") prix = "35 € les 70 ml · 11,90 € les 15 ml<small>Hors frais de port</small>";
    else if (gamme === "luxe") prix = "70 ml · 15 ml";
    else if (gamme === "luxury") prix = "50 ml · 15 ml";
    else prix = euros(g.prixGrand) + " les " + g.grand;
    const titre = gamme === "enfant" ? "Parfums enfants" : gamme === "creation" ? "Créations" : genre + " · " + g.nom;
    return '<div class="p-head"><h3 class="g-' + genre + '">' + titre + '</h3><span class="price-note">' + prix + '</span></div>';
  }

  function ligneParfum(p) {
    const i = PARFUMS.indexOf(p);
    const prix = (p.gamme === "luxe" || p.gamme === "luxury") ? '<span class="p-price">' + euros(p.prixGrand) + ' · ' + euros(p.prix15) + '</span>' : '';
    return '<li><button class="p-item" data-p="' + i + '"><span class="p-name">' + echapper(p.nom) +
      (p.famille ? '<span class="p-fam">' + echapper(p.famille) + '</span>' : '') + '</span>' +
      '<span class="p-ref">' + echapper(p.ref) + '</span>' + prix + '</button></li>';
  }

  function afficherParfums() {
    const q = sansAccent($("#pSearch").value.trim());
    document.querySelectorAll("#pGenres .chip").forEach((b) => b.classList.toggle("active", b.dataset.c === pFiltre.genre));
    document.querySelectorAll("#pGammes .chip").forEach((b) => b.classList.toggle("active", b.dataset.c === pFiltre.gamme));
    const liste = PARFUMS.filter((p) =>
      (pFiltre.genre === "Tous" || p.genre === pFiltre.genre) &&
      (pFiltre.gamme === "toutes" || p.gamme === pFiltre.gamme) &&
      (!q || sansAccent(p.nom + " " + p.ref + " " + (p.ref15 || "") + " " + (p.famille || "")).includes(q)));
    const groupes = [];
    Object.keys(GAMMES).forEach((gamme) => {
      const genres = (gamme === "creation" || gamme === "enfant") ? [null] : ["Femme", "Homme", "Mixte"];
      genres.forEach((genre) => {
        const items = liste.filter((p) => p.gamme === gamme && (genre === null || p.genre === genre));
        if (items.length) groupes.push('<div class="p-group ' + gamme + '">' + enTete(gamme, genre || (gamme === "enfant" ? "Enfant" : "Mixte")) +
          '<ul class="p-list">' + items.map(ligneParfum).join("") + '</ul></div>');
      });
    });
    $("#pListe").innerHTML = groupes.join("") || '<p class="empty">Aucun parfum ne correspond à votre recherche.</p>';
  }

  $("#pGenres").addEventListener("click", (e) => { const b = e.target.closest(".chip"); if (b) { pFiltre.genre = b.dataset.c; afficherParfums(); } });
  $("#pGammes").addEventListener("click", (e) => { const b = e.target.closest(".chip"); if (b) { pFiltre.gamme = b.dataset.c; afficherParfums(); } });
  $("#pSearch").addEventListener("input", afficherParfums);

  // ——— Étuis ———
  $("#etuisGrid").innerHTML = ETUIS.map((e) =>
    '<div class="etui"><span class="etui-tube" style="--c:' + e.couleur + '"></span><strong>' + echapper(e.nom) + '</strong>' +
    (AFFICHER_PRIX ? '<b>' + euros(e.prix) + '</b>' : '') + '<span>' + e.ref + '</span></div>'
  ).join("");

  // ——— Soins ———
  function visuel(forme, teinte) {
    const formes = {
      spray: '<rect x="42" y="8" width="16" height="10" rx="2" fill="#b98a5e"/><rect x="58" y="11" width="10" height="4" fill="#9a6f48"/><rect x="40" y="18" width="20" height="10" fill="#9a6f48"/><rect x="28" y="28" width="44" height="64" rx="10" fill="TEINTE"/><rect x="35" y="36" width="8" height="46" rx="4" fill="#fff" opacity=".4"/>',
      jar:   '<rect x="22" y="34" width="56" height="14" rx="3" fill="#b98a5e"/><rect x="24" y="48" width="52" height="40" rx="8" fill="TEINTE"/><rect x="32" y="56" width="36" height="16" rx="3" fill="#fff" opacity=".45"/>',
      tube:  '<path d="M34 14h32l-4 66H38z" fill="TEINTE"/><rect x="38" y="80" width="24" height="12" rx="3" fill="#b98a5e"/><rect x="34" y="12" width="32" height="5" fill="#9a6f48"/>',
      pump:  '<rect x="46" y="8" width="20" height="6" rx="2" fill="#b98a5e"/><rect x="46" y="10" width="6" height="22" fill="#b98a5e"/><rect x="40" y="30" width="20" height="10" fill="#9a6f48"/><rect x="30" y="40" width="40" height="52" rx="8" fill="TEINTE"/>'
    };
    return '<svg viewBox="0 0 100 100" aria-hidden="true">' + (formes[forme] || formes.pump).replace(/TEINTE/g, teinte) + '</svg>';
  }
  const labels = (p) => (p.bio ? '<span class="tag">Bio</span>' : '') + (p.vegan ? '<span class="tag">Vegan</span>' : '');

  $("#universeGrid").innerHTML = Object.entries(UNIVERS).map(([cle, u]) => {
    const n = PRODUITS.filter((p) => p.univers === cle).length;
    return '<a class="universe" href="#catalogue" data-cat="' + cle + '">' +
      '<div class="universe-visual" style="--tint:' + u.teinte + '">' + visuel(u.forme, u.teinte) + '</div>' +
      '<h3>' + echapper(u.nom) + '</h3><p>' + echapper(u.texte) + '</p>' +
      '<span class="universe-count">' + n + ' produit' + (n > 1 ? 's' : '') + ' →</span></a>';
  }).join("");

  $("#mists").innerHTML = PRODUITS.filter((p) => p.notes).map((p) =>
    '<button class="mist" data-i="' + parRef[p.ref] + '"><h3>' + echapper(p.nom.replace("Brume corps ", "")) + '</h3>' +
    '<dl><dt>Tête</dt><dd>' + echapper(p.notes.tete) + '</dd><dt>Cœur</dt><dd>' + echapper(p.notes.coeur) + '</dd>' +
    '<dt>Fond</dt><dd>' + echapper(p.notes.fond) + '</dd></dl>' +
    (AFFICHER_PRIX ? '<span class="mist-price">' + euros(p.prix) + '</span>' : '') + '<span class="mist-ref">' + p.ref + '</span></button>'
  ).join("");

  const motCle = (nom) => nom.toLowerCase().replace(" vera", "");
  $("#ingredientsGrid").innerHTML = INGREDIENTS.map((ing) => {
    const n = PRODUITS.filter((p) => (p.actifs + " " + p.nom).toLowerCase().includes(motCle(ing.nom))).length;
    return '<button class="ingredient" data-q="' + echapper(motCle(ing.nom)) + '"><h3>' + echapper(ing.nom) + '</h3>' +
      '<p>' + echapper(ing.texte) + '</p><span class="universe-count">' + n + ' soins →</span></button>';
  }).join("");

  const etape = (ref, label) => {
    const p = PRODUITS[parRef[ref]];
    return '<li><button class="step" data-i="' + parRef[ref] + '">' + (label ? '<em>' + label + '</em>' : '') +
      '<span class="step-name">' + echapper(p.nom) + '</span><span class="step-ref">' + ref + '</span></button></li>';
  };
  $("#routinesGrid").innerHTML = ROUTINES.map((r) =>
    '<article class="routine"><h3>' + echapper(r.nom) + '</h3><ol>' + r.etapes.map((ref) => etape(ref)).join("") + '</ol>' +
    '<ul class="routine-mask">' + etape(r.masque, "Masque, 2 fois par semaine") + '</ul></article>'
  ).join("");

  const filtre = { univers: "tout", rubrique: "toutes" };
  $("#chips").innerHTML = [["tout", "Tout"]].concat(Object.entries(UNIVERS).map(([k, u]) => [k, u.nom]))
    .map(([k, nom]) => '<button class="chip" data-cat="' + k + '">' + echapper(nom) + '</button>').join("");

  function remplirRubriques() {
    const rubs = [...new Set(PRODUITS.filter((p) => filtre.univers === "tout" || p.univers === filtre.univers).map((p) => p.rubrique))];
    $("#rubrique").innerHTML = '<option value="toutes">Toutes les rubriques</option>' + rubs.map((r) => '<option>' + echapper(r) + '</option>').join("");
    $("#rubrique").hidden = rubs.length < 2;
    filtre.rubrique = "toutes";
  }

  function afficherSoins() {
    const q = sansAccent($("#search").value.trim());
    const bio = $("#fBio").checked, vegan = $("#fVegan").checked;
    const liste = PRODUITS.filter((p) =>
      (filtre.univers === "tout" || p.univers === filtre.univers) &&
      (filtre.rubrique === "toutes" || p.rubrique === filtre.rubrique) &&
      (!bio || p.bio) && (!vegan || p.vegan) &&
      (!q || sansAccent([p.ref, p.nom, p.actifs, p.rubrique].join(" ")).includes(q)));
    document.querySelectorAll("#chips .chip").forEach((b) => b.classList.toggle("active", b.dataset.cat === filtre.univers));
    $("#count").textContent = liste.length + " soin" + (liste.length > 1 ? "s" : "");
    $("#productGrid").innerHTML = liste.length ? liste.map((p) => {
      const u = UNIVERS[p.univers];
      return '<article class="card" tabindex="0" data-i="' + parRef[p.ref] + '">' +
        '<div class="card-visual" style="--tint:' + u.teinte + '">' + visuel(u.forme, u.teinte) + '<span class="card-tags">' + labels(p) + '</span></div>' +
        '<div class="card-body"><span class="card-cat">' + echapper(p.rubrique) + '</span>' +
        '<h3>' + echapper(p.nom) + '</h3><p>' + echapper(p.actifs) + '</p>' +
        '<div class="card-foot"><span>' + echapper(p.format) + ' · ' + echapper(p.ref.split(" ")[0]) + '</span>' + (AFFICHER_PRIX ? '<strong>' + euros(p.prix) + '</strong>' : '') + '</div>' +
        '</div></article>';
    }).join("") : '<p class="empty">Aucun soin ne correspond à votre recherche.</p>';
  }

  function choisirUnivers(cat) { filtre.univers = cat; remplirRubriques(); afficherSoins(); }
  $("#chips").addEventListener("click", (e) => { const b = e.target.closest(".chip"); if (b) choisirUnivers(b.dataset.cat); });
  $("#rubrique").addEventListener("change", (e) => { filtre.rubrique = e.target.value; afficherSoins(); });
  ["#search", "#fBio", "#fVegan"].forEach((s) => $(s).addEventListener("input", afficherSoins));
  $("#universeGrid").addEventListener("click", (e) => { const a = e.target.closest(".universe"); if (a) { $("#search").value = ""; choisirUnivers(a.dataset.cat); } });
  $("#ingredientsGrid").addEventListener("click", (e) => {
    const b = e.target.closest(".ingredient");
    if (!b) return;
    $("#search").value = b.dataset.q;
    choisirUnivers("tout");
    $("#catalogue").scrollIntoView({ behavior: "smooth" });
  });

  // ——— Fiches ———
  const modal = $("#modal");
  const ligne = (label, val, fort) => val ? '<dt>' + label + '</dt><dd' + (fort ? ' class="strong"' : '') + '>' + echapper(val) + '</dd>' : '';
  function montrer(html) { $("#modalBody").innerHTML = html; modal.hidden = false; document.body.style.overflow = "hidden"; }

  function ouvrirSoin(i) {
    const p = PRODUITS[i], u = UNIVERS[p.univers];
    montrer('<div class="modal-visual" style="--tint:' + u.teinte + '">' + visuel(u.forme, u.teinte) + '</div>' +
      '<span class="card-cat">' + echapper(u.nom) + ' · ' + echapper(p.rubrique) + '</span><h3 id="modalTitle">' + echapper(p.nom) + '</h3>' +
      '<div class="modal-tags">' + labels(p) + '</div><dl>' + ligne("Actifs", p.actifs) +
      (p.notes ? ligne("Tête", p.notes.tete) + ligne("Cœur", p.notes.coeur) + ligne("Fond", p.notes.fond) : '') +
      ligne("Format", p.format) + (AFFICHER_PRIX ? ligne("Prix indicatif", euros(p.prix), true) : '') + '</dl>' +
      '<p class="modal-ref">Référence ' + echapper(p.ref) + '</p>' +
      '<a href="#contact" class="btn btn-plum modal-cta">Demander un conseil</a>');
  }

  function ouvrirParfum(i) {
    const p = PARFUMS[i], g = GAMMES[p.gamme];
    const formats = ligne(p.grand, AFFICHER_PRIX ? euros(p.prixGrand) + (p.gamme === "classique" ? " (hors frais de port)" : "") : "Disponible", true) +
      (p.ref15 ? ligne("15 ml", AFFICHER_PRIX ? euros(p.prix15) : "Disponible", true) : "");
    montrer('<span class="card-cat g-' + p.genre + '">' + echapper(p.genre) + ' · ' + echapper(g.nom) + '</span>' +
      '<h3 id="modalTitle">' + echapper(p.nom) + '</h3><dl>' + ligne("Famille", p.famille) + formats + '</dl>' +
      '<p class="modal-ref">Référence ' + echapper(p.ref) + (p.ref15 ? ' · 15 ml : ' + echapper(p.ref15) : '') + '</p>' +
      '<a href="#contact" class="btn btn-plum modal-cta">Demander ce parfum</a>');
  }

  function fermer() { modal.hidden = true; document.body.style.overflow = ""; }
  document.addEventListener("click", (e) => {
    if (modal.contains(e.target)) return;
    const s = e.target.closest(".card, .mist, .step");
    if (s) return ouvrirSoin(+s.dataset.i);
    const p = e.target.closest(".p-item");
    if (p) ouvrirParfum(+p.dataset.p);
  });
  $("#productGrid").addEventListener("keydown", (e) => { const c = e.target.closest(".card"); if (c && e.key === "Enter") ouvrirSoin(+c.dataset.i); });
  modal.addEventListener("click", (e) => { if (e.target === modal || e.target.closest(".modal-close") || e.target.closest(".modal-cta")) fermer(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) fermer(); });

  // Menu mobile
  const toggle = $(".menu-toggle");
  toggle.addEventListener("click", () => { const o = document.body.classList.toggle("nav-open"); toggle.setAttribute("aria-expanded", o); });
  document.querySelectorAll(".nav a").forEach((a) => a.addEventListener("click", () => document.body.classList.remove("nav-open")));

  afficherParfums();
  remplirRubriques();
  afficherSoins();
})();
