/*
 * Données de la vitrine AW Parfumerie — source : « AW Catalogue – Tous les produits ».
 *
 * Ajouter un produit : copiez une ligne p(...) et modifiez-la.
 *   p(référence, nom, actifs / bénéfices, format, prix (nombre ou null), univers, rubrique, labels)
 *   labels : "B" = Bio, "V" = Vegan, "BV" = les deux, "" = aucun
 *
 * AFFICHER_PRIX : mettez false pour masquer tous les prix du site.
 */

const AFFICHER_PRIX = true;

const UNIVERS = {
  brumes:  { nom: "Brumes corps",   forme: "spray",  teinte: "#e7b48f", texte: "Sprays corps parfumés au complexe PUREYOUTH™ : hydratent, exfolient en douceur et parfument." },
  maison:  { nom: "Maison",              forme: "spray",  teinte: "#c8b39a", texte: "Diffuseurs à bâtons en bois et sprays d'ambiance pour parfumer chaque pièce." },
  corps:   { nom: "Corps & hygiène",     forme: "pump",   teinte: "#c9b6d9", texte: "Gels douche, crèmes, silhouette, déodorants, mains & pieds, savons, hygiène intime et dentaire." },
  visage:  { nom: "Visage",              forme: "jar",    teinte: "#e6cfa8", texte: "Crèmes, sérums, contours des yeux, nettoyants, toniques et masques." },
  rasage:  { nom: "Rasage",              forme: "tube",   teinte: "#8aa2b8", texte: "Crème à raser et soins après-rasage." },
  cheveux: { nom: "Cheveux",             forme: "pump",   teinte: "#a7c4c2", texte: "Shampoings, masques, après-shampoings, brumes parfumées et soins anti-chute." },
  solaire: { nom: "Soins solaires",      forme: "spray",  teinte: "#f0c75e", texte: "Protections SPF, après-soleil, huiles bronzantes et sprays capillaires." },
  remedes: { nom: "Pommades & remèdes",  forme: "tube",   teinte: "#9cb380", texte: "Gels apaisants, baumes et pommades pour les petits maux du quotidien." },
  animaux: { nom: "Animaux",             forme: "spray",  teinte: "#d1b46a", texte: "Shampoing, répulsif, nettoyant et parfums pour chiens et chats." }
};

const INGREDIENTS = [
  { nom: "Bave d'escargot",    texte: "Hydratante, régénérante, apaisante et anti-âge ; aide contre les cicatrices, taches et rides." },
  { nom: "Lait d'ânesse",      texte: "Nourrit, apaise, améliore l'élasticité ; idéal pour peaux à dermatite, psoriasis ou eczéma. Antioxydant." },
  { nom: "Neem",               texte: "Purifie et protège des bactéries ; séborégulateur, idéal pour peaux et cheveux gras ou pelliculaires." },
  { nom: "Acide hyaluronique", texte: "Hydrate en profondeur, réduit les rides, améliore l'élasticité." },
  { nom: "Acide salicylique",  texte: "Purifie les pores, combat acné et imperfections, exfolie en douceur." },
  { nom: "Aloe vera",          texte: "Apaise et hydrate, calme rougeurs et irritations." },
  { nom: "Argan",              texte: "Nourrissante, réparatrice, antioxydante ; brillance et élasticité." }
];

const ROUTINES = [
  { nom: "Purifiante",         etapes: ["CR12B", "CR11B", "CR26B", "NM06B"], masque: "AS01B" },
  { nom: "Anti-âge",           etapes: ["SB01B", "BV12B", "CR08B", "BV04B", "CR02B"], masque: "POM01B" },
  { nom: "Jeunesse éternelle", etapes: ["CR13B", "BA001", "CR14B", "CR22B", "CR03B"], masque: "BV03B" }
];

const PRODUITS = [];
function p(ref, nom, actifs, format, prix, univers, rubrique, labels) {
  PRODUITS.push({ ref, nom, actifs, format, prix, univers, rubrique, bio: labels.includes("B"), vegan: labels.includes("V") });
}

// ——— 1. Brumes corps ———
const BRUMES = [
  ["SBM001", "Brise tropicale", "Amande, pistache",          "Héliotrope, jasmin",       "Santal, caramel, vanille"],
  ["SBM002", "Aura du Pacifique", "Citron, passion, goyave",   "Jasmin, coco, pêche, rose", "Barbe à papa, framboise, musc, vanille"],
  ["SBM003", "Heure dorée", "Cassis, champagne, mandarine", "Tarte à la noix de coco, coco, notes solaires", "Chocolat noir, lait, vanille"],
  ["SBM004", "Rêve d'été", "Mangue, coco, pêche",       "Frangipanier",             "Santal, caramel, musc"],
  ["SBM005", "Coucher de soleil brésilien", "Bergamote, mandarine, orange", "Jasmin, coco, ylang-ylang", "Ambre, musc, vanille"]
];
BRUMES.forEach(([ref, nom, tete, coeur, fond]) => {
  p(ref, "Brume corps " + nom, "Complexe PUREYOUTH™ et glycérine · Hydrate, exfolie en douceur, antioxydant", "Spray", 19.90, "brumes", "Brumes corps", "");
  Object.assign(PRODUITS[PRODUITS.length - 1], { notes: { tete, coeur, fond } });
});

