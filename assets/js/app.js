(function () {
  const $ = (sel) => document.querySelector(sel);

  // Petite illustration SVG selon le type de produit (pas d'images externes).
  function visuel(forme, teinte) {
    const formes = {
      bottle:   '<rect x="38" y="14" width="24" height="12" rx="2" fill="#c9a45c"/><rect x="44" y="24" width="12" height="8" fill="#a8873f"/><rect x="24" y="32" width="52" height="58" rx="10" fill="TEINTE"/><rect x="32" y="40" width="10" height="40" rx="5" fill="#fff" opacity=".35"/>',
      diffuser: '<line x1="44" y1="44" x2="32" y2="6" stroke="#6b5530" stroke-width="2"/><line x1="50" y1="44" x2="50" y2="4" stroke="#6b5530" stroke-width="2"/><line x1="56" y1="44" x2="68" y2="6" stroke="#6b5530" stroke-width="2"/><rect x="40" y="40" width="20" height="10" fill="#c9a45c"/><path d="M28 50h44l4 40H24z" fill="TEINTE"/>',
      jar:      '<rect x="22" y="34" width="56" height="14" rx="3" fill="#c9a45c"/><rect x="24" y="48" width="52" height="40" rx="8" fill="TEINTE"/><rect x="32" y="56" width="36" height="16" rx="3" fill="#fff" opacity=".4"/>',
      tube:     '<path d="M34 14h32l-4 66H38z" fill="TEINTE"/><rect x="38" y="80" width="24" height="12" rx="3" fill="#c9a45c"/><rect x="34" y="12" width="32" height="5" fill="#a8873f"/>',
      pump:     '<rect x="46" y="8" width="20" height="6" rx="2" fill="#c9a45c"/><rect x="46" y="10" width="6" height="22" fill="#c9a45c"/><rect x="40" y="30" width="20" height="10" fill="#a8873f"/><rect x="30" y="40" width="40" height="52" rx="8" fill="TEINTE"/>',
      lipstick: '<path d="M42 14l16 8v26H42z" fill="TEINTE"/><rect x="38" y="46" width="24" height="12" fill="#c9a45c"/><rect x="36" y="58" width="28" height="34" rx="3" fill="#1a1a1a"/>',
      gem:      '<path d="M30 34l10-14h20l10 14-20 40z" fill="TEINTE"/><path d="M30 34h40M40 20l10 54 10-54" stroke="#fff" stroke-opacity=".5" fill="none"/>'
    };
    return '<svg viewBox="0 0 100 100" aria-hidden="true">' + (formes[forme] || formes.bottle).replace(/TEINTE/g, teinte) + '</svg>';
  }

  const echapper = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // Univers
  $("#universeGrid").innerHTML = Object.entries(CATEGORIES).map(([cle, c]) => {
    const n = PRODUITS.filter((p) => p.categorie === cle).length;
    return '<a class="universe" href="#catalogue" data-cat="' + cle + '">' +
      '<div class="universe-visual" style="--tint:' + c.teinte + '">' + visuel(c.forme, c.teinte) + '</div>' +
      '<h3>' + echapper(c.nom) + '</h3><p>' + echapper(c.texte) + '</p>' +
      '<span class="universe-count">' + n + ' produit' + (n > 1 ? 's' : '') + ' →</span></a>';
  }).join("");

  // Familles olfactives
  $("#families").innerHTML = FAMILLES.map((f) =>
    '<button class="family" data-famille="' + echapper(f.nom) + '"><span class="family-genre">' + f.genre + '</span>' +
    '<h3>' + echapper(f.nom) + '</h3><p>' + echapper(f.notes) + '</p></button>'
  ).join("");

  // Catalogue
  let categorieActive = "tout";
  const chips = [["tout", "Tout"]].concat(Object.entries(CATEGORIES).map(([k, c]) => [k, c.nom]));
  $("#chips").innerHTML = chips.map(([k, nom]) =>
    '<button class="chip" role="tab" data-cat="' + k + '">' + echapper(nom) + '</button>'
  ).join("");

  function afficher() {
    const q = $("#search").value.trim().toLowerCase();
    const liste = PRODUITS.filter((p) => {
      if (categorieActive !== "tout" && p.categorie !== categorieActive) return false;
      if (!q) return true;
      return [p.nom, p.ref, p.genre, p.famille, p.notes, p.description, CATEGORIES[p.categorie].nom]
        .filter(Boolean).join(" ").toLowerCase().includes(q);
    });
    document.querySelectorAll(".chip").forEach((b) => b.classList.toggle("active", b.dataset.cat === categorieActive));
    $("#count").textContent = liste.length + " produit" + (liste.length > 1 ? "s" : "");
    $("#productGrid").innerHTML = liste.length ? liste.map((p) => {
      const c = CATEGORIES[p.categorie];
      return '<article class="card" tabindex="0" data-i="' + PRODUITS.indexOf(p) + '">' +
        '<div class="card-visual" style="--tint:' + c.teinte + '">' + visuel(c.forme, c.teinte) +
        (p.ref ? '<span class="card-ref">N°' + echapper(p.ref) + '</span>' : '') + '</div>' +
        '<div class="card-body"><span class="card-cat">' + echapper(c.nom) + '</span>' +
        '<h3>' + echapper(p.nom) + '</h3>' +
        (p.famille ? '<p class="card-fam">' + echapper(p.famille) + '</p>' : '') +
        '<p>' + echapper(p.description) + '</p></div></article>';
    }).join("") : '<p class="empty">Aucun produit ne correspond à votre recherche.</p>';
  }

  $("#chips").addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    categorieActive = b.dataset.cat;
    afficher();
  });
  $("#search").addEventListener("input", afficher);

  $("#universeGrid").addEventListener("click", (e) => {
    const a = e.target.closest(".universe");
    if (!a) return;
    categorieActive = a.dataset.cat;
    $("#search").value = "";
    afficher();
  });

  $("#families").addEventListener("click", (e) => {
    const b = e.target.closest(".family");
    if (!b) return;
    categorieActive = "tout";
    $("#search").value = b.dataset.famille.split(" ")[0];
    afficher();
    $("#catalogue").scrollIntoView({ behavior: "smooth" });
  });

  // Fiche produit (fenêtre)
  const modal = $("#modal");
  function ouvrir(i) {
    const p = PRODUITS[i], c = CATEGORIES[p.categorie];
    const ligne = (label, val) => val ? '<dt>' + label + '</dt><dd>' + echapper(val) + '</dd>' : '';
    $("#modalBody").innerHTML =
      '<div class="modal-visual" style="--tint:' + c.teinte + '">' + visuel(c.forme, c.teinte) + '</div>' +
      '<span class="card-cat">' + echapper(c.nom) + '</span><h3 id="modalTitle">' + echapper(p.nom) + '</h3>' +
      '<p>' + echapper(p.description) + '</p><dl>' +
      ligne("Référence", p.ref && "N°" + p.ref) + ligne("Genre", p.genre) + ligne("Famille", p.famille) +
      ligne("Notes", p.notes) + ligne("Formats", (p.formats || []).join(" · ")) + '</dl>' +
      '<a href="#contact" class="btn btn-gold modal-cta">Demander un conseil</a>';
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function fermer() { modal.hidden = true; document.body.style.overflow = ""; }
  $("#productGrid").addEventListener("click", (e) => { const c = e.target.closest(".card"); if (c) ouvrir(+c.dataset.i); });
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

  afficher();
})();
