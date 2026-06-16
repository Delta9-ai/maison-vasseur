export type Oeuvre = {
  num: string;
  titre: string;
  annee: string;
  ligne: string;
  tete: string[];
  coeur: string[];
  fond: string[];
  seed: string;
  ratio: "portrait" | "paysage" | "carre";
};

export const oeuvres: Oeuvre[] = [
  {
    num: "01",
    titre: "Pluie sur le béton",
    annee: "2021",
    ligne: "L'odeur d'une ville juste après l'orage.",
    tete: ["Ozone", "Accord pluie", "Poivre gris"],
    coeur: ["Béton mouillé", "Bitume", "Racine d'iris froide"],
    fond: ["Pierre humide", "Mousse de chêne", "Ambre minéral"],
    seed: "wet-concrete-storm-dark",
    ratio: "portrait",
  },
  {
    num: "02",
    titre: "Forêt à six heures",
    annee: "2023",
    ligne: "Sous-bois humide, mousse, premier soleil.",
    tete: ["Aiguille de pin", "Air froid", "Feuille de violette"],
    coeur: ["Mousse", "Terre humide", "Fougère"],
    fond: ["Vétiver", "Bois mouillé", "Patchouli sombre"],
    seed: "dark-forest-moss-dawn",
    ratio: "paysage",
  },
  {
    num: "03",
    titre: "L'atelier de mon père",
    annee: "2023",
    ligne: "Bois coupé, vernis, café froid.",
    tete: ["Copeau de bois frais", "Café froid", "Agrume sec"],
    coeur: ["Cèdre", "Accord vernis laqué", "Tabac blond"],
    fond: ["Santal", "Sciure", "Cuir doux"],
    seed: "woodworker-workshop-shavings",
    ratio: "carre",
  },
  {
    num: "04",
    titre: "Dernier train",
    annee: "2024",
    ligne: "Métal, peau, fatigue douce.",
    tete: ["Accord métallique", "Ozone", "Bergamote pâle"],
    coeur: ["Peau musquée", "Néroli fané", "Iris poudré"],
    fond: ["Musc blanc", "Ambre gris", "Bois fumé"],
    seed: "night-train-metal-platform",
    ratio: "paysage",
  },
  {
    num: "05",
    titre: "Figue ouverte",
    annee: "2024",
    ligne: "Lait de figue, feuille froissée, sève.",
    tete: ["Feuille de figuier froissée", "Galbanum", "Citron vert"],
    coeur: ["Lait de figue", "Sève verte", "Jasmin discret"],
    fond: ["Bois de figuier", "Coco lactée", "Musc vert"],
    seed: "split-fig-green-macro",
    ratio: "portrait",
  },
  {
    num: "06",
    titre: "Neige sèche",
    annee: "2025",
    ligne: "Air froid, minéral, le bord de l'absence.",
    tete: ["Air glacé aldéhydé", "Menthe givrée"],
    coeur: ["Iris froid", "Pierre", "Ambrette"],
    fond: ["Musc minéral", "Cèdre blanc", "Accord blanc presque vide"],
    seed: "dry-snow-mineral-pale",
    ratio: "carre",
  },
];