// ——— 2. Corps & hygiène ———
p("BS08",  "Gel douche Ambre & argan",        "Régénérant", "250 ml", 12.90, "corps", "Gels douche", "V");
p("BS10",  "Gel douche Agrumes & patchouli",  "Revitalisant", "250 ml", 12.90, "corps", "Gels douche", "V");
p("BS11",  "Gel douche Ambre & coriandre",    "Relaxant", "250 ml", 12.90, "corps", "Gels douche", "V");
p("BS09",  "Gel douche Myrrhe",               "Purifiant", "250 ml", 12.90, "corps", "Gels douche", "V");
p("BS12",  "Gel douche Vanille & gingembre",  "Tonifiant", "250 ml", 12.90, "corps", "Gels douche", "V");
p("BS13",  "Gel douche Café & poivre rose",   "Énergisant", "250 ml", 12.90, "corps", "Gels douche", "V");
p("AL02B", "Gel douche aloe vera",            "Aloe vera, glycérine, camomille, argan · Nourrissant", "250 ml", 12.90, "corps", "Gels douche", "B");
p("AL06B", "Gel douche aloe vera – format voyage", "Aloe vera", "50 ml", 3.90, "corps", "Gels douche", "B");
p("AV01B", "Gel douche avoine",               "Avoine & aloe vera · Hydratant", "250 ml", 17.90, "corps", "Gels douche", "B");
p("BS07B", "Gel douche camomille & calendula", "Camomille, calendula, mauve, karité, avoine · Hydratant et tonifiant", "250 ml", 12.90, "corps", "Gels douche", "B");
p("BV01B", "Gel douche bave d'escargot",      "Aloe, protéines de soie, pomme, bave d'escargot · Régénérant et soyeux", "250 ml", 13.90, "corps", "Gels douche", "B");
p("LA01B", "Gel douche lait d'ânesse",        "Karité, macadamia, vitamine E, aloe, lait d'ânesse · Nourrissant, peaux sensibles", "250 ml", 19.90, "corps", "Gels douche", "");
p("BS05B", "Gel douche effet froid",          "Aloe, marron d'Inde, menthol · Rafraîchissant et défatigant", "250 ml", 17.90, "corps", "Gels douche", "");
p("NM02B", "Gel douche neem",                 "Protéines de soie, aloe, huile de neem · Hydratant", "250 ml", 19.90, "corps", "Gels douche", "");
p("BB01B", "Gel douche moussant bébé",        "Avoine, alchémille, échinacée, aloe · Nettoie en douceur", "200 ml", 19.90, "corps", "Gels douche", "BV");
p("SP06B", "Nettoyant bébé",                  "Mauve, calendula, camomille, aloe · Hypoallergénique, ultra-doux", "260 ml", 21.90, "corps", "Gels douche", "BV");

p("CR17B", "Gel 98 % aloe vera",              "Avec hamamélis · Apaisant, cicatrisant, hydratant. Visage, imperfections, après-soleil, cheveux, gencives", "150 ml", 13.90, "corps", "Gel aloe vera", "BV");

p("BB03B", "Lait corporel bébé",              "Calendula, avoine, karité, aloe · Peaux délicates et irritées", "150 ml", 22.90, "corps", "Laits, brumes & crèmes corps", "B");
p("AP04B", "Brume corporelle Noix de coco",   "Avec aloe vera", "100 ml", 12.90, "corps", "Laits, brumes & crèmes corps", "BV");
p("AP07B", "Brume corporelle Parfum 7",    "Avec aloe vera", "100 ml", 14.90, "corps", "Laits, brumes & crèmes corps", "");
p("CR30B", "Crème corps Noix de coco",        "Jojoba, vitamine E, protéines de soie, argan", "150 ml", 23.90, "corps", "Laits, brumes & crèmes corps", "");
p("CR34B", "Crème corps hydratante",          "Vitamine E, argan, amande douce, jojoba, aloe", "150 ml", 14.90, "corps", "Laits, brumes & crèmes corps", "");
p("CR24B", "Crème corps nourrissante",        "Jojoba, karité, vitamine E, camomille, argan · Nourrissante et émolliente", "150 ml", 25.90, "corps", "Laits, brumes & crèmes corps", "");
p("AL09B", "Crème corps aloe – format voyage", "Aloe vera", "30 ml", 5.90, "corps", "Laits, brumes & crèmes corps", "BV");
p("NM03B", "Crème corps neem",                "Aloe, jojoba, neem · Raffermissante, tonifiante, cicatrisante", "150 ml", 24.90, "corps", "Laits, brumes & crèmes corps", "");
p("AR01B", "Crème corps argan & bave d'escargot", "Argan, amande, jojoba, bave d'escargot · Hydratante et adoucissante", "150 ml", 19.90, "corps", "Laits, brumes & crèmes corps", "");
p("LA02B", "Lait corps lait d'ânesse",        "Jojoba, vitamine E, karité, aloe, calendula, lait d'ânesse · Peaux sèches et sensibles", "260 ml", 49.90, "corps", "Laits, brumes & crèmes corps", "");

