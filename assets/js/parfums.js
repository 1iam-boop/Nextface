/*
 * Liste des parfums AW Parfumerie — source : « Liste des parfums » (70 ml) et « Liste des parfums 15 ml ».
 *
 * Une ligne = une référence 70 ml suivie du nom du parfum.
 * Pour les gammes Luxe et Luxury, les deux nombres en fin de ligne sont
 * le prix du grand format puis le prix du 15 ml.
 * La référence 15 ml est calculée automatiquement (ex. 006W → T006, 151W → T151W).
 */

const GAMMES = {
  classique: { nom: "Classiques", grand: "70 ml", prixGrand: 35, prix15: 11.90, note: "Hors frais de port" },
  luxe:      { nom: "Luxe",       grand: "70 ml" },
  luxury:    { nom: "Luxury",     grand: "50 ml" },
  creation:  { nom: "Créations",  grand: "50 ml", prixGrand: 60 },
  enfant:    { nom: "Enfants",    grand: "30 ml", prixGrand: 29 }
};

const GENRES = { W: "Femme", M: "Homme", U: "Mixte" };

const LISTES = {
  classique: `
006W Addiction|007W Pure Gold|010W Stranger|011W Aqua Soul for Her|151W To the Edge for Her|014W Statement|019W Prestige for Her|023W Fatale|024W The Essence|025W Her Secret|026W Wild Poppy|027W L'Amour Rare|028W Etherea|029W Rêve Parisien|039W Darling|040W Magnetic|153W Rose Dust|042W Bonheur Suprême|154W Liaison Rose|047W Night Gem|049W Pearl Bloom|051W Miss Bijou|053W Vanité|055W Black Addiction|056W Light & Dark|057W Pure Purple|156W Unbending Woman|064W Talisman|067W Victoria|070W Pure Ego for Her|071W Sublime for Her|076W Deep Blue for Her|158W Wild Bloom|080W Absolutely|081W Allure Éternelle|082W Jeunesse|085W Serendipity|089W Ville Lumière|090W Femme Fatale|159W British Charm|096W The Muse|097W Vita|098W Euphoria|115W Icon|116W Declare|119W Dark Affair|120W Haute Couture|121W Secret Desire|133W Enigma|145W Forever Yours|148W Divine Aura|161W Eternal Love|
001M Prestige for Him|002M Deep Blue for Him|003M Fireborn|004M Pure Ego for Him|150M Unbending Man|012M Revenant|015M Urbe|016M Sailor|152M To the Edge for Him|018M Revelation|020M Obscuro|021M Aqua Soul for Him|022M Elemental|030M Maverick|032M Explosive|033M Nightfall|037M Gentleman|038M Abyss|048M Sublime for Him|160M British Charm|052M Arabian Mirage|061M Triumph|062M Extreme|157M Aftertouch|069M Seaside|079M So True|084M Indigo|086M Titan|087M Wildman|088M Midnight Man|091M Bond|140M Cupid|147M Dark Nectar|162M Eternal Love|
155U True Self|054U Night Flower|072U Earth Memory|100U Mystic Woods|105U Expresso`,
  luxe: `
093W Glory for Her 57 17.90|122W Volare 48 14.90|131W Chica Mala 48 14.90|132W My Rules 45 13.90|163W Blooming Skin 45 13.90|
068M Glory for Him 57 17.90|094M Revenant Intense 48 14.90|113M Your Journey 57 17.90|136M Modern Man 45 13.90|164M Unfold 45 13.90|
044U Frozen Crest 48 14.90|073U The Summit 48 14.90|099U Orange Sun 45 13.90|110U Mystic Spell 48 14.90|114U Desert Whisper 48 14.90|135U Mystic Forest 57 17.90|142U Dark Eclipse 57 17.90`,
  luxury: `
109W Pure Gold Intense 52 19.90|123W Sweet Rebl 52 19.90|
074M Essence Noire 52 19.90|075M Xcellence 52 19.90|
101U Soft Caress 52 19.90|102U Soft Rays 52 19.90|106U Rebel Icon 52 19.90|111U Ruby Love 52 19.90|112U Riviera 52 19.90|117U Velvet Smoke 52 19.90|118U Scarlet Fire 52 19.90|124U Everlasting 52 19.90|125U Mediterraneo 52 19.90|126U Lumière Dorée 52 19.90|127U Agar Forest 52 19.90|128U Sugar Poison 52 19.90|129U Chlorophyll 52 19.90|130U Oceanic Pulse 65 22.90|134U Orange Nectar 52 19.90|137U Sicilian Garden 52 19.90|138U Woodland 52 19.90|139U Sahara Blush 65 22.90|141U Sands of Time 65 22.90|143U Sweet Dust 52 19.90|144U Creamy Dream 52 19.90|146U Scarlet Flame 52 19.90`
};

const PARFUMS = [];

Object.entries(LISTES).forEach(([gamme, texte]) => {
  texte.split("|").map((l) => l.trim()).filter(Boolean).forEach((ligne) => {
    const m = ligne.match(/^(\S+) (.+?)(?: (\d+) ([\d.]+))?$/);
    const ref = m[1], num = parseInt(ref, 10), g = GAMMES[gamme];
    PARFUMS.push({
      ref, nom: m[2], genre: GENRES[ref.slice(-1)], gamme,
      grand: g.grand, prixGrand: m[3] ? +m[3] : g.prixGrand,
      ref15: "T" + (num >= 147 ? ref : ref.slice(0, -1)),
      prix15: m[4] ? +m[4] : g.prix15
    });
  });
});

// Créations (50 ml, pas de format 15 ml)
[
  ["EVENT23W", "Event 23 Femme", "Femme", "Séduction"],
  ["EVENT23M", "Event 23 Homme", "Homme", "Mystère"],
  ["MULTIVERSE", "Multiverse", "Homme", "Épicé boisé"],
  ["ASTRAL24", "Astral 24", "Femme", "Fruité frais"],
  ["NADIR", "Nadir", "Homme", "Chypré oriental"],
  ["IMPERATRIX", "Imperatrix", "Femme", "Fruité"]
].forEach(([ref, nom, genre, famille]) =>
  PARFUMS.push({ ref, nom, genre, famille, gamme: "creation", grand: "50 ml", prixGrand: 60 }));

// Parfums enfants (30 ml)
[
  ["045", "Garçon"],
  ["058B", "Baby Girl"],
  ["059", "Bébé"]
].forEach(([ref, nom]) =>
  PARFUMS.push({ ref, nom, genre: "Enfant", gamme: "enfant", grand: "30 ml", prixGrand: 29 }));

// Étuis pour les flacons de 15 ml
const ETUIS = [
  { ref: "TCOV010", nom: "Étui ivoire",   couleur: "#efe6dc", prix: 13 },
  { ref: "TCOV012", nom: "Étui sauge",    couleur: "#c9d3b4", prix: 13 },
  { ref: "TCOV011", nom: "Étui lilas",    couleur: "#cdb6dd", prix: 13 },
  { ref: "TCOV013", nom: "Étui cuivré",   couleur: "#d99a68", prix: 13 },
  { ref: "TCOV009", nom: "Étui chocolat", couleur: "#4a3a32", prix: 15 },
  { ref: "TCOV008", nom: "Étui bordeaux", couleur: "#6e2a28", prix: 15 }
];
