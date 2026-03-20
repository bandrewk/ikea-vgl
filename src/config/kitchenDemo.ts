/**
 * METOD/VEDDINGE example kitchen — article numbers researched from IKEA DE API.
 * Some EXCEPTIONELL products have been renamed to MAXIMERA/KNIVSHULT.
 * Prices are fetched live via the app's search API.
 */

export interface KitchenItem {
  articleId: string;
  label: string;
  qty: number;
}

export const kitchenItems: KitchenItem[] = [
  // Korpusse & Schränke
  { articleId: "00591700", label: "METOD Korpus Unterschrank 80x37x80", qty: 1 },
  { articleId: "80213432", label: "METOD Korpus Unterschrank 40x37x80", qty: 1 },
  { articleId: "60591702", label: "METOD Korpus Unterschrank 60x60x80", qty: 4 },
  { articleId: "50205626", label: "METOD Korpus Unterschrank 60x37x80", qty: 3 },
  { articleId: "70213569", label: "METOD Unterschrank f. Einbauofen/Spüle 60x60x80", qty: 1 },
  { articleId: "50212561", label: "METOD Korpus Hochschrank 60x60x220", qty: 5 },

  // Fronten — VEDDINGE
  { articleId: "20205430", label: "VEDDINGE Tür 60x80", qty: 8 },
  { articleId: "30212406", label: "VEDDINGE Tür 60x140", qty: 3 },
  { articleId: "40205434", label: "VEDDINGE Tür 60x60", qty: 4 },
  { articleId: "00205431", label: "VEDDINGE Tür 40x80", qty: 6 },
  { articleId: "30205439", label: "VEDDINGE Schubladenfront 60x40", qty: 4 },
  { articleId: "20205425", label: "VEDDINGE Schubladenfront 40x40", qty: 2 },

  // Schubladen — MAXIMERA (formerly EXCEPTIONELL)
  { articleId: "50319350", label: "MAXIMERA Schublade mittel 40x60", qty: 1 },
  { articleId: "60319364", label: "MAXIMERA Schublade hoch 40x60", qty: 1 },
  { articleId: "40319360", label: "MAXIMERA Schublade hoch 80x37", qty: 1 },
  { articleId: "90319348", label: "MAXIMERA Schublade mittel 60x60", qty: 2 },
  { articleId: "20319361", label: "MAXIMERA Schublade hoch 60x60", qty: 2 },
  { articleId: "20319356", label: "MAXIMERA Schublade niedrig 40x60", qty: 2 },
  { articleId: "70319354", label: "MAXIMERA Schublade niedrig 60x60", qty: 2 },
  { articleId: "50238858", label: "MAXIMERA Schubladenseite hoch 60", qty: 3 },

  // Einlegeböden & Innenleben
  { articleId: "10205609", label: "UTRUSTA Boden 80x37", qty: 2 },
  { articleId: "10205614", label: "UTRUSTA Boden 60x37", qty: 6 },
  { articleId: "40205622", label: "UTRUSTA Boden 40x37", qty: 2 },
  { articleId: "50205612", label: "UTRUSTA Boden 60x60", qty: 4 },
  { articleId: "80204673", label: "UTRUSTA Drahtkorb 40", qty: 7 },
  { articleId: "40204651", label: "UTRUSTA Schubladenfront niedrig 60", qty: 2 },

  // Scharniere & Beschläge
  { articleId: "80607373", label: "UTRUSTA Scharnier 95°", qty: 6 },
  { articleId: "80524882", label: "UTRUSTA Scharnier m. Dämpfer 110°", qty: 22 },
  { articleId: "70556067", label: "METOD Bein 8 cm", qty: 38 },
  { articleId: "20117551", label: "UTBY Bein 88 cm", qty: 2 },

  // Sockelleisten & Abdeckungen
  { articleId: "70526787", label: "FÖRBÄTTRA Sockel 220x8", qty: 9 },
  { articleId: "30221458", label: "METOD Sockel belüftet 60", qty: 3 },

  // Arbeitsplatten
  { articleId: "90442980", label: "EKBACKEN Arbeitsplatte 186x2.8", qty: 6 },

  // Spülen & Armaturen
  { articleId: "30442365", label: "GLYPEN Mischbatterie", qty: 1 },
  { articleId: "80519951", label: "VIMMERN Mischbatterie mit Brause", qty: 2 },
  { articleId: "10311539", label: "LILLVIKEN Siphon 1 Becken", qty: 3 },
  { articleId: "20317852", label: "LILLVIKEN Kappe", qty: 2 },

  // Aufbewahrung
  { articleId: "50602094", label: "SORTERA Abfalleimer mit Deckel 37l", qty: 3 },
  { articleId: "00448972", label: "ENHET Regalrahmen Wand m. Böden 60x30x75", qty: 4 },
  { articleId: "20448947", label: "ENHET Regalrahmen hoch m. Böden 60x30x180", qty: 2 },
  { articleId: "10602982", label: "NISSAFORS Servierwagen", qty: 2 },
  { articleId: "80486724", label: "FÖRHÖJA Servierwagen", qty: 1 },

  // Beleuchtung
  { articleId: "00516819", label: "YTBERG Schrankbeleuchtung", qty: 2 },

  // Elektrogeräte
  { articleId: "40368765", label: "MATÄLSKARE Heißluftofen", qty: 2 },
  { articleId: "40600057", label: "LAGAN Einbaumikrowelle", qty: 2 },
  { articleId: "70506096", label: "LAGAN Induktionskochfeld", qty: 2 },
  { articleId: "80559466", label: "KOLSTAN Induktionskochfeld 58 cm", qty: 1 },
  { articleId: "00572872", label: "TINAD Kühl-/Gefrierschrank", qty: 3 },
];