p("CR20B", "Crème thermogène « chaud fort »", "Capsicum, cannelle, centella asiatica, camphre, marronnier d'Inde", "150 ml", 21.90, "corps", "Silhouette", "");
p("CR06B", "Crème thermogène « chaud soft »", "Capsicum, marronnier d'Inde, HE de cannelle, camphre et cyprès", "150 ml", 17.90, "corps", "Silhouette", "");
p("CR01B", "Crème anti-cellulite",            "Centella, marron d'Inde, lierre, prêle, bouleau, argan · Combat la rétention d'eau", "150 ml", 16.90, "corps", "Silhouette", "");
p("CR39B", "Crème raffermissante effet froid", "Lierre, concombre, caféine, menthol", "150 ml", 13.90, "corps", "Silhouette", "");

p("BV11B",   "Déo crème bave d'escargot",     "Vitamine E, romarin, bave d'escargot · Naturel, hypoallergénique, sans alcool", "50 ml", 10.90, "corps", "Déodorants", "");
p("DEOC01B", "Déo crème longue durée",        "Anti-transpirant", "50 ml", 16.90, "corps", "Déodorants", "");
p("DEOC02B", "Déo crème naturelle",           "Eucalyptus, glycérine, vitamine E · Sans sels d'aluminium", "50 ml", 10.00, "corps", "Déodorants", "");
p("DEOS04B", "Déodorant spray",               "Aloe, glycérine, citron · Efficacité 24 h", "60 ml", 13.90, "corps", "Déodorants", "V");

p("AR04B", "Crème pieds apaisante",           "Argan, vitamine E, sauge, calendula", "75 ml", 15.90, "corps", "Mains, pieds & ongles", "");
p("NM05B", "Crème pieds antifongique",        "Amande, aloe, neem", "75 ml", 13.90, "corps", "Mains, pieds & ongles", "");
p("BV06B", "Crème pieds réparatrice",         "Karité, avocat, olive, propolis, bave d'escargot", "75 ml", 11.90, "corps", "Mains, pieds & ongles", "");
p("CR19B", "Crème pieds rafraîchissante",     "Bouleau, calendula, romarin, menthol", "75 ml", 10.90, "corps", "Mains, pieds & ongles", "");
p("CR29B", "Crème pieds apaisante karité",    "Karité, avocat, aloe, argan", "75 ml", null, "corps", "Mains, pieds & ongles", "");
p("PS01B", "Déodorant spray pieds",           "Sauge, romarin, aloe · Anti-transpirant 24 h", "150 ml", 15.90, "corps", "Mains, pieds & ongles", "");
p("GI42B", "Crème-gel mains hydroalcoolique", "Action rapide · Parfum 42", "90 ml", 10.00, "corps", "Mains, pieds & ongles", "");
p("OLCB",  "Huile cuticules & ongles",        "6 huiles précieuses · Renforce les ongles", "8 ml", 11.90, "corps", "Mains, pieds & ongles", "");
p("AR05B", "Crème mains bio",                 "Amande douce, protéines de soie, glycérine, camomille, argan · Nourrissante", "75 ml", 16.90, "corps", "Mains, pieds & ongles", "B");
p("CR32B", "Crème mains bave d'escargot",     "Karité, amande douce, argan, bave d'escargot · Nourrissante", "75 ml", 17.90, "corps", "Mains, pieds & ongles", "");
p("CR31B", "Crème mains hydratante",          "Camomille, vitamine E, karité, calendula", "75 ml", 12.90, "corps", "Mains, pieds & ongles", "");
p("NM04B", "Crème mains & ongles",            "Amande douce, karité, camomille, neem · Protectrice et réparatrice", "75 ml", 14.90, "corps", "Mains, pieds & ongles", "");
p("CR15B", "Crème mains nourrissante",        "Amande, olive, karité, aloe · Protectrice", "75 ml", 9.90, "corps", "Mains, pieds & ongles", "");
p("CR28B", "Crème mains apaisante",           "Karité, pépins de raisin, protéines de soie, camomille", "75 ml", 12.90, "corps", "Mains, pieds & ongles", "");

