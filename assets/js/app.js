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
    return '<li><button class="p-item" id="parfum-' + i + '" data-p="' + i + '"><span class="p-name">' + echapper(p.nom) +
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
      (!q || sansAccent([p.nom, p.ref, p.ref15, p.famille, p.inspiration].filter(Boolean).join(" ")).includes(q)));
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
      (!q || sansAccent([p.ref, p.nom, p.actifs, p.rubrique, p.inspiration].filter(Boolean).join(" ")).includes(q)));
    document.querySelectorAll("#chips .chip").forEach((b) => b.classList.toggle("active", b.dataset.cat === filtre.univers));
    $("#count").textContent = liste.length + " soin" + (liste.length > 1 ? "s" : "");
    $("#productGrid").innerHTML = liste.length ? liste.map((p) => {
      const u = UNIVERS[p.univers];
      return '<article class="card" id="soin-' + parRef[p.ref] + '" tabindex="0" data-i="' + parRef[p.ref] + '">' +
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
      ligne("Inspiration", p.inspiration) + ligne("Format", p.format) + (AFFICHER_PRIX ? ligne("Prix indicatif", euros(p.prix), true) : '') + '</dl>' +
      '<div class="add-row"><button class="btn btn-plum btn-add" data-add="s:' + i + ':' + echapper(p.format) + '">Ajouter au panier</button>' +
      '<a href="#contact" class="btn btn-line btn-add modal-cta">Demander un conseil</a></div>' +
      '<p class="modal-ref">Référence ' + echapper(p.ref) + '</p>');
  }

  function ouvrirParfum(i) {
    const p = PARFUMS[i], g = GAMMES[p.gamme];
    const formats = ligne(p.grand, AFFICHER_PRIX ? euros(p.prixGrand) + (p.gamme === "classique" ? " (hors frais de port)" : "") : "Disponible", true) +
      (p.ref15 ? ligne("15 ml", AFFICHER_PRIX ? euros(p.prix15) : "Disponible", true) : "");
    montrer('<span class="card-cat g-' + p.genre + '">' + echapper(p.genre) + ' · ' + echapper(g.nom) + '</span>' +
      '<h3 id="modalTitle">' + echapper(p.nom) + '</h3><dl>' + ligne("Famille", p.famille) + ligne("Inspiration", p.inspiration) + formats + '</dl>' +
      '<div class="add-row"><button class="btn btn-plum btn-add" data-add="p:' + i + ':' + p.grand + '">Ajouter ' + p.grand + '</button>' +
      (p.ref15 ? '<button class="btn btn-line btn-add" data-add="p:' + i + ':15 ml">Ajouter 15 ml</button>' : '') + '</div>' +
      '<p class="modal-ref">Référence ' + echapper(p.ref) + (p.ref15 ? ' · 15 ml : ' + echapper(p.ref15) : '') + '</p>');
  }

  function fermer() { modal.hidden = true; document.body.style.overflow = ""; }
  document.addEventListener("click", (e) => {
    if (modal.contains(e.target) || e.target.closest(".drawer, .finder")) return;
    const s = e.target.closest(".card, .mist, .step");
    if (s) return ouvrirSoin(+s.dataset.i);
    const p = e.target.closest(".p-item");
    if (p) ouvrirParfum(+p.dataset.p);
  });
  $("#productGrid").addEventListener("keydown", (e) => { const c = e.target.closest(".card"); if (c && e.key === "Enter") ouvrirSoin(+c.dataset.i); });
  modal.addEventListener("click", (e) => { if (e.target === modal || e.target.closest(".modal-close") || e.target.closest(".modal-cta")) fermer(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) fermer(); });

  // ——— Recherche directe (nom ou inspiration) ———
  const INDEX = PARFUMS.map((p, i) => ({ type: "p", i, nom: p.nom, meta: p.genre + " · " + GAMMES[p.gamme].nom, inspiration: p.inspiration, ref: p.ref + " " + (p.ref15 || "") }))
    .concat(PRODUITS.map((p, i) => ({ type: "s", i, nom: p.nom, meta: UNIVERS[p.univers].nom + " · " + p.rubrique, inspiration: p.inspiration, ref: p.ref })));
  INDEX.forEach((x) => { x.cleNom = sansAccent(x.nom); x.cleInsp = sansAccent(x.inspiration || ""); x.cleRef = sansAccent(x.ref); });
  const finder = $("#finder"), fList = $("#finderList");
  let resultats = [], choisi = 0;

  function chercher(q) {
    q = sansAccent(q.trim());
    if (q.length < 2) return [];
    const score = (x) => {
      const insp = x.cleInsp.split(" · ")[0];
      if (x.cleNom === q) return 0;
      if (insp === q) return 1;
      if (x.cleNom.startsWith(q)) return 2;
      if (insp.startsWith(q)) return 3;
      if (x.cleNom.includes(q)) return 4;
      if (x.cleInsp.includes(q)) return 5;
      return x.cleRef.includes(q) ? 6 : 9;
    };
    return INDEX.map((x) => [score(x), x]).filter(([s]) => s < 9).sort((a, b) => a[0] - b[0] || (a[1].type === "p" ? -1 : 1)).slice(0, 8).map(([, x]) => x);
  }
  function montrerResultats() {
    resultats = chercher(finder.value);
    choisi = 0;
    if (finder.value.trim().length < 2) { fList.hidden = true; finder.setAttribute("aria-expanded", "false"); return; }
    fList.innerHTML = resultats.length ? resultats.map((x, k) =>
      '<li role="option" data-k="' + k + '" aria-selected="' + (k === 0) + '"><span class="f-name">' + echapper(x.nom) + '</span>' +
      '<span class="f-meta">' + echapper(x.meta) + (x.inspiration ? ' · inspiration <b>' + echapper(x.inspiration) + '</b>' : '') + '</span></li>'
    ).join("") : '<li class="finder-empty">Aucun produit trouvé. Essayez un autre nom ou une autre inspiration.</li>';
    fList.hidden = false;
    finder.setAttribute("aria-expanded", "true");
  }
  function allerA(x) {
    fList.hidden = true;
    finder.value = "";
    finder.blur();
    if (x.type === "p") {
      pFiltre.genre = "Tous"; pFiltre.gamme = "toutes"; $("#pSearch").value = ""; afficherParfums();
    } else {
      $("#search").value = ""; $("#fBio").checked = $("#fVegan").checked = false; choisirUnivers("tout");
    }
    const el = document.getElementById((x.type === "p" ? "parfum-" : "soin-") + x.i);
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("flash");
    setTimeout(() => el.classList.remove("flash"), 3300);
    setTimeout(() => (x.type === "p" ? ouvrirParfum : ouvrirSoin)(x.i), 650);
  }
  finder.addEventListener("input", montrerResultats);
  finder.addEventListener("keydown", (e) => {
    if (fList.hidden || !resultats.length) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      choisi = (choisi + (e.key === "ArrowDown" ? 1 : resultats.length - 1)) % resultats.length;
      fList.querySelectorAll("li").forEach((li, k) => li.setAttribute("aria-selected", k === choisi));
    } else if (e.key === "Enter") { e.preventDefault(); allerA(resultats[choisi]); }
    else if (e.key === "Escape") fList.hidden = true;
  });
  fList.addEventListener("mousedown", (e) => { const li = e.target.closest("li[data-k]"); if (li) { e.preventDefault(); allerA(resultats[+li.dataset.k]); } });
  finder.addEventListener("blur", () => setTimeout(() => (fList.hidden = true), 150));
  finder.addEventListener("focus", () => { if (finder.value.trim().length >= 2) montrerResultats(); });

  // ——— Panier (simulation, aucun achat) ———
  const CLE = "aw-panier";
  let panier = [];
  try { panier = JSON.parse(localStorage.getItem(CLE)) || []; } catch (e) { panier = []; }
  const sauver = () => { try { localStorage.setItem(CLE, JSON.stringify(panier)); } catch (e) { /* stockage indisponible : le panier reste en mémoire */ } };

  function detail(it) {
    if (it.type === "p") {
      const p = PARFUMS[it.i];
      const est15 = it.format === "15 ml";
      return { nom: p.nom, ref: est15 ? p.ref15 : p.ref, prix: est15 ? p.prix15 : p.prixGrand };
    }
    const p = PRODUITS[it.i];
    return { nom: p.nom, ref: p.ref.split(" ")[0], prix: p.prix };
  }
  function ajouter(code) {
    const [type, i, format] = code.split(":");
    const it = panier.find((x) => x.type === type && x.i === +i && x.format === format);
    if (it) it.qte++; else panier.push({ type, i: +i, format, qte: 1 });
    sauver(); dessinerPanier();
    toast("« " + detail({ type, i: +i, format }).nom + " » ajouté au panier");
  }
  let minuterie;
  function toast(t) { const el = $("#toast"); el.textContent = t; el.hidden = false; clearTimeout(minuterie); minuterie = setTimeout(() => (el.hidden = true), 2200); }

  function dessinerPanier() {
    const n = panier.reduce((s, x) => s + x.qte, 0);
    $("#cartCount").textContent = n;
    let total = 0, surDemande = false;
    $("#cartList").innerHTML = panier.length ? panier.map((it, k) => {
      const d = detail(it);
      if (d.prix == null) surDemande = true; else total += d.prix * it.qte;
      return '<li class="cart-item"><span class="ci-name">' + echapper(d.nom) + '</span>' +
        '<span class="ci-price">' + (d.prix == null ? "Sur demande" : euros(Math.round(d.prix * it.qte * 100) / 100)) + '</span>' +
        '<span class="ci-meta">' + echapper(it.format) + ' · réf. ' + echapper(d.ref) + '</span>' +
        '<span class="ci-qty"><button data-q="' + k + ':-1" aria-label="Retirer un">−</button><span>' + it.qte + '</span><button data-q="' + k + ':1" aria-label="Ajouter un">+</button></span></li>';
    }).join("") : '<li class="cart-empty">Votre panier est vide.<br />Ouvrez la fiche d\'un produit pour l\'ajouter.</li>';
    if (!panier.length) { $("#cartFoot").innerHTML = ""; return; }
    const lignes = panier.map((it) => { const d = detail(it); return "- " + d.nom + " (" + it.format + ", réf. " + d.ref + ") x" + it.qte; });
    const corps = "Bonjour,\n\nVoici ma sélection :\n" + lignes.join("\n") + "\n\nTotal estimé : " + euros(Math.round(total * 100) / 100) + (surDemande ? " (+ articles sur demande)" : "") + "\n\nMerci !";
    $("#cartFoot").innerHTML = '<div class="total"><span>Total estimé</span><strong>' + euros(Math.round(total * 100) / 100) + '</strong></div>' +
      '<p class="foot-note">Hors frais de port' + (surDemande ? ", hors articles dont le prix est sur demande" : "") + '. Ce total est une estimation : aucun paiement n\'est possible ici.</p>' +
      '<a class="btn btn-plum" href="mailto:kururo.f@gmail.com?subject=' + encodeURIComponent("Ma sélection AW Parfumerie") + '&body=' + encodeURIComponent(corps) + '">Envoyer ma sélection par e-mail</a>' +
      '<button class="link-btn" id="cartClear">Vider le panier</button>';
  }
  const drawer = $("#drawer"), drawerBg = $("#drawerBg");
  function ouvrirPanier() { drawer.hidden = drawerBg.hidden = false; document.body.style.overflow = "hidden"; $("#drawerClose").focus(); }
  function fermerPanier() { drawer.hidden = drawerBg.hidden = true; document.body.style.overflow = ""; }
  $("#cartBtn").addEventListener("click", ouvrirPanier);
  $("#drawerClose").addEventListener("click", fermerPanier);
  drawerBg.addEventListener("click", fermerPanier);
  drawer.addEventListener("click", (e) => {
    const b = e.target.closest("[data-q]");
    if (b) {
      const [k, d] = b.dataset.q.split(":").map(Number);
      panier[k].qte += d;
      if (panier[k].qte <= 0) panier.splice(k, 1);
      sauver(); dessinerPanier();
    }
    if (e.target.id === "cartClear") { panier = []; sauver(); dessinerPanier(); }
  });
  modal.addEventListener("click", (e) => { const b = e.target.closest("[data-add]"); if (b) { ajouter(b.dataset.add); fermer(); } });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !drawer.hidden) fermerPanier(); });
  dessinerPanier();

  // Menu mobile
  const toggle = $(".menu-toggle");
  toggle.addEventListener("click", () => { const o = document.body.classList.toggle("nav-open"); toggle.setAttribute("aria-expanded", o); });
  document.querySelectorAll(".nav a").forEach((a) => a.addEventListener("click", () => document.body.classList.remove("nav-open")));

  afficherParfums();
  remplirRubriques();
  afficherSoins();
})();
