(function () {
  const $ = (sel) => document.querySelector(sel);
  const echapper = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const euros = (v) => v == null ? "Prix sur demande" : (Number.isInteger(v) ? v : v.toFixed(2).replace(".", ",")) + " €";
  const arrondi = (v) => Math.round(v * 100) / 100;
  const sansAccent = (t) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const parRef = Object.fromEntries(PRODUITS.map((p, i) => [p.ref, i]));
  const parfumParRef = Object.fromEntries(PARFUMS.map((p, i) => [p.ref, i]));

  // Petite illustration SVG selon le type de produit (pas d'images externes).
  function visuel(forme, teinte) {
    const formes = {
      flacon: '<rect x="40" y="10" width="20" height="14" rx="3" fill="#b98a5e"/><rect x="45" y="22" width="10" height="8" fill="#9a6f48"/><rect x="24" y="30" width="52" height="60" rx="12" fill="TEINTE"/><rect x="32" y="38" width="9" height="42" rx="4.5" fill="#fff" opacity=".4"/>',
      spray: '<rect x="42" y="8" width="16" height="10" rx="2" fill="#b98a5e"/><rect x="58" y="11" width="10" height="4" fill="#9a6f48"/><rect x="40" y="18" width="20" height="10" fill="#9a6f48"/><rect x="28" y="28" width="44" height="64" rx="10" fill="TEINTE"/><rect x="35" y="36" width="8" height="46" rx="4" fill="#fff" opacity=".4"/>',
      jar:   '<rect x="22" y="34" width="56" height="14" rx="3" fill="#b98a5e"/><rect x="24" y="48" width="52" height="40" rx="8" fill="TEINTE"/><rect x="32" y="56" width="36" height="16" rx="3" fill="#fff" opacity=".45"/>',
      tube:  '<path d="M34 14h32l-4 66H38z" fill="TEINTE"/><rect x="38" y="80" width="24" height="12" rx="3" fill="#b98a5e"/><rect x="34" y="12" width="32" height="5" fill="#9a6f48"/>',
      pump:  '<rect x="46" y="8" width="20" height="6" rx="2" fill="#b98a5e"/><rect x="46" y="10" width="6" height="22" fill="#b98a5e"/><rect x="40" y="30" width="20" height="10" fill="#9a6f48"/><rect x="30" y="40" width="40" height="52" rx="8" fill="TEINTE"/>'
    };
    return '<svg viewBox="0 0 100 100" aria-hidden="true">' + (formes[forme] || formes.pump).replace(/TEINTE/g, teinte) + '</svg>';
  }
  // Photo du produit si elle existe, sinon l'illustration dessinée.
  const photo = (p, forme, teinte) => p.image
    ? '<img src="' + p.image + '" alt="' + echapper(p.nom) + '" loading="lazy" />'
    : visuel(forme, teinte);
  const TEINTES_GENRE = { Femme: "#d9b0c4", Homme: "#c9b2a8", Mixte: "#d7a98c", Enfant: "#b9cdd3" };
  const labels = (p) => (p.bio ? '<span class="tag">Bio</span>' : '') + (p.vegan ? '<span class="tag">Vegan</span>' : '');

  // ——— Onglets Parfums / Soins ———
  function onglet(nom) {
    const parfums = nom === "parfums";
    $("#tabParfums").setAttribute("aria-selected", parfums);
    $("#tabSoins").setAttribute("aria-selected", !parfums);
    $("#panelParfums").hidden = !parfums;
    $("#panelSoins").hidden = parfums;
  }
  $("#tabParfums").addEventListener("click", () => onglet("parfums"));
  $("#tabSoins").addEventListener("click", () => onglet("soins"));

  // ——— Best-sellers ———
  $("#bestGrid").innerHTML = BEST_SELLERS.map((code) => {
    const [type, ref] = code.split(":");
    if (type === "p") {
      const i = parfumParRef[ref], p = PARFUMS[i];
      if (p == null) return "";
      return '<button class="best" data-p="' + i + '"><span class="best-visual' + (p.image ? ' has-photo' : '') + '" style="--tint:' + TEINTES_GENRE[p.genre] + '">' + photo(p, "flacon", TEINTES_GENRE[p.genre]) + '</span>' +
        '<span class="card-cat g-' + p.genre + '">Parfum ' + p.genre.toLowerCase() + '</span><span class="best-name">' + echapper(p.nom) + '</span>' +
        (AFFICHER_PRIX ? '<span class="best-price">dès ' + euros(p.prix15 || p.prixGrand) + '</span>' : '') + '</button>';
    }
    const i = parRef[ref], p = PRODUITS[i];
    if (p == null) return "";
    const u = UNIVERS[p.univers];
    return '<button class="best" data-i="' + i + '"><span class="best-visual' + (p.image ? ' has-photo' : '') + '" style="--tint:' + u.teinte + '">' + photo(p, u.forme, u.teinte) + '</span>' +
      '<span class="card-cat">' + echapper(u.nom) + '</span><span class="best-name">' + echapper(p.nom) + '</span>' +
      (AFFICHER_PRIX ? '<span class="best-price">' + euros(p.prix) + '</span>' : '') + '</button>';
  }).join("");

  // ——— Catégories dépliantes ———
  function bloc(id, classe, titre, couleur, nb, prix, contenu) {
    return '<details class="acc ' + classe + '" id="' + id + '"><summary>' +
      '<span class="acc-title ' + couleur + '">' + titre + '</span><span class="acc-meta"><span class="acc-count">' + nb + '</span>' +
      (prix ? '<span class="acc-price">' + prix + '</span>' : '') + '</span><span class="acc-chevron" aria-hidden="true"></span></summary>' +
      '<div class="acc-body">' + contenu + '</div></details>';
  }
  const compte = (n, mot) => n + " " + mot + (n > 1 ? "s" : "");

  // Parfums
  function prixGroupe(gamme) {
    const g = GAMMES[gamme];
    if (!AFFICHER_PRIX) return "";
    if (gamme === "classique") return "35 € les 70 ml · 11,90 € les 15 ml";
    if (gamme === "luxe") return "70 ml · 15 ml";
    if (gamme === "luxury") return "50 ml · 15 ml";
    return euros(g.prixGrand) + " les " + g.grand;
  }
  function ligneParfum(p) {
    const i = PARFUMS.indexOf(p);
    const prix = AFFICHER_PRIX && (p.gamme === "luxe" || p.gamme === "luxury") ? '<span class="p-price">' + euros(p.prixGrand) + ' · ' + euros(p.prix15) + '</span>' : '';
    return '<li><button class="p-item" id="parfum-' + i + '" data-p="' + i + '"><span class="p-name">' + echapper(p.nom) +
      (p.famille ? '<span class="p-fam">' + echapper(p.famille) + '</span>' : '') + '</span>' +
      '<span class="p-ref">' + echapper(p.ref) + '</span>' + prix + '</button></li>';
  }
  const blocsParfums = [];
  Object.keys(GAMMES).forEach((gamme) => {
    const genres = (gamme === "creation" || gamme === "enfant") ? [null] : ["Femme", "Homme", "Mixte"];
    genres.forEach((genre) => {
      const items = PARFUMS.filter((p) => p.gamme === gamme && (genre === null || p.genre === genre));
      if (!items.length) return;
      const couleur = "g-" + (genre || (gamme === "enfant" ? "Enfant" : "Mixte"));
      const titre = gamme === "enfant" ? "Parfums enfants" : gamme === "creation" ? "Créations" : "Parfums " + genre.toLowerCase() + " · " + GAMMES[gamme].nom;
      const note = gamme === "classique" ? '<p class="acc-note">Hors frais de port.</p>' : "";
      blocsParfums.push(bloc("cat-" + gamme + "-" + (genre || "tous"), gamme, titre, couleur, compte(items.length, "parfum"), prixGroupe(gamme),
        note + '<ul class="p-list">' + items.map(ligneParfum).join("") + '</ul>'));
    });
  });
  const etuis = '<p class="acc-note">Pour protéger et emporter votre flacon de 15 ml.</p><div class="etuis">' + ETUIS.map((e) =>
    '<div class="etui"><span class="etui-tube" style="--c:' + e.couleur + '"></span><strong>' + echapper(e.nom) + '</strong>' +
    (AFFICHER_PRIX ? '<b>' + euros(e.prix) + '</b>' : '') + '<span>' + e.ref + '</span></div>').join("") + '</div>';
  blocsParfums.push(bloc("cat-etuis", "etuis-acc", "Les étuis", "g-Mixte", compte(ETUIS.length, "étui"), AFFICHER_PRIX ? "13 € · 15 €" : "", etuis));
  $("#pListe").innerHTML = blocsParfums.join("");

  // Soins
  function ligneSoin(p) {
    const i = parRef[p.ref];
    return '<li><button class="p-item" id="soin-' + i + '" data-i="' + i + '"><span class="p-name">' + echapper(p.nom) +
      '<span class="p-fam">' + echapper(p.format) + (p.bio ? ' · Bio' : '') + (p.vegan ? ' · Vegan' : '') + '</span></span>' +
      '<span class="p-ref">' + (p.sansRef ? '' : echapper(p.ref.split(" ")[0])) + '</span>' + (AFFICHER_PRIX ? '<span class="p-price">' + euros(p.prix) + '</span>' : '') + '</button></li>';
  }
  $("#sListe").innerHTML = Object.entries(UNIVERS).map(([cle, u]) => {
    const items = PRODUITS.filter((p) => p.univers === cle);
    const rubs = [...new Set(items.map((p) => p.rubrique))];
    const contenu = '<p class="acc-note">' + echapper(u.texte) + '</p>' + rubs.map((r) =>
      (rubs.length > 1 ? '<h4 class="acc-sub">' + echapper(r) + '</h4>' : '') +
      '<ul class="p-list">' + items.filter((p) => p.rubrique === r).map(ligneSoin).join("") + '</ul>').join("");
    return bloc("cat-" + cle, "soin", echapper(u.nom), "", compte(items.length, "produit"), "", contenu);
  }).join("");

  // ——— Ingrédients & routines ———
  const motCle = (nom) => nom.toLowerCase().replace(" vera", "");
  $("#ingredientsGrid").innerHTML = INGREDIENTS.map((ing) => {
    const n = PRODUITS.filter((p) => (p.actifs + " " + p.nom).toLowerCase().includes(motCle(ing.nom))).length;
    return '<button class="ingredient" data-q="' + echapper(motCle(ing.nom)) + '"><h3>' + echapper(ing.nom) + '</h3>' +
      '<p>' + echapper(ing.texte) + '</p><span class="more">' + n + ' soins →</span></button>';
  }).join("");
  $("#ingredientsGrid").addEventListener("click", (e) => {
    const b = e.target.closest(".ingredient");
    if (!b) return;
    const ing = INGREDIENTS.find((x) => motCle(x.nom) === b.dataset.q);
    const items = PRODUITS.filter((p) => (p.actifs + " " + p.nom).toLowerCase().includes(b.dataset.q));
    montrer('<span class="card-cat">Ingrédient phare</span><h3 id="modalTitle">' + echapper(ing.nom) + '</h3><p class="modal-text">' + echapper(ing.texte) + '</p>' +
      '<ul class="p-list p-list-one">' + items.map(ligneSoin).join("").replace(/ id="soin-\d+"/g, "") + '</ul>');
  });

  const etape = (ref, label) => {
    const p = PRODUITS[parRef[ref]];
    return '<li><button class="step" data-i="' + parRef[ref] + '">' + (label ? '<em>' + label + '</em>' : '') +
      '<span class="step-name">' + echapper(p.nom) + '</span><span class="step-ref">' + ref + '</span></button></li>';
  };
  $("#routinesGrid").innerHTML = ROUTINES.map((r) =>
    '<article class="routine"><h3>' + echapper(r.nom) + '</h3><ol>' + r.etapes.map((ref) => etape(ref)).join("") + '</ol>' +
    '<ul class="routine-mask">' + etape(r.masque, "Masque, 2 fois par semaine") + '</ul></article>'
  ).join("");

  // ——— Fiches produit ———
  const modal = $("#modal");
  const ligne = (label, val, fort) => val ? '<dt>' + label + '</dt><dd' + (fort ? ' class="strong"' : '') + '>' + echapper(val) + '</dd>' : '';
  function montrer(html) { $("#modalBody").innerHTML = html; modal.hidden = false; document.body.style.overflow = "hidden"; }

  function ouvrirSoin(i) {
    const p = PRODUITS[i], u = UNIVERS[p.univers];
    montrer('<div class="modal-visual' + (p.image ? ' has-photo' : '') + '" style="--tint:' + u.teinte + '">' + photo(p, u.forme, u.teinte) + '</div>' +
      '<span class="card-cat">' + echapper(u.nom) + ' · ' + echapper(p.rubrique) + '</span><h3 id="modalTitle">' + echapper(p.nom) + '</h3>' +
      '<div class="modal-tags">' + labels(p) + '</div><dl>' +
      (p.famille ? ligne("Famille", p.famille) + ligne("Pièce conseillée", p.piece) : ligne(p.univers === "maison" ? "Description" : "Actifs", p.actifs)) +
      (p.notes ? ligne("Tête", p.notes.tete) + ligne("Cœur", p.notes.coeur) + ligne("Fond", p.notes.fond) : '') +
      ligne("Inspiration", p.inspiration) + ligne("Format", p.format) + (AFFICHER_PRIX ? ligne("Prix indicatif", euros(p.prix), true) : '') + '</dl>' +
      '<div class="add-row"><button class="btn btn-plum btn-add" data-add="s:' + i + ':' + echapper(p.format) + '">Ajouter au panier</button>' +
      '<a href="#contact" class="btn btn-line btn-add modal-cta">Demander un conseil</a></div>' +
      (p.sansRef ? '' : '<p class="modal-ref">Référence ' + echapper(p.ref) + (p.echantillon ? ' · échantillon : ' + echapper(p.echantillon) : '') + '</p>'));
  }

  function ouvrirParfum(i) {
    const p = PARFUMS[i], g = GAMMES[p.gamme], t = TEINTES_GENRE[p.genre];
    const formats = ligne(p.grand, AFFICHER_PRIX ? euros(p.prixGrand) + (p.gamme === "classique" ? " (hors frais de port)" : "") : "Disponible", true) +
      (p.ref15 ? ligne("15 ml", AFFICHER_PRIX ? euros(p.prix15) : "Disponible", true) : "");
    montrer('<div class="modal-visual' + (p.image ? ' has-photo' : '') + '" style="--tint:' + t + '">' + photo(p, "flacon", t) + '</div>' +
      '<span class="card-cat g-' + p.genre + '">' + echapper(p.genre) + ' · ' + echapper(g.nom) + '</span>' +
      '<h3 id="modalTitle">' + echapper(p.nom) + '</h3><dl>' + ligne("Famille", p.famille) + ligne("Inspiration", p.inspiration) + formats + '</dl>' +
      '<div class="add-row"><button class="btn btn-plum btn-add" data-add="p:' + i + ':' + p.grand + '">Ajouter ' + p.grand + '</button>' +
      (p.ref15 ? '<button class="btn btn-line btn-add" data-add="p:' + i + ':15 ml">Ajouter 15 ml</button>' : '') + '</div>' +
      '<p class="modal-ref">Référence ' + echapper(p.ref) + (p.ref15 ? ' · 15 ml : ' + echapper(p.ref15) : '') + '</p>');
  }

  function fermer() { modal.hidden = true; document.body.style.overflow = ""; }
  document.addEventListener("click", (e) => {
    if (modal.contains(e.target) || e.target.closest(".drawer, .search-panel")) return;
    const s = e.target.closest(".step, .best[data-i], .p-item[data-i]");
    if (s) return ouvrirSoin(+s.dataset.i);
    const p = e.target.closest(".best[data-p], .p-item[data-p]");
    if (p) ouvrirParfum(+p.dataset.p);
  });
  modal.addEventListener("click", (e) => {
    const s = e.target.closest(".p-item[data-i]");
    if (s) return ouvrirSoin(+s.dataset.i);
    const b = e.target.closest("[data-add]");
    if (b) ajouter(b.dataset.add);
    if (b || e.target === modal || e.target.closest(".modal-close") || e.target.closest(".modal-cta")) fermer();
  });

  // ——— Recherche directe (icône loupe) : nom ou inspiration ———
  const INDEX = PARFUMS.map((p, i) => ({ type: "p", i, nom: p.nom, meta: "Parfum " + p.genre.toLowerCase() + " · " + GAMMES[p.gamme].nom, inspiration: p.inspiration, ref: p.ref + " " + (p.ref15 || "") }))
    .concat(PRODUITS.map((p, i) => ({ type: "s", i, nom: p.nom, meta: UNIVERS[p.univers].nom + " · " + p.rubrique, inspiration: p.inspiration, ref: p.ref })));
  INDEX.forEach((x) => { x.cleNom = sansAccent(x.nom); x.cleInsp = sansAccent(x.inspiration || ""); x.cleRef = sansAccent(x.ref); });
  const finder = $("#finder"), fList = $("#finderList"), panel = $("#searchPanel"), searchBtn = $("#searchBtn");
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
    if (finder.value.trim().length < 2) { fList.hidden = true; return; }
    fList.innerHTML = resultats.length ? resultats.map((x, k) =>
      '<li role="option" data-k="' + k + '" aria-selected="' + (k === 0) + '"><span class="f-name">' + echapper(x.nom) + '</span>' +
      '<span class="f-meta">' + echapper(x.meta) + (x.inspiration ? ' · inspiration <b>' + echapper(x.inspiration) + '</b>' : '') + '</span></li>'
    ).join("") : '<li class="finder-empty">Aucun produit trouvé. Essayez un autre nom ou une autre inspiration.</li>';
    fList.hidden = false;
  }
  function ouvrirRecherche() { panel.hidden = false; searchBtn.setAttribute("aria-expanded", "true"); finder.focus(); }
  function fermerRecherche() { panel.hidden = true; fList.hidden = true; finder.value = ""; searchBtn.setAttribute("aria-expanded", "false"); }
  searchBtn.addEventListener("click", () => (panel.hidden ? ouvrirRecherche() : fermerRecherche()));

  function allerA(x) {
    fermerRecherche();
    onglet(x.type === "p" ? "parfums" : "soins");
    const el = document.getElementById((x.type === "p" ? "parfum-" : "soin-") + x.i);
    el.closest("details").open = true;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("flash");
    setTimeout(() => el.classList.remove("flash"), 3300);
    setTimeout(() => (x.type === "p" ? ouvrirParfum : ouvrirSoin)(x.i), 650);
  }
  finder.addEventListener("input", montrerResultats);
  finder.addEventListener("keydown", (e) => {
    if (e.key === "Escape") return fermerRecherche();
    if (fList.hidden || !resultats.length) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      choisi = (choisi + (e.key === "ArrowDown" ? 1 : resultats.length - 1)) % resultats.length;
      fList.querySelectorAll("li").forEach((li, k) => li.setAttribute("aria-selected", k === choisi));
    } else if (e.key === "Enter") { e.preventDefault(); allerA(resultats[choisi]); }
  });
  fList.addEventListener("mousedown", (e) => { const li = e.target.closest("li[data-k]"); if (li) { e.preventDefault(); allerA(resultats[+li.dataset.k]); } });
  document.addEventListener("click", (e) => { if (!panel.hidden && !e.target.closest(".search-panel, #searchBtn")) fermerRecherche(); });

  // ——— Panier (simulation, aucun achat) ———
  const CLE = "aw-panier";
  let panier = [];
  try { panier = JSON.parse(localStorage.getItem(CLE)) || []; } catch (e) { panier = []; }
  panier = panier.filter((x) => (x.type === "p" ? PARFUMS[x.i] : PRODUITS[x.i]));
  const sauver = () => { try { localStorage.setItem(CLE, JSON.stringify(panier)); } catch (e) { /* stockage indisponible : le panier reste en mémoire */ } };

  function detail(it) {
    if (it.type === "p") {
      const p = PARFUMS[it.i], est15 = it.format === "15 ml";
      return { nom: p.nom, ref: est15 ? p.ref15 : p.ref, prix: est15 ? p.prix15 : p.prixGrand };
    }
    const p = PRODUITS[it.i];
    return { nom: p.nom, ref: p.sansRef ? "" : p.ref.split(" ")[0], prix: p.prix };
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
    $("#cartCount").hidden = n === 0;
    let total = 0, surDemande = false;
    $("#cartList").innerHTML = panier.length ? panier.map((it, k) => {
      const d = detail(it);
      if (d.prix == null) surDemande = true; else total += d.prix * it.qte;
      return '<li class="cart-item"><span class="ci-name">' + echapper(d.nom) + '</span>' +
        '<span class="ci-price">' + (d.prix == null ? "Sur demande" : euros(arrondi(d.prix * it.qte))) + '</span>' +
        '<span class="ci-meta">' + echapper(it.format) + (d.ref ? ' · réf. ' + echapper(d.ref) : '') + '</span>' +
        '<span class="ci-qty"><button data-q="' + k + ':-1" aria-label="Retirer un">−</button><span>' + it.qte + '</span><button data-q="' + k + ':1" aria-label="Ajouter un">+</button></span></li>';
    }).join("") : '<li class="cart-empty">Votre panier est vide.<br />Ouvrez la fiche d\'un produit pour l\'ajouter.</li>';
    if (!panier.length) { $("#cartFoot").innerHTML = ""; return; }
    total = arrondi(total);
    const lignes = panier.map((it) => { const d = detail(it); return "- " + d.nom + " (" + it.format + (d.ref ? ", réf. " + d.ref : "") + ") x" + it.qte; });
    const corps = "Bonjour,\n\nVoici ma sélection :\n" + lignes.join("\n") + "\n\nTotal estimé : " + euros(total) + (surDemande ? " (+ articles sur demande)" : "") + "\n\nMerci !";
    $("#cartFoot").innerHTML = '<div class="total"><span>Total estimé</span><strong>' + euros(total) + '</strong></div>' +
      '<p class="foot-note">Hors frais de port' + (surDemande ? ", hors articles dont le prix est sur demande" : "") + '. Ce total est une estimation : aucun paiement n\'est possible ici.</p>' +
      '<a class="btn btn-plum" href="mailto:simaowilly@gmail.com,Arthur.brp09@gmail.com?subject=' + encodeURIComponent("Ma sélection AW Parfumerie") + '&body=' + encodeURIComponent(corps) + '">Envoyer ma sélection par e-mail</a>' +
      '<button class="link-btn" id="cartClear">Vider le panier</button>';
  }
  const drawer = $("#drawer"), drawerBg = $("#drawerBg");
  function ouvrirPanier() { fermerRecherche(); drawer.hidden = drawerBg.hidden = false; document.body.style.overflow = "hidden"; $("#drawerClose").focus(); }
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

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!modal.hidden) fermer();
    else if (!drawer.hidden) fermerPanier();
    else if (!panel.hidden) fermerRecherche();
  });

  // ——— Menu mobile ———
  const toggle = $(".menu-toggle");
  toggle.addEventListener("click", () => { const o = document.body.classList.toggle("nav-open"); toggle.setAttribute("aria-expanded", o); });
  document.querySelectorAll(".nav a").forEach((a) => a.addEventListener("click", () => document.body.classList.remove("nav-open")));

  dessinerPanier();
})();