p("SP08B", "Crème de savon Thé vert",         "Vitamine E, panthénol, aloe, camomille", "260 ml", 3.99, "corps", "Savons & recharges", "BV");
p("SP02B", "Crème de savon Pomme verte",      "Vitamine E, panthénol, aloe, camomille", "260 ml", 3.99, "corps", "Savons & recharges", "BV");
p("SP07B", "Crème de savon Grenade",          "Vitamine E, panthénol, aloe, camomille", "260 ml", 3.99, "corps", "Savons & recharges", "BV");
p("SP05B", "Crème de savon Pêche",            "Vitamine E, panthénol, aloe, camomille", "260 ml", 3.99, "corps", "Savons & recharges", "BV");
p("AR08B", "Savon liquide argan",             "Amande douce, argan, aloe, vitamine E · Hydratant, régénérant", "260 ml", 3.99, "corps", "Savons & recharges", "");
p("BV07B", "Savon liquide bave d'escargot",   "Aloe, propolis, bave d'escargot · Apaisant", "260 ml", 3.99, "corps", "Savons & recharges", "");
p("NM07B", "Savon liquide neem",              "Amande, vitamine E, aloe, neem · Antibactérien", "260 ml", 3.99, "corps", "Savons & recharges", "");
p("RSAR08B · RSNM07B · RSP02B · RSP05B · RSP07B · RSP08B", "Recharges crème de savon", "Argan, neem, pomme verte, pêche, grenade, thé vert", "1000 ml", 6.99, "corps", "Savons & recharges", "");

p("NM08B", "Nettoyant intime neem",           "Camomille, neem · Contre les mauvaises odeurs", "260 ml", 7.99, "corps", "Hygiène intime", "");
p("SP09B", "Nettoyant intime apaisant",       "Mauve, calendula, camomille, aloe", "260 ml", 7.99, "corps", "Hygiène intime", "B");
p("AL07B", "Nettoyant intime – format voyage", "Mauve, camomille, aloe · Prévient les irritations", "50 ml", null, "corps", "Hygiène intime", "B");
p("AR09B", "Nettoyant intime émollient",      "Mauve, calendula, amande douce, argan", "260 ml", 7.99, "corps", "Hygiène intime", "");
p("BV08B", "Nettoyant intime rééquilibrant",  "Aloe, propolis, mauve, calendula, bave d'escargot · Antifongique", "260 ml", 7.99, "corps", "Hygiène intime", "");
p("SP03B", "Nettoyant intime lavandin",       "Lavandin, mauve, camomille · Ultra-doux", "260 ml", null, "corps", "Hygiène intime", "B");
p("SP04B", "Nettoyant intime fraîcheur",      "Sauge, aloe, menthol · Ultra-doux", "260 ml", 7.99, "corps", "Hygiène intime", "B");
p("LA06B", "Nettoyant intime lait d'ânesse",  "Sauge, mauve, romarin, karité, panthénol, lait d'ânesse · Soulage l'inconfort", "260 ml", 9.99, "corps", "Hygiène intime", "");

p("BLK02B", "Dentifrice charbon actif",       "HE d'eucalyptus, charbon actif · Blanchissant", "75 ml", 12.90, "corps", "Hygiène bucco-dentaire", "V");
p("BLK01B", "Soin blanchissant charbon",      "Blanchit et reminéralise, prévient le tartre", "115 g", 16.90, "corps", "Hygiène bucco-dentaire", "");
p("CR33B",  "Dentifrice blanchissant",        "Propolis, xylitol, aloe · Anti-plaque", "115 g", 15.90, "corps", "Hygiène bucco-dentaire", "");
p("AL04B",  "Dentifrice dents sensibles",           "Calendula, camomille, aloe · Gencives hypersensibles", "80 ml", null, "corps", "Hygiène bucco-dentaire", "");
p("AL03B",  "Bain de bouche",                 "Tea tree, mauve, calendula, eucalyptus, aloe · Protège dents et gencives", "250 ml", null, "corps", "Hygiène bucco-dentaire", "");
p("CR38B",  "Dentifrice",                     "Formule vegan", "115 g", 17.90, "corps", "Hygiène bucco-dentaire", "V");
p("AL08B",  "Dentifrice – format voyage",     "Aloe vera", "30 g", 5.90, "corps", "Hygiène bucco-dentaire", "");

// ——— 3. Visage ———
p("LV01B", "Base de teint lissante",          "Squalane végétal, rose musquée · Unifie et illumine", "15 ml", 39.90, "visage", "Crèmes visage", "");
p("CR03B", "Crème visage hydratante",         "Argan, panthénol, soie, vitamine E, jojoba, aloe · Rééquilibrante", "50 ml", 34.90, "visage", "Crèmes visage", "");
p("NM06B", "Crème visage purifiante",         "Aloe, acide hyaluronique, amande douce, bardane, neem · Anti-âge, illuminatrice", "50 ml", 34.90, "visage", "Crèmes visage", "");
p("AR10B", "Crème visage repulpante",         "Karité, pépins de raisin, argan, vitamine E, collagène, acide hyaluronique · Raffermissante", "50 ml", 39.90, "visage", "Crèmes visage", "");
p("CR05B", "Crème visage anti-âge intensive", "Vitamine E, acide hyaluronique, jojoba, argan · Réparatrice", "50 ml", 26.90, "visage", "Crèmes visage", "");
p("CR02B", "Crème visage anti-âge",           "Acide hyaluronique, acmella oleracea, argan, vitamine E, bave d'escargot", "50 ml", 39.90, "visage", "Crèmes visage", "");
p("LA04B", "Crème de jour lait d'ânesse",     "Pomme, concombre, vitamine E, acide hyaluronique · Antioxydante", "50 ml", 49.90, "visage", "Crèmes visage", "");
p("LA05B", "Crème de nuit lait d'ânesse",     "Amande douce, soie, acide hyaluronique, Actifcol · Anti-âge, peaux matures", "50 ml", 59.90, "visage", "Crèmes visage", "");

p("CR08B",  "Sérum gel tenseur",              "Acmella, centella, kigelia, collagène, acide hyaluronique · Anti-âge", "50 ml", 39.90, "visage", "Sérums, gels & contour des yeux", "");
p("CR22B",  "Crème contour des yeux",         "Échinacée, soie, argan, aloe · Effet tenseur et apaisant", "15 ml", 26.90, "visage", "Sérums, gels & contour des yeux", "");
p("BV04B",  "Contour des yeux illuminateur",  "Acide hyaluronique, raisin, cacao, rose musquée, bave d'escargot · Réduit cernes et poches", "15 ml", 29.90, "visage", "Sérums, gels & contour des yeux", "");
p("GEL01B", "Gel visage purifiant",           "Bardane, aloe, acide salicylique · Exfoliant, peaux à tendance acnéique", "100 ml", null, "visage", "Sérums, gels & contour des yeux", "");

p("BA001", "Gel nettoyant visage ultra-doux", "Aloe, mauve, camomille, huile de baobab", "260 ml", 24.90, "visage", "Nettoyants & toniques", "V");
p("BV12B", "Gel nettoyant purifiant",         "Avoine, camomille, aloe, bave d'escargot", "260 ml", 24.90, "visage", "Nettoyants & toniques", "");
p("CR09B", "Gel gommant visage",              "Avoine, camomille, mauve, calendula · Exfoliant", "50 ml", 21.90, "visage", "Nettoyants & toniques", "");
p("CR12B", "Eau micellaire 3 en 1",           "Glycérine, concombre · Visage, yeux, lèvres", "250 ml", 14.90, "visage", "Nettoyants & toniques", "");
p("SB01B", "Démaquillant biphasé",            "Enlève le maquillage waterproof · Yeux sensibles", "200 ml", 24.90, "visage", "Nettoyants & toniques", "");
p("CR11B", "Nettoyant dermo-purifiant",       "Vitamine E, ortie, sauge, acide salicylique · Peaux acnéiques", "260 ml", 19.90, "visage", "Nettoyants & toniques", "");
p("CR13B", "Lait nettoyant visage",           "Camomille, mauve, hamamélis, aloe, calendula · Tous types de peaux", "150 ml", 15.50, "visage", "Nettoyants & toniques", "");
p("CR14B", "Lotion tonique douce",            "Camomille, mauve, avoine, calendula · Peaux sensibles", "150 ml", 15.50, "visage", "Nettoyants & toniques", "");
p("CR26B", "Lotion tonique purifiante",       "Bardane, sauge, ortie · Peaux impures", "150 ml", 18.00, "visage", "Nettoyants & toniques", "");

p("AR07B",  "Masque anti-âge",                "Jojoba, pépins de raisin, karité, argan", "30 ml", 19.90, "visage", "Masques visage", "");
p("POM01B", "Masque pelable peaux matures",  "Protéines de soie, avoine, acide hyaluronique", "75 ml", 21.90, "visage", "Masques visage", "");
p("NM09B",  "Masque dermopurifiant",          "Argile verte, ortie, neem · Combat les imperfections", "50 ml", null, "visage", "Masques visage", "");
p("AS01B",  "Masque purifiant",               "Sauge, citron, hamamélis, acide salicylique", "30 ml", 14.90, "visage", "Masques visage", "");
p("AL11B",  "Masque pelable peaux mixtes",   "Réglisse, enantia chlorantha, romarin, aloe", "75 ml", 18.90, "visage", "Masques visage", "");
p("BV03B",  "Masque régénérant illuminateur", "Jojoba, raisin, vitamines C et E, réglisse, bave d'escargot", "50 ml", 13.90, "visage", "Masques visage", "");

// ——— 4. Rasage ———
p("CR10B",   "Crème à raser",       "Aloe, glycérine, menthol · Hydrate, rafraîchit, prévient les irritations", "260 ml", 15.90, "rasage", "Rasage", "");
p("CRU003B", "Crème après-rasage",            "Panthénol, menthol, aloe · Anti-âge", "75 ml", 15.90, "rasage", "Rasage", "");
p("CRU001B", "Crème après-rasage parfumée",   "Amande douce, aloe, hamamélis, panthénol · Parfum 1", "50 ml", 13.90, "rasage", "Rasage", "");

// ——— 5. Cheveux ———
p("AL01B", "Shampoing lavages fréquents",     "Passiflore, protéines de blé, panthénol, aloe · Extra-doux", "250 ml", 10.90, "cheveux", "Shampoings", "");
p("AL05B", "Shampoing lavages fréquents – voyage", "Passiflore, protéines de blé, panthénol, aloe", "50 ml", 3.90, "cheveux", "Shampoings", "");
p("AR02B", "Shampoing restructurant",         "Protéines de soie, aloe, argan · Hydratant", "250 ml", 16.90, "cheveux", "Shampoings", "");
p("AR14B", "Shampoing argan – voyage",        "Protéines de soie, aloe, argan", "50 ml", 4.90, "cheveux", "Shampoings", "");
p("NM01B", "Shampoing neem",                  "Ortie, neem · Séborégulateur, volumisant", "250 ml", 19.90, "cheveux", "Shampoings", "");
p("BV09B", "Shampoing régénérant",            "Panthénol, soie, bave d'escargot", "250 ml", 13.90, "cheveux", "Shampoings", "");
p("LA03B", "Shampoing lait d'ânesse",         "Camélia, camomille, vitamine E, karité, amande · Cheveux secs et cassants", "250 ml", 19.90, "cheveux", "Shampoings", "");
p("AS02B", "Shampoing antipelliculaire",      "Acide salicylique, panthénol, menthol, protéines de blé · Fortifiant", "250 ml", 12.90, "cheveux", "Shampoings", "");
p("SHPDB", "Shampoing anti-poux & lentes",    "Aloe, neem · Sans produits chimiques", "200 ml", 21.90, "cheveux", "Shampoings", "");
p("BB02B", "Shampoing bébé",                  "Macadamia, alchémille, aloe · Nettoie doucement", "200 ml", 18.90, "cheveux", "Shampoings", "");

p("AR06B",  "Masque capillaire bio",          "Amande douce, avocat, vitamine E, panthénol, argan · Nutrition et éclat", "150 ml", null, "cheveux", "Masques & après-shampoings", "B");
p("AR16B",  "Masque capillaire – voyage",     "Format voyage", "30 ml", 3.90, "cheveux", "Masques & après-shampoings", "");
p("CAP01B", "Masque kératine",                "Kératine, soie, argan · Restructuration instantanée", "150 ml", 10.90, "cheveux", "Masques & après-shampoings", "");
p("CAP24B", "Masque kératine – grand format", "Kératine, soie, argan", "500 ml", 29.90, "cheveux", "Masques & après-shampoings", "");
p("BV05B",  "Masque bave d'escargot",         "Coton, avocat, karité, bave d'escargot · Restructuration et brillance", "150 ml", 12.90, "cheveux", "Masques & après-shampoings", "");
p("CAP14B", "Masque hydratant",               "Avocat, macadamia, lin, aloe", "150 ml", 9.90, "cheveux", "Masques & après-shampoings", "");
p("AR03B",  "Après-shampoing bio",            "Vitamine E, raisin, tournesol, argan · Nourrissant", "250 ml", 17.90, "cheveux", "Masques & après-shampoings", "B");
p("AR15B",  "Après-shampoing – voyage",       "Vitamine E, raisin, tournesol, argan", "50 ml", 3.90, "cheveux", "Masques & après-shampoings", "");
p("BV02B",  "Après-shampoing cheveux traités", "Amande douce, vitamine E, argan, coco, bave d'escargot", "250 ml", 15.90, "cheveux", "Masques & après-shampoings", "");
p("CAP26B", "Crème anti-taches de coloration", "Huile de lin · Protège lors des colorations", "100 ml", 19.90, "cheveux", "Masques & après-shampoings", "");

p("CAP25B", "Sérum capillaire restructurant", "Vitamine E, lin, macadamia, argan · Démêle, brillance", "30 ml", null, "cheveux", "Sérums, brumes & sans rinçage", "");
p("BV13B",  "Masque en spray sans rinçage 10 en 1", "Karité, argan, son de riz, soie, panthénol, bave d'escargot", "150 ml", 29.90, "cheveux", "Sérums, brumes & sans rinçage", "");
p("PC001B", "Brume cheveux Parfum 1",         "Brume parfumée pour les cheveux", "30 ml", 9.90, "cheveux", "Sérums, brumes & sans rinçage", "");
p("PC007B", "Brume cheveux Parfum 7",         "Brume parfumée pour les cheveux", "30 ml", 9.90, "cheveux", "Sérums, brumes & sans rinçage", "");
p("PC019B", "Brume cheveux Parfum 19",        "Brume parfumée pour les cheveux", "30 ml", 9.90, "cheveux", "Sérums, brumes & sans rinçage", "");
p("PC023B", "Brume cheveux Parfum 23",        "Brume parfumée pour les cheveux", "30 ml", 9.90, "cheveux", "Sérums, brumes & sans rinçage", "");
p("PC042B", "Brume cheveux Parfum 42",        "Brume parfumée pour les cheveux", "30 ml", 9.90, "cheveux", "Sérums, brumes & sans rinçage", "");
p("CAP20B", "Gouttes de lumière Parfum 7",           "Lin, kératine, acide hyaluronique, soie", "50 ml", 29.90, "cheveux", "Sérums, brumes & sans rinçage", "");
p("CAP21B", "Gouttes de lumière Parfum 10",          "Lin, kératine, acide hyaluronique, soie", "50 ml", 29.90, "cheveux", "Sérums, brumes & sans rinçage", "");
p("CAP22B", "Gouttes de lumière Parfum 23",          "Lin, kératine, acide hyaluronique, soie", "50 ml", 29.90, "cheveux", "Sérums, brumes & sans rinçage", "");
p("CAP23B", "Gouttes de lumière Parfum 42",          "Lin, kératine, acide hyaluronique, soie", "50 ml", 29.90, "cheveux", "Sérums, brumes & sans rinçage", "");

p("FA01B",  "Soin intensif anti-chute (10 ampoules)", "Arnica, kigelia, ginseng, cannelle, sauge, soie · Stimule la croissance", "10 × 3 ml", 48.00, "cheveux", "Anti-chute", "");
p("FA02B",  "Lotion anti-chute 8 plantes",    "Serenoa, capsicum, sauge, romarin, ginkgo, ortie, kigelia, cannelle", "50 ml", 50.00, "cheveux", "Anti-chute", "");
p("FA03B",  "Lotion capillaire rafraîchissante", "Eucalyptus, menthol, camphre · Stimule la circulation", "100 ml", null, "cheveux", "Anti-chute", "");
p("CAP12B", "Shampoing anti-chute",           "Serenoa, ginkgo, aloe, prêle, caféine · Cheveux faibles et cassants", "250 ml", 19.90, "cheveux", "Anti-chute", "");

// ——— 6. Soins solaires ———
p("SOL01B", "Spray solaire SPF 50",           "Aloe, vitamine E, panthénol, hamamélis · Résiste à l'eau, UVA + UVB", "150 ml", 29.90, "solaire", "Soins solaires", "");
p("SOL02B", "Spray solaire SPF 30",           "Aloe, vitamine E, panthénol, hamamélis · Résiste à l'eau, UVA + UVB", "150 ml", 32.90, "solaire", "Soins solaires", "");
p("SOL03B", "Spray solaire SPF 15",           "Aloe, vitamine E, panthénol, hamamélis · Résiste à l'eau, UVA + UVB", "150 ml", 29.90, "solaire", "Soins solaires", "");
p("SOL05B", "Gel après-soleil",               "Eucalyptus, aloe, panthénol, menthol · Rafraîchissant", "150 ml", 19.90, "solaire", "Soins solaires", "");
p("SOL04B", "Huile solaire super bronzante",  "Argan, vitamine E, brou de noix, millepertuis", "150 ml", 15.90, "solaire", "Soins solaires", "");
p("SOL25",  "Spray rafraîchissant bronzant effet glace", "Complexe 2BRONZE™", "100 ml", 29.90, "solaire", "Soins solaires", "");
p("SOL21",  "Spray corps scintillant Monoï & lait", "Acide hyaluronique, aloe", "150 ml", 24.90, "solaire", "Soins solaires", "");
p("SOL22",  "Spray corps scintillant Noix de coco", "Acide hyaluronique, aloe", "150 ml", 24.90, "solaire", "Soins solaires", "");
p("SOL27",  "Spray apaisant après-soleil",    "Complexe SUNRELIEF™ · Émollient", "150 ml", 19.90, "solaire", "Soins solaires", "");
p("SOL26",  "Spray capillaire protecteur",    "SHINEJUICE™ + filtres · Protège du chlore et du sel", "150 ml", 25.90, "solaire", "Soins solaires", "");
p("SOL24",  "Spray capillaire biphasé régénérant", "GLOSSY DEEP™ · Anti-frisottis, protège la couleur", "150 ml", 19.90, "solaire", "Soins solaires", "");

// ——— 7. Pommades & remèdes ———
p("AD01B", "Gel apaisant anti-démangeaisons", "Panthénol, aloe, tea tree", "150 ml", null, "remedes", "Pommades & remèdes", "");
p("MD04B", "Baume à la griffe du diable",     "Arnica, HE romarin et thym, karité, amande", "75 ml", 13.90, "remedes", "Pommades & remèdes", "");
p("MD05B", "Pommade balsamique",              "Eucalyptus, romarin, menthol, camphre, tea tree · Contre les coups de froid", "50 ml", 20.90, "remedes", "Pommades & remèdes", "");
p("MD01B", "Pommade à l'ichtyol 9,8 %",       "Contre boutons, infections et abcès", "30 ml", null, "remedes", "Pommades & remèdes", "");
p("MD03B", "Gel apaisant brûlures",           "Neem, aloe, calendula, mimosa", "50 ml", 13.90, "remedes", "Pommades & remèdes", "");
p("CR23B", "Spray premiers soins",            "Camomille, 98 % aloe · Apaisant et réparateur", "150 ml", 16.90, "remedes", "Pommades & remèdes", "");
p("AD02B", "Soin réparateur multi-usage",      "Formule complète pour les petits maux", "50 ml", 23.90, "remedes", "Pommades & remèdes", "BV");

// ——— 8. Animaux ———
p("AN01B", "Shampoing pour chien",            "Neem, aloe · Antibactérien et antiparasite (pas pour pelage blanc)", "250 ml", 13.90, "animaux", "Animaux", "");
p("AN02B", "Spray répulsif anti-tiques chien", "Neem, HE thym rouge, aloe (pas pour pelage blanc)", "150 ml", 14.90, "animaux", "Animaux", "");
p("AN03",  "Nettoyant auriculaire chien & chat", "Tea tree, amande douce, carthame", "100 ml", 12.99, "animaux", "Animaux", "");
p("AN04",  "Parfum chiens & chats Kiwi-mangue", "Avoine, ylang-ylang, melaleuca, menthe", "150 ml", 19.99, "animaux", "Animaux", "");
p("AN05",  "Parfum chiens & chats Talc",      "Avoine, ylang-ylang, tea tree, menthe", "150 ml", 19.99, "animaux", "Animaux", "");

// Inspirations des soins parfumés (usage uniquement descriptif)
const INSPIRATIONS_SOINS = {
  SBM001: "Brazilian Crush · Sol de Janeiro", SBM002: "Bikini Season · Sol de Janeiro", SBM003: "Summer e Amor · Sol de Janeiro",
  SBM004: "Beijos de Sol · Sol de Janeiro", SBM005: "Rio Radiance · Sol de Janeiro",
  AP07B: "J'adore · Dior", GI42B: "La Vie est Belle · Lancôme", CRU001B: "One Million · Paco Rabanne",
  PC001B: "One Million · Paco Rabanne", PC007B: "J'adore · Dior", PC019B: "Lady Million · Paco Rabanne", PC023B: "Hypnotic Poison · Dior",
  PC042B: "La Vie est Belle · Lancôme", CAP20B: "J'adore · Dior", CAP21B: "Alien · Thierry Mugler", CAP22B: "Hypnotic Poison · Dior", CAP23B: "La Vie est Belle · Lancôme"
};
PRODUITS.forEach((p) => { if (INSPIRATIONS_SOINS[p.ref]) p.inspiration = INSPIRATIONS_SOINS[p.ref]; });

// ——— Maison : parfums d'ambiance ———
// Les diffuseurs n'ont pas de référence connue : sansRef masque la référence interne.
[["DIF100", "100 ml", 24], ["DIF200", "200 ml", 35], ["DIF500", "500 ml", 70]].forEach(([ref, format, prix]) => {
  p(ref, "Diffuseur d'ambiance " + format, "Avec ses bâtons en bois", format, prix, "maison", "Diffuseurs d'ambiance", "");
  Object.assign(PRODUITS[PRODUITS.length - 1], { sansRef: true });
});
[
  ["COPS0006", "Fruity Delight",     "Fruité floral", "Salon, entrée",              "Bergamote, fruits verts, pêche, mandarine", "Jasmin, violette, muguet", "Vanille, musc, bois ambrés, bois de santal", "CCP0018"],
  ["COPS0007", "Soft Hypnose",       "Fruité floral", "Chambre, salle de bain",     "Anis, pêche, coco", "Muguet, jasmin", "Crème, musc blanc, miel, benjoin, bois sucrés", "CCP0019"],
  ["COPS0008", "Musk Ritual",        "Boisé musqué",  "Bureau, salon",              "Bergamote, citron", "Jasmin, pin, cassis", "Musc, bois secs, patchouli, muscs blancs", "CCP0020"],
  ["COPS0009", "Sweet Symphonies",   "Fruité",        "Cuisine",                    "Citron, pomme, pêche", "Framboise, fleurs blanches, poire", "Vanille, patchouli", "CCP0021"],
  ["COPS0010", "Whispering Woods",   "Agrumes boisé", "Open space, coin lecture",   "Bergamote", "Patchouli", "Bois de oud, ambre, musc", "CCP0022"]
].forEach(([ref, nom, famille, piece, tete, coeur, fond, echantillon]) => {
  p(ref, "Spray d'ambiance " + nom, famille + " · idéal pour : " + piece.toLowerCase(), "500 ml", 35, "maison", "Sprays d'ambiance", "");
  Object.assign(PRODUITS[PRODUITS.length - 1], { famille, piece, echantillon, notes: { tete, coeur, fond } });
});

// Photos des produits (dossier assets/img)
PRODUITS.forEach((p) => {
  if (/^SBM00[1-5]$/.test(p.ref)) p.image = "assets/img/brume-" + p.ref.toLowerCase() + ".png";
  if (p.rubrique === "Diffuseurs d'ambiance") p.image = "assets/img/diffuseur.png";
  if (p.rubrique === "Sprays d'ambiance") p.image = "assets/img/spray-ambiance.png";
});
