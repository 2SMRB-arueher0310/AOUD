import type { Perfume } from "./store"

export type Lang = "ES" | "EN" | "FR"

/**
 * Diccionario de términos comunes que aparecen muchas veces en notas,
 * pirámides, estaciones, ocasiones, etiquetas (longevity / sillage /
 * concentración / género). Si un término no está aquí, se devuelve tal cual.
 */
const VOCAB_EN: Record<string, string> = {
  // Estaciones
  "Primavera": "Spring",
  "Verano": "Summer",
  "Otoño": "Autumn",
  "Invierno": "Winter",
  "Primavera fría": "Cold Spring",
  "Primavera fresca": "Fresh Spring",
  "Todo el año": "All year round",

  // Género / concentración
  "Masculino": "Masculine",
  "Femenino": "Feminine",
  "Unisex": "Unisex",
  "Eau de Parfum": "Eau de Parfum",
  "Eau de Toilette": "Eau de Toilette",
  "Eau de Cologne Concentrée": "Eau de Cologne Concentrée",
  "Cologne Intense": "Cologne Intense",
  "Extrait de Parfum": "Extrait de Parfum",

  // Longevity / sillage labels
  "Eterna": "Eternal",
  "Excelente": "Excellent",
  "Muy buena": "Very good",
  "Buena": "Good",
  "Enorme": "Huge",
  "Notable": "Notable",
  "Moderada": "Moderate",
  "Discreta": "Discreet",

  // Notas / ingredientes
  "Abedul": "Birch", "Almendra Amarga": "Bitter Almond", "Almizcle": "Musk",
  "Almizcle Blanco": "White Musk", "Angelica": "Angelica", "Anís": "Anise",
  "Azafrán": "Saffron", "Azahar": "Orange Blossom", "Azúcar": "Sugar",
  "Bencina": "Benzoin", "Benjuí": "Benzoin", "Bergamota": "Bergamot",
  "Bergamota de Calabria": "Calabrian Bergamot", "Cacao": "Cocoa",
  "Cachemira": "Cashmere", "Café": "Coffee", "Canela": "Cinnamon",
  "Cannabis": "Cannabis", "Cardamomo": "Cardamom", "Castóreo": "Castoreum",
  "Caña de Azúcar": "Sugarcane", "Cedro": "Cedar",
  "Cedro de Virginia": "Virginia Cedar", "Chocolate": "Chocolate",
  "Cicuta": "Hemlock", "Cilantro": "Coriander", "Ciprés": "Cypress",
  "Cisto": "Cistus", "Cisto Labdanum": "Cistus Labdanum", "Civeta": "Civet",
  "Comino": "Cumin", "Cuero": "Leather", "Cítricos": "Citrus", "Davana": "Davana",
  "Dátil": "Date", "Especias": "Spices", "Flor de Tabaco": "Tobacco Flower",
  "Fruta del Tonka": "Tonka Fruit", "Frutos Secos": "Nuts", "Galbano": "Galbanum",
  "Geranio": "Geranium", "Grosella Negra": "Blackcurrant", "Guayaco": "Guaiac Wood",
  "Hachís": "Hashish", "Hoja de Tabaco": "Tobacco Leaf", "Incienso": "Incense",
  "Incienso Negro": "Black Incense", "Iris": "Iris", "Jazmín": "Jasmine",
  "Jazmín marroquí": "Moroccan Jasmine", "Labdanum": "Labdanum", "Lavanda": "Lavender",
  "Lichi": "Lychee", "Limón": "Lemon", "Limón Siciliano": "Sicilian Lemon",
  "Lirio del Valle": "Lily of the Valley", "Madera Seca": "Dry Wood",
  "Madera de Cedro": "Cedarwood", "Maderas": "Woods", "Maderas Negras": "Black Woods",
  "Mandarina": "Mandarin", "Manzana": "Apple", "Melocotón": "Peach", "Miel": "Honey",
  "Mirra": "Myrrh", "Musgo": "Moss", "Musgo de Roble": "Oakmoss",
  "Naranja Sanguina": "Blood Orange", "Notas Verdes": "Green Notes",
  "Nuez Moscada": "Nutmeg", "Orégano": "Oregano", "Oud": "Oud",
  "Oud Camboyano": "Cambodian Oud", "Pachulí": "Patchouli",
  "Palo de Oud Chino": "Chinese Oud Wood",
  "Palo de Rosa Brasileño": "Brazilian Rosewood", "Papiro": "Papyrus",
  "Peonía": "Peony", "Petitgrain": "Petitgrain", "Pimienta Negra": "Black Pepper",
  "Pimienta Rosa": "Pink Pepper", "Pino": "Pine", "Piña": "Pineapple",
  "Pomelo": "Grapefruit", "Pomelo Rosa": "Pink Grapefruit", "Resinas": "Resins",
  "Ron": "Rum", "Rosa": "Rose", "Rosa Centifolia": "Centifolia Rose",
  "Rosa Negra": "Black Rose", "Rosa de Bulgaria": "Bulgarian Rose",
  "Rosa de Damasco": "Damascus Rose", "Rosa de Turquía": "Turkish Rose",
  "Sándalo": "Sandalwood", "Sándalo Mysore": "Mysore Sandalwood", "Tabaco": "Tobacco",
  "Tonka": "Tonka", "Tuberosa": "Tuberose", "Vainilla": "Vanilla",
  "Vainilla de Madagascar": "Madagascar Vanilla", "Vetiver": "Vetiver",
  "Violeta": "Violet", "Ylang-Ylang": "Ylang-Ylang", "Ámbar": "Amber",
  "Ámbar Gris": "Ambergris",

  // Ocasiones
  "Aperitivos": "Aperitifs", "Bares de jazz": "Jazz bars", "Bodas": "Weddings",
  "Bodas de día": "Daytime weddings", "Bodas reales": "Royal weddings",
  "Brunch": "Brunch", "Cenas": "Dinners",
  "Cenas a la luz de las velas": "Candlelit dinners", "Cenas casuales": "Casual dinners",
  "Cenas con whisky": "Whisky dinners", "Cenas creativas": "Creative dinners",
  "Cenas de gala": "Gala dinners", "Cenas de trabajo": "Business dinners",
  "Cenas elegantes": "Elegant dinners", "Cenas íntimas": "Intimate dinners",
  "Citas": "Dates", "Citas diurnas": "Daytime dates",
  "Citas nocturnas": "Evening dates", "Citas íntimas": "Intimate dates",
  "Cualquier momento donde quieras destacar": "Any moment you want to stand out",
  "Cualquier ocasión, día o noche": "Any occasion, day or night",
  "Encuentros íntimos": "Intimate encounters", "Eventos artísticos": "Art events",
  "Eventos creativos": "Creative events", "Eventos de gala": "Gala events",
  "Eventos discretos": "Discreet events",
  "Eventos donde quieras provocar": "Events where you want to provoke",
  "Eventos donde quieras ser recordado": "Events where you want to be remembered",
  "Eventos especiales": "Special events", "Eventos exclusivos": "Exclusive events",
  "Eventos formales": "Formal events", "Eventos memorables": "Memorable events",
  "Eventos nocturnos": "Evening events", "Eventos sociales": "Social events",
  "Galas": "Galas", "Galerías de arte": "Art galleries",
  "Lecturas de invierno": "Winter readings", "Lecturas largas": "Long reading sessions",
  "Noches": "Evenings", "Noches creativas": "Creative nights",
  "Noches de invierno": "Winter nights", "Noches especiales": "Special nights",
  "Noches privadas": "Private nights", "Noches subterráneas": "Underground nights",
  "Oficina": "Office", "Paseos por el bosque": "Forest walks",
  "Reuniones creativas": "Creative meetings", "Reuniones de negocios": "Business meetings",
  "Reuniones de negocios nocturnas": "Evening business meetings",
  "Reuniones formales": "Formal meetings",
  "Sobremesas largas": "Long after-dinner conversations",
  "Tardes en el club": "Afternoons at the club", "Trabajo": "Work",
  "Trabajo en climas fríos": "Work in cold climates", "Uso diario": "Daily wear",
  "Veladas con whisky": "Whisky evenings", "Veladas exclusivas": "Exclusive evenings",
  "Veladas formales": "Formal evenings", "Veladas íntimas": "Intimate evenings",
  "Ópera": "Opera",

  // Badges
  "Bestseller": "Bestseller",
  "Nuevo": "New",
  "Exclusivo": "Exclusive",
}

const VOCAB_FR: Record<string, string> = {
  "Primavera": "Printemps", "Verano": "Été", "Otoño": "Automne",
  "Invierno": "Hiver", "Primavera fría": "Printemps frais",
  "Primavera fresca": "Printemps frais", "Todo el año": "Toute l'année",

  "Masculino": "Masculin", "Femenino": "Féminin", "Unisex": "Unisexe",
  "Eau de Parfum": "Eau de Parfum", "Eau de Toilette": "Eau de Toilette",
  "Eau de Cologne Concentrée": "Eau de Cologne Concentrée",
  "Cologne Intense": "Cologne Intense", "Extrait de Parfum": "Extrait de Parfum",

  "Eterna": "Éternelle", "Excelente": "Excellente", "Muy buena": "Très bonne",
  "Buena": "Bonne", "Enorme": "Énorme", "Notable": "Notable",
  "Moderada": "Modérée", "Discreta": "Discrète",

  "Abedul": "Bouleau", "Almendra Amarga": "Amande Amère", "Almizcle": "Musc",
  "Almizcle Blanco": "Musc Blanc", "Angelica": "Angélique", "Anís": "Anis",
  "Azafrán": "Safran", "Azahar": "Fleur d'Oranger", "Azúcar": "Sucre",
  "Bencina": "Benjoin", "Benjuí": "Benjoin", "Bergamota": "Bergamote",
  "Bergamota de Calabria": "Bergamote de Calabre", "Cacao": "Cacao",
  "Cachemira": "Cachemire", "Café": "Café", "Canela": "Cannelle",
  "Cannabis": "Cannabis", "Cardamomo": "Cardamome", "Castóreo": "Castoréum",
  "Caña de Azúcar": "Canne à Sucre", "Cedro": "Cèdre",
  "Cedro de Virginia": "Cèdre de Virginie", "Chocolate": "Chocolat",
  "Cicuta": "Ciguë", "Cilantro": "Coriandre", "Ciprés": "Cyprès",
  "Cisto": "Ciste", "Cisto Labdanum": "Ciste Labdanum", "Civeta": "Civette",
  "Comino": "Cumin", "Cuero": "Cuir", "Cítricos": "Agrumes", "Davana": "Davana",
  "Dátil": "Datte", "Especias": "Épices", "Flor de Tabaco": "Fleur de Tabac",
  "Fruta del Tonka": "Fruit du Tonka", "Frutos Secos": "Fruits Secs",
  "Galbano": "Galbanum", "Geranio": "Géranium", "Grosella Negra": "Cassis",
  "Guayaco": "Bois de Gaïac", "Hachís": "Haschich", "Hoja de Tabaco": "Feuille de Tabac",
  "Incienso": "Encens", "Incienso Negro": "Encens Noir", "Iris": "Iris",
  "Jazmín": "Jasmin", "Jazmín marroquí": "Jasmin marocain", "Labdanum": "Labdanum",
  "Lavanda": "Lavande", "Lichi": "Litchi", "Limón": "Citron",
  "Limón Siciliano": "Citron de Sicile", "Lirio del Valle": "Muguet",
  "Madera Seca": "Bois Sec", "Madera de Cedro": "Bois de Cèdre", "Maderas": "Bois",
  "Maderas Negras": "Bois Noirs", "Mandarina": "Mandarine", "Manzana": "Pomme",
  "Melocotón": "Pêche", "Miel": "Miel", "Mirra": "Myrrhe", "Musgo": "Mousse",
  "Musgo de Roble": "Mousse de Chêne", "Naranja Sanguina": "Orange Sanguine",
  "Notas Verdes": "Notes Vertes", "Nuez Moscada": "Noix de Muscade",
  "Orégano": "Origan", "Oud": "Oud", "Oud Camboyano": "Oud Cambodgien",
  "Pachulí": "Patchouli", "Palo de Oud Chino": "Bois d'Oud Chinois",
  "Palo de Rosa Brasileño": "Bois de Rose Brésilien", "Papiro": "Papyrus",
  "Peonía": "Pivoine", "Petitgrain": "Petitgrain", "Pimienta Negra": "Poivre Noir",
  "Pimienta Rosa": "Poivre Rose", "Pino": "Pin", "Piña": "Ananas",
  "Pomelo": "Pamplemousse", "Pomelo Rosa": "Pamplemousse Rose", "Resinas": "Résines",
  "Ron": "Rhum", "Rosa": "Rose", "Rosa Centifolia": "Rose Centifolia",
  "Rosa Negra": "Rose Noire", "Rosa de Bulgaria": "Rose de Bulgarie",
  "Rosa de Damasco": "Rose de Damas", "Rosa de Turquía": "Rose de Turquie",
  "Sándalo": "Santal", "Sándalo Mysore": "Santal Mysore", "Tabaco": "Tabac",
  "Tonka": "Tonka", "Tuberosa": "Tubéreuse", "Vainilla": "Vanille",
  "Vainilla de Madagascar": "Vanille de Madagascar", "Vetiver": "Vétiver",
  "Violeta": "Violette", "Ylang-Ylang": "Ylang-Ylang", "Ámbar": "Ambre",
  "Ámbar Gris": "Ambre Gris",

  "Aperitivos": "Apéritifs", "Bares de jazz": "Bars de jazz", "Bodas": "Mariages",
  "Bodas de día": "Mariages de jour", "Bodas reales": "Mariages royaux",
  "Brunch": "Brunch", "Cenas": "Dîners",
  "Cenas a la luz de las velas": "Dîners aux chandelles",
  "Cenas casuales": "Dîners décontractés", "Cenas con whisky": "Dîners au whisky",
  "Cenas creativas": "Dîners créatifs", "Cenas de gala": "Dîners de gala",
  "Cenas de trabajo": "Dîners d'affaires", "Cenas elegantes": "Dîners élégants",
  "Cenas íntimas": "Dîners intimes", "Citas": "Rendez-vous",
  "Citas diurnas": "Rendez-vous de jour", "Citas nocturnas": "Rendez-vous nocturnes",
  "Citas íntimas": "Rendez-vous intimes",
  "Cualquier momento donde quieras destacar": "Tout moment où vous voulez vous démarquer",
  "Cualquier ocasión, día o noche": "Toute occasion, jour ou nuit",
  "Encuentros íntimos": "Rencontres intimes", "Eventos artísticos": "Événements artistiques",
  "Eventos creativos": "Événements créatifs", "Eventos de gala": "Événements de gala",
  "Eventos discretos": "Événements discrets",
  "Eventos donde quieras provocar": "Événements où vous voulez provoquer",
  "Eventos donde quieras ser recordado": "Événements pour marquer les esprits",
  "Eventos especiales": "Événements spéciaux",
  "Eventos exclusivos": "Événements exclusifs", "Eventos formales": "Événements formels",
  "Eventos memorables": "Événements mémorables", "Eventos nocturnos": "Événements nocturnes",
  "Eventos sociales": "Événements sociaux", "Galas": "Galas",
  "Galerías de arte": "Galeries d'art", "Lecturas de invierno": "Lectures d'hiver",
  "Lecturas largas": "Longues lectures", "Noches": "Nuits",
  "Noches creativas": "Nuits créatives", "Noches de invierno": "Nuits d'hiver",
  "Noches especiales": "Nuits spéciales", "Noches privadas": "Nuits privées",
  "Noches subterráneas": "Nuits underground", "Oficina": "Bureau",
  "Paseos por el bosque": "Promenades en forêt",
  "Reuniones creativas": "Réunions créatives", "Reuniones de negocios": "Réunions d'affaires",
  "Reuniones de negocios nocturnas": "Réunions d'affaires nocturnes",
  "Reuniones formales": "Réunions formelles",
  "Sobremesas largas": "Longues conversations à table",
  "Tardes en el club": "Après-midis au club", "Trabajo": "Travail",
  "Trabajo en climas fríos": "Travail par temps froid", "Uso diario": "Usage quotidien",
  "Veladas con whisky": "Soirées au whisky", "Veladas exclusivas": "Soirées exclusives",
  "Veladas formales": "Soirées formelles", "Veladas íntimas": "Soirées intimes",
  "Ópera": "Opéra",

  "Bestseller": "Best-seller", "Nuevo": "Nouveau", "Exclusivo": "Exclusif",
}

export function tTerm(term: string, lang: Lang): string {
  if (lang === "ES") return term
  const dict = lang === "EN" ? VOCAB_EN : VOCAB_FR
  return dict[term] ?? term
}

export function tTerms(terms: string[], lang: Lang): string[] {
  return terms.map((t) => tTerm(t, lang))
}

/* =================================================================
 * Traducciones por producto (campos únicos: description del catálogo,
 * story, sillage.description, projection, recommendedFor, howToWear,
 * y orígenes de ingredientes).
 * ================================================================= */

interface PerfumeTextI18n {
  description?: string
  story?: string
  sillageDesc?: string
  projection?: string
  recommendedFor?: string
  howToWear?: string
  /** Traducción de los strings de origen (clave = origen en ES) */
  origin?: Record<string, string>
}

const I18N_EN: Record<string, PerfumeTextI18n> = {
  p1: {
    description: "An intense, complex fragrance built around incense and oud.",
    story:
      "Interlude Man was born in 2012 as a manifesto of olfactory chaos. Amouage set out to capture the inner noise of the modern man: a storm of incense, spices and oud that slowly settles on the skin until it becomes an ambered calm.",
    sillageDesc: "Fills the room within minutes.",
    projection: "High for the first 90 minutes, then turns intimate.",
    recommendedFor: "Confident men who want to leave a mark without saying a word.",
    howToWear: "Two sprays are enough: one on the neck, one on the wrist. More is a declaration of war.",
    origin: { "Assam, India": "Assam, India", "Dhofar, Omán": "Dhofar, Oman", "Andalucía, España": "Andalusia, Spain" },
  },
  p7: {
    description: "An olfactory celebration of oriental perfumery.",
    story:
      "Jubilation XXV celebrates the 25th anniversary of Amouage. It is an oriental symphony of honey, myrrh and incense that evokes a golden temple at dawn.",
    sillageDesc: "Warm, easily recognisable trail.",
    projection: "Dense at first, honeyed at the end.",
    recommendedFor: "Those who love classic orientals with a contemporary twist.",
    howToWear: "Apply on hydrated skin to amplify the honeyed notes.",
    origin: { "Apicultores tradicionales de Omán": "Traditional Omani beekeepers", "Etiopía": "Ethiopia" },
  },
  p13: {
    description: "Italian elegance fused with the mystery of oud.",
    story:
      "Acqua di Parma reinterprets the Mediterranean spirit through a surprisingly luminous oud. Colonia Oud is the Italian citrus spark embraced by the precious woods of the East.",
    sillageDesc: "Refined, never invasive.",
    projection: "Balanced and elegant.",
    recommendedFor: "Lovers of Italian elegance who want to try oud without commitment.",
    howToWear: "Ideal layered with the body cream from the same line.",
    origin: { "Reggio Calabria, Italia": "Reggio Calabria, Italy", "Indonesia": "Indonesia" },
  },
  p14: {
    description: "A modern, artistic interpretation of oud.",
    story:
      "Oud Immortel is the Swedish take on oud: minimalist, misty and almost melancholy. Ben Gorham conceived it as a tribute to the eternal woods that outlive generations.",
    sillageDesc: "Close aura, almost a secret.",
    projection: "Intimate and sophisticated.",
    recommendedFor: "Those who shun the obvious and prefer perfumes that reveal themselves up close.",
    howToWear: "A single spray on the nape. Let it breathe for 10 minutes before moving.",
    origin: { "Laboratorios suizos": "Swiss laboratories", "Egipto": "Egypt" },
  },
  p3: {
    description: "A royal, majestic interpretation of oud.",
    story:
      "Royal Oud is the oud of royalty according to Creed. Olivier Creed blends noble woods with vibrant citrus to create a fragrance that feels like wearing a bespoke suit.",
    sillageDesc: "Refined yet present.",
    projection: "Vibrant in the opening, velvety in the drydown.",
    recommendedFor: "Those seeking quiet luxury with a citrus freshness.",
    howToWear: "Spray from 20 cm onto the torso for an even diffusion.",
    origin: { "Sicilia, Italia": "Sicily, Italy", "Mysore, India": "Mysore, India" },
  },
  p8: {
    description: "The legendary Aventus, a symbol of power and success.",
    story:
      "Aventus has been a living legend since 2010. Inspired by the life of Napoleon Bonaparte, it embodies strength, vision and success in every note.",
    sillageDesc: "One of the most recognisable trails in the world.",
    projection: "Fruity and powerful at first, smoky in the heart, sweet and animalic in the drydown.",
    recommendedFor: "Ambitious men who want a recognisable signature scent.",
    howToWear: "Three sprays: neck, chest and forearm. The pineapple needs clean skin.",
    origin: { "Costa de Marfil": "Ivory Coast", "Países Nórdicos": "Nordic countries" },
  },
  p15: {
    description: "Damascus rose meets oud in this sublime creation.",
    story:
      "Oud Ispahan, part of the Dior Privée Collection, is a Damascus rose embraced by a velvety oud. A narcotic, opulent, almost hypnotic fragrance.",
    sillageDesc: "A dense, recognisable trail.",
    projection: "Saturated for the first hours, intoxicating to the end.",
    recommendedFor: "Anyone wanting to wear an oriental rose with no subtlety.",
    howToWear: "A single spray is enough. Two and you become unforgettable.",
    origin: { "Valle de las Rosas, Turquía": "Valley of the Roses, Turkey", "Laos": "Laos" },
  },
  p16: {
    description: "An addictive fragrance with an intoxicating floral bouquet.",
    story:
      "Fleur Narcotique has become a phenomenon: an addictive floral-fruity bouquet that combines peony, peach and white musk with an almost dangerous magnetism.",
    sillageDesc: "Sweet and luminous, draws looks.",
    projection: "Bright, juicy, romantic.",
    recommendedFor: "Those looking for a modern flower with a fruity wink.",
    howToWear: "Spray in the hair — one spritz keeps the trail going for hours.",
    origin: { "Re-creada en laboratorio (la peonía no rinde aceite esencial)": "Lab-recreated (peony yields no essential oil)", "Acordes Provenza, Francia": "Provence accords, France" },
  },
  p17: {
    description: "British tradition meets oriental luxury.",
    story:
      "Floris London, perfumers to the British crown since 1730, propose a civilised oud, wrapped in cashmere and roses. A whispered Savile Row elegance.",
    sillageDesc: "Subtle, refined, British.",
    projection: "Soft and steady.",
    recommendedFor: "Gentlemen and ladies who prefer a diplomatic oud.",
    howToWear: "Apply on a scarf for a generously warm diffusion in winter.",
    origin: { "Grasse, Francia": "Grasse, France", "Bangladesh": "Bangladesh" },
  },
  p18: {
    description: "The French maison pays tribute to the liquid gold of the East.",
    story:
      "Oud Essentiel is the French reading of liquid gold: bright, accessible and signed by Guerlain's in-house perfumer. An invitation to oud for beginners.",
    sillageDesc: "Warm and enveloping.",
    projection: "Silky.",
    recommendedFor: "Those wanting an oud without the opulence of classic niche.",
    howToWear: "Pairs with any skin and office wear.",
    origin: { "Indonesia": "Indonesia" },
  },
  p19: {
    description: "An olfactory tribute to Hemingway's adventurous spirit.",
    story:
      "1899 Hemingway is a tribute to the writer's birth year: rum, tobacco and leather recreate the atmosphere of a Havana tavern at sunset.",
    sillageDesc: "Warm and narrative.",
    projection: "Spicy and intoxicating.",
    recommendedFor: "Men with a personal library and a taste for the vintage.",
    howToWear: "On wool or tweed it unfolds its warmest side.",
    origin: { "Vuelta Abajo, Cuba": "Vuelta Abajo, Cuba" },
  },
  p11: {
    description: "A potent, addictive oud for true devotees of the genre.",
    story:
      "Oud for Greatness is Initio's bestselling oud: powerful, spicy lavender and a magnetic animalic base. For those unafraid to take up space.",
    sillageDesc: "Crosses the room and stays.",
    projection: "Beastly for the first 3 hours.",
    recommendedFor: "Anyone looking for a potent, modern oud.",
    howToWear: "A single spray. We repeat: one.",
    origin: { "Provenza, Francia": "Provence, France", "Camboya": "Cambodia" },
  },
  p20: {
    description: "An elegant, accessible introduction to the world of oud.",
    story:
      "Oud & Bergamot is the gateway to the oud universe according to Jo Malone: citrusy, light, perfect for combining with other colognes from the house.",
    sillageDesc: "Close and elegant.",
    projection: "Light and luminous.",
    recommendedFor: "Anyone wanting to explore oud without commitment.",
    howToWear: "Excellent for fragrance combining with Wood Sage & Sea Salt.",
    origin: { "Calabria, Italia": "Calabria, Italy" },
  },
  p21: {
    description: "Memento Mori — a dark, gourmand fragrance.",
    story:
      "Black Phantom — Memento Mori — comes in a bottle with a ceramic skull and promises a baroque experience: coffee, rum and bitter almonds in a golden chest.",
    sillageDesc: "Gourmand and smoky.",
    projection: "Sweet, dark, addictive.",
    recommendedFor: "Lovers of dark gourmands with baroque drama.",
    howToWear: "On the collarbone it radiates warmth for hours.",
    origin: { "Etiopía": "Ethiopia" },
  },
  p2: {
    description: "Tom Ford's sophisticated take on oud, soft and refined.",
    story:
      "Oud Wood is the gateway to the oud universe according to Tom Ford. Launched in 2007 within the Private Blend Collection, it softens the wild wood with creamy sandalwood and a touch of cardamom to make it cosmopolitan and sensual.",
    sillageDesc: "Close, elegant, never invasive.",
    projection: "Creamy and refined from start to finish.",
    recommendedFor: "Those wanting to discover oud in its most polished, wearable form.",
    howToWear: "Two sprays are enough: one on the neck, one on the chest.",
    origin: { "Laos y Vietnam": "Laos and Vietnam", "Nueva Caledonia": "New Caledonia" },
  },
  p4: {
    description: "A luminous and complex Cambodian oud-based oriental.",
    story:
      "Alexandria II pays tribute to the mythical Egyptian library. Sergio Momo builds an opulent oriental with Cambodian oud, candied dates and honey, evoking marble hallways bathed in golden light.",
    sillageDesc: "Golden trail that wraps the air.",
    projection: "Dense, sweet and narcotic.",
    recommendedFor: "Those wanting to wear high-perfumery oriental without compromise.",
    howToWear: "One spray on the nape; the extrait lasts the whole day.",
    origin: { "Camboya": "Cambodia", "Apicultores artesanos italianos": "Italian artisan beekeepers" },
  },
  p5: {
    description: "A silky oud wrapped in violet and vanilla.",
    story:
      "Oud Satin Mood is Francis Kurkdjian's silkiest reading of oud: a Bulgarian rose wrapped in violet and vanilla that settles on the skin like a silk shawl.",
    sillageDesc: "Warm, sensual, feminine trail.",
    projection: "Velvety, sweet without being cloying.",
    recommendedFor: "Those seeking a floral, silky oud, far from the aggressive ouds.",
    howToWear: "Apply on the décolletage so vanilla and oud warm with the skin.",
    origin: { "Valle de Kazanlak, Bulgaria": "Kazanlak Valley, Bulgaria", "Madagascar": "Madagascar" },
  },
  p6: {
    description: "Intense, dark and addictive. A truly unique experience.",
    story:
      "Black Afgano is the rebellious signature of Nasomatto: a green-resinous chord evoking chopped tobacco, dark coffee and thick resins. A statement for those who don't seek permission.",
    sillageDesc: "Dense trail, instantly recognisable.",
    projection: "Beastly for the first hours, hypnotic in the drydown.",
    recommendedFor: "Lovers of dense, uncompromising extraits.",
    howToWear: "One spray. Just one. And let it breathe for 15 minutes.",
    origin: { "Asia Central": "Central Asia", "Mediterráneo": "Mediterranean" },
  },
  p9: {
    description: "A modern classic: tobacco, vanilla and warm spices.",
    story:
      "Tobacco Vanille is a modern classic from the Private Blend. Olivier Gillotin captures a Victorian smoking room: chopped tobacco, dense vanilla, dried fruits and sweet spices.",
    sillageDesc: "Warm, cosy gourmand.",
    projection: "Sweet, spiced, comforting.",
    recommendedFor: "Those who love mature gourmands with a spicy character.",
    howToWear: "On wool or cashmere it unfolds its cosiest facet.",
    origin: { "Virginia, EE.UU.": "Virginia, USA", "Madagascar": "Madagascar" },
  },
  p10: {
    description: "A versatile signature scent for day and night.",
    story:
      "Layton channels the racehorses of the French royal house: it opens with fresh apple and lavender and settles on a creamy oriental base of vanilla and guaiac.",
    sillageDesc: "Elegant, very recognisable trail.",
    projection: "Fresh at first, creamy and spicy in the drydown.",
    recommendedFor: "Anyone looking for a versatile signature for day and night.",
    howToWear: "Two sprays on the neck for a perfect sillage.",
    origin: { "Provenza, Francia": "Provence, France", "Madagascar": "Madagascar" },
  },
  p12: {
    description: "The viral fragrance that conquered the world.",
    story:
      "Baccarat Rouge 540 was born as a commemorative piece for the 250th anniversary of Baccarat crystal. An ambered-saffron chord of crystalline purity, today a worldwide phenomenon.",
    sillageDesc: "Luminous trail that fills rooms.",
    projection: "Bright, sweet, ethereal.",
    recommendedFor: "Those after a viral signature blending luxury and modernity.",
    howToWear: "One spray on clothing lasts for days.",
    origin: { "Cachemira": "Kashmir", "Atlas, Marruecos": "Atlas, Morocco" },
  },
  p22: {
    description: "Le Labo's brutalist take on oud: raw and smoky.",
    story:
      "Oud 27 is Le Labo's brutalist vision: a raw, smoky, incandescent oud wrapped in black incense and resinous woods. No compromises, like everything from the New York house.",
    sillageDesc: "Smoky and resinous.",
    projection: "Dense and mineral.",
    recommendedFor: "Those who reject sweetened ouds and seek the raw thing.",
    howToWear: "Apply on wool or leather to amplify the smoky facet.",
    origin: { "Bangladesh y Laos": "Bangladesh and Laos", "Somalia": "Somalia" },
  },
  p23: {
    description: "A unique English forest of hemlock, pine and oud.",
    story:
      "Ormonde Man starts from a rare ingredient: hemlock. Linda Pilkington builds an enchanted British forest where the green darkness merges with a velvety oud.",
    sillageDesc: "Woody trail, almost mystical.",
    projection: "Green, deep, slightly smoky.",
    recommendedFor: "Those who enjoy narrative, unconventional fragrances.",
    howToWear: "On clean skin to better catch the hemlock and vetiver.",
    origin: { "Reconstrucción aromática inglesa": "English aromatic reconstruction", "Haití": "Haiti" },
  },
  p24: {
    description: "The original 1912 multifloral that defined modern perfumery.",
    story:
      "Quelques Fleurs L'Original, launched in 1912, was the first multifloral in history. Houbigant captured a bouquet of fifteen flowers in a single formula, laying the foundations of modern perfumery.",
    sillageDesc: "Classic, refined floral.",
    projection: "Bright, romantic, timeless.",
    recommendedFor: "Lovers of the great floral classics.",
    howToWear: "One spray in the hair and one on the wrists.",
    origin: { "Grasse, Francia": "Grasse, France" },
  },
  p25: {
    description: "Roja Dove elevates oud to jewellery — regal and almost sacred.",
    story:
      "Roja Dove elevates oud to the rank of a jewel. Aoud combines the rarest woods with Damascus rose and Mysore sandalwood for a regal, almost sacred experience.",
    sillageDesc: "Majestic trail.",
    projection: "Opulent, spicy, deeply luxurious.",
    recommendedFor: "Those seeking the highest, most exclusive perfumery.",
    howToWear: "A single drop on the pulse. The extrait lasts an entire day.",
    origin: { "Assam, India": "Assam, India", "Mysore, India": "Mysore, India" },
  },
  p26: {
    description: "A cult animalic musk: wild, carnal and magnetic.",
    story:
      "Muscs Koublai Khan is a cult wild, animalic musk. Lutens evokes bare skin and the horses of the Mongol empire with civet, amber and rose.",
    sillageDesc: "Warm, carnal, magnetic.",
    projection: "Animalic and spicy, deeply sensual.",
    recommendedFor: "Lovers of potent, unfiltered musks.",
    howToWear: "One spray on clean skin; the musk does the rest.",
    origin: { "Reconstrucción sintética (sin animales)": "Synthetic reconstruction (cruelty-free)", "Marruecos": "Morocco" },
  },
  p27: {
    description: "Wet asphalt, leather and spice under cold neon light.",
    story:
      "Nightscape captures the New York cityscape after the rain: wet asphalt, leather and spices under the cold light of neon signs.",
    sillageDesc: "Urban and discreet.",
    projection: "Balanced, minimalist, contemporary.",
    recommendedFor: "Those who appreciate modern, architectural woody scents.",
    howToWear: "Two sprays on the neck before leaving home.",
    origin: { "Virginia, EE.UU.": "Virginia, USA", "Haití": "Haiti" },
  },
  p28: {
    description: "A luminous patchouli wrapped in white musk and rose.",
    story:
      "Moonlight Patchouli reinvents patchouli in a luminous key: bleached by white musk, rose and vanilla, it shines like the moon on silk.",
    sillageDesc: "Refined and sensual.",
    projection: "Luminous, slightly earthy.",
    recommendedFor: "Those wanting an elegant patchouli — neither hippie nor gothic.",
    howToWear: "Apply on wrists and neck for a balanced diffusion.",
    origin: { "Indonesia": "Indonesia", "Turquía": "Turkey" },
  },
  p29: {
    description: "Emirati high perfumery: rare oud, Omani incense and roses.",
    story:
      "Black III belongs to Widian's black trilogy: Emirati high perfumery with the most select ouds, Omani incense and rare roses. A liquid jewel bottled as such.",
    sillageDesc: "Imposing Arabian trail.",
    projection: "Spicy, regal, deeply oriental.",
    recommendedFor: "Anyone wanting to experience unfiltered Arabian high perfumery.",
    howToWear: "One spray on the nape; the extrait is more than enough.",
    origin: { "Camboya": "Cambodia", "Dhofar, Omán": "Dhofar, Oman" },
  },
  p30: {
    description: "The pioneering oud that opened the door for a whole generation.",
    story:
      "M7 was revolutionary in 2002: Tom Ford, then creative director at YSL, introduced oud into mainstream perfumery. The Oud Absolu version intensifies that pioneering vision.",
    sillageDesc: "Warm and recognisable.",
    projection: "Citrusy at first, resinous and deep afterwards.",
    recommendedFor: "Those wanting to know the oud that paved the way for a generation.",
    howToWear: "Three sprays on the torso to make up for the EDT concentration.",
    origin: { "Marruecos": "Morocco", "Etiopía": "Ethiopia" },
  },
  p31: {
    description: "A 100% vegan artistic recreation of the legendary civet note.",
    story:
      "Zoologist's Civet is an artistic (100% vegan) recreation of the legendary animalic ingredient. A conceptual fragrance combining synthetic civet with white flowers and creamy musks.",
    sillageDesc: "Carnal, floral and magnetic.",
    projection: "Sensual, slightly wild.",
    recommendedFor: "Anyone seeking a conceptual and different olfactory experience.",
    howToWear: "One spray on the pulse. The civet amplifies everything.",
    origin: { "Reconstrucción sintética cruelty-free": "Synthetic cruelty-free reconstruction", "India": "India" },
  },
}

const I18N_FR: Record<string, PerfumeTextI18n> = {
  p1: {
    description: "Un parfum intense et complexe construit autour de l'encens et de l'oud.",
    story:
      "Interlude Man est né en 2012 comme un manifeste du chaos olfactif. Amouage a voulu capturer le bruit intérieur de l'homme moderne : une tempête d'encens, d'épices et d'oud qui se pose lentement sur la peau jusqu'à devenir un calme ambré.",
    sillageDesc: "Remplit la pièce en quelques minutes.",
    projection: "Élevée pendant les 90 premières minutes, puis devient intime.",
    recommendedFor: "Hommes sûrs d'eux qui veulent marquer sans dire un mot.",
    howToWear: "Deux vaporisations suffisent : une dans le cou, une au poignet. Plus est une déclaration de guerre.",
    origin: { "Assam, India": "Assam, Inde", "Dhofar, Omán": "Dhofar, Oman", "Andalucía, España": "Andalousie, Espagne" },
  },
  p7: {
    description: "Une célébration olfactive de la parfumerie orientale.",
    story:
      "Jubilation XXV célèbre le 25e anniversaire d'Amouage. C'est une symphonie orientale de miel, myrrhe et encens qui évoque un temple doré à l'aube.",
    sillageDesc: "Sillage chaleureux et reconnaissable.",
    projection: "Dense au départ, mielleuse à la fin.",
    recommendedFor: "Pour qui aime les orientaux classiques avec une touche contemporaine.",
    howToWear: "À appliquer sur peau hydratée pour intensifier les notes mielleuses.",
    origin: { "Apicultores tradicionales de Omán": "Apiculteurs traditionnels d'Oman", "Etiopía": "Éthiopie" },
  },
  p13: {
    description: "L'élégance italienne fusionnée au mystère de l'oud.",
    story:
      "Acqua di Parma réinterprète l'esprit méditerranéen à travers un oud étonnamment lumineux. Colonia Oud est l'éclat citronné italien embrassé par les bois précieux d'Orient.",
    sillageDesc: "Raffiné, jamais envahissant.",
    projection: "Équilibrée et élégante.",
    recommendedFor: "Amateurs d'élégance italienne qui veulent essayer l'oud sans engagement.",
    howToWear: "Idéal en couches avec la crème corporelle de la même ligne.",
    origin: { "Reggio Calabria, Italia": "Reggio de Calabre, Italie", "Indonesia": "Indonésie" },
  },
  p14: {
    description: "Une interprétation moderne et artistique de l'oud.",
    story:
      "Oud Immortel est la vision suédoise de l'oud : minimaliste, brumeuse et presque mélancolique. Ben Gorham l'a conçue comme un hommage aux bois éternels qui survivent aux générations.",
    sillageDesc: "Aura proche, presque un secret.",
    projection: "Intime et sophistiquée.",
    recommendedFor: "Pour qui fuit l'évidence et préfère les parfums qui se découvrent en se rapprochant.",
    howToWear: "Une seule vaporisation sur la nuque. Laissez respirer 10 minutes avant de bouger.",
    origin: { "Laboratorios suizos": "Laboratoires suisses", "Egipto": "Égypte" },
  },
  p3: {
    description: "Une interprétation royale et majestueuse de l'oud.",
    story:
      "Royal Oud est l'oud de la royauté selon Creed. Olivier Creed associe bois nobles et agrumes vibrants pour créer un parfum aussi raffiné qu'un costume sur mesure.",
    sillageDesc: "Raffiné mais présent.",
    projection: "Vibrante à l'ouverture, veloutée en fond.",
    recommendedFor: "Pour qui cherche un luxe silencieux avec une touche d'agrumes.",
    howToWear: "Vaporisez à 20 cm sur le torse pour une diffusion homogène.",
    origin: { "Sicilia, Italia": "Sicile, Italie", "Mysore, India": "Mysore, Inde" },
  },
  p8: {
    description: "Le légendaire Aventus, symbole de pouvoir et de réussite.",
    story:
      "Aventus est une légende vivante depuis 2010. Inspirée par la vie de Napoléon Bonaparte, elle incarne force, vision et réussite dans chaque note.",
    sillageDesc: "L'un des sillages les plus reconnaissables au monde.",
    projection: "Fruitée et puissante au départ, fumée au cœur, douce et animale en fond.",
    recommendedFor: "Hommes ambitieux qui veulent un parfum signature reconnaissable.",
    howToWear: "Trois vaporisations : cou, poitrine et avant-bras. L'ananas demande une peau propre.",
    origin: { "Costa de Marfil": "Côte d'Ivoire", "Países Nórdicos": "Pays nordiques" },
  },
  p15: {
    description: "La rose de Damas rencontre l'oud dans cette création sublime.",
    story:
      "Oud Ispahan, dans la Collection Privée Christian Dior, est une rose de Damas embrassée par un oud velouté. Un parfum narcotique, opulent, presque hypnotique.",
    sillageDesc: "Un sillage dense et reconnaissable.",
    projection: "Saturée les premières heures, enivrante jusqu'au bout.",
    recommendedFor: "Pour qui veut porter une rose orientale sans subtilité.",
    howToWear: "Une seule vaporisation suffit. Deux et vous devenez inoubliable.",
    origin: { "Valle de las Rosas, Turquía": "Vallée des Roses, Turquie", "Laos": "Laos" },
  },
  p16: {
    description: "Un parfum addictif au bouquet floral enivrant.",
    story:
      "Fleur Narcotique est devenue un phénomène : un bouquet floral-fruité addictif qui combine pivoine, pêche et musc blanc avec un magnétisme presque dangereux.",
    sillageDesc: "Doux et lumineux, attire les regards.",
    projection: "Brillante, juteuse, romantique.",
    recommendedFor: "Pour qui cherche une fleur moderne avec un clin d'œil fruité.",
    howToWear: "Dans les cheveux, une vaporisation prolonge le sillage pendant des heures.",
    origin: { "Re-creada en laboratorio (la peonía no rinde aceite esencial)": "Recréée en laboratoire (la pivoine ne donne pas d'huile essentielle)", "Acordes Provenza, Francia": "Accords Provence, France" },
  },
  p17: {
    description: "La tradition britannique rencontre le luxe oriental.",
    story:
      "Floris London, parfumeurs de la couronne britannique depuis 1730, proposent un oud civilisé, enveloppé de cachemire et de roses. Une élégance murmurée à la Savile Row.",
    sillageDesc: "Subtil, raffiné, britannique.",
    projection: "Douce et constante.",
    recommendedFor: "Pour ceux qui préfèrent un oud diplomatique.",
    howToWear: "À appliquer sur l'écharpe pour une diffusion très chaleureuse en hiver.",
    origin: { "Grasse, Francia": "Grasse, France", "Bangladesh": "Bangladesh" },
  },
  p18: {
    description: "La maison française rend hommage à l'or liquide de l'Orient.",
    story:
      "Oud Essentiel est la lecture française de l'or liquide : brillante, accessible et signée par la parfumeuse maison de Guerlain. Une invitation à l'oud pour les débutants.",
    sillageDesc: "Chaude et enveloppante.",
    projection: "Soyeuse.",
    recommendedFor: "Pour qui veut un oud sans l'opulence des niches classiques.",
    howToWear: "Se marie avec toute peau et tout vêtement de bureau.",
    origin: { "Indonesia": "Indonésie" },
  },
  p19: {
    description: "Un hommage olfactif à l'esprit aventurier d'Hemingway.",
    story:
      "1899 Hemingway est un hommage à l'année de naissance de l'écrivain : rhum, tabac et cuir recréent l'atmosphère d'une taverne de La Havane au crépuscule.",
    sillageDesc: "Chaud et narratif.",
    projection: "Épicée et enivrante.",
    recommendedFor: "Hommes ayant une bibliothèque personnelle et un goût pour le vintage.",
    howToWear: "Sur la laine ou le tweed, déploie son côté le plus chaleureux.",
    origin: { "Vuelta Abajo, Cuba": "Vuelta Abajo, Cuba" },
  },
  p11: {
    description: "Un oud puissant et addictif pour les amateurs du genre.",
    story:
      "Oud for Greatness est l'oud le plus vendu d'Initio : puissant, lavande épicée et un fond animal magnétique. Pour ceux qui n'ont pas peur de prendre de la place.",
    sillageDesc: "Traverse la pièce et s'installe.",
    projection: "Bestiale pendant les 3 premières heures.",
    recommendedFor: "Pour qui cherche un oud puissant et moderne.",
    howToWear: "Une seule vaporisation. On répète : une.",
    origin: { "Provenza, Francia": "Provence, France", "Camboya": "Cambodge" },
  },
  p20: {
    description: "Une introduction élégante et accessible au monde de l'oud.",
    story:
      "Oud & Bergamot est la porte d'entrée vers l'univers de l'oud selon Jo Malone : agrumée, légère, parfaite à combiner avec d'autres colognes de la maison.",
    sillageDesc: "Proche et élégant.",
    projection: "Légère et lumineuse.",
    recommendedFor: "Pour qui veut explorer l'oud sans engagement.",
    howToWear: "Excellent pour le 'fragrance combining' avec Wood Sage & Sea Salt.",
    origin: { "Calabria, Italia": "Calabre, Italie" },
  },
  p21: {
    description: "Memento Mori — un parfum sombre et gourmand.",
    story:
      "Black Phantom — Memento Mori — arrive dans un flacon orné d'une tête de mort en céramique et promet une expérience baroque : café, rhum et amandes amères dans un coffre doré.",
    sillageDesc: "Gourmand et fumé.",
    projection: "Douce, sombre, addictive.",
    recommendedFor: "Amateurs de gourmands sombres au dramatisme baroque.",
    howToWear: "Sur la clavicule, rayonne de chaleur pendant des heures.",
    origin: { "Etiopía": "Éthiopie" },
  },
  p2: {
    description: "La vision sophistiquée de l'oud par Tom Ford, douce et raffinée.",
    story:
      "Oud Wood est la porte d'entrée vers l'univers de l'oud selon Tom Ford. Lancée en 2007 dans la Private Blend Collection, elle adoucit le bois sauvage avec un santal crémeux et une touche de cardamome pour le rendre cosmopolite et sensuel.",
    sillageDesc: "Proche, élégant, jamais envahissant.",
    projection: "Crémeuse et raffinée du début à la fin.",
    recommendedFor: "Pour qui veut découvrir l'oud sous sa forme la plus polie et portable.",
    howToWear: "Deux vaporisations suffisent : une dans le cou, une sur la poitrine.",
    origin: { "Laos y Vietnam": "Laos et Vietnam", "Nueva Caledonia": "Nouvelle-Calédonie" },
  },
  p4: {
    description: "Un oriental lumineux et complexe basé sur l'oud cambodgien.",
    story:
      "Alexandria II rend hommage à la mythique bibliothèque égyptienne. Sergio Momo construit un oriental opulent avec oud cambodgien, dattes confites et miel, évoquant des couloirs de marbre baignés de lumière dorée.",
    sillageDesc: "Sillage doré qui enveloppe l'air.",
    projection: "Dense, douce et narcotique.",
    recommendedFor: "Pour qui veut porter un oriental de haute parfumerie sans demi-mesure.",
    howToWear: "Une vaporisation sur la nuque ; l'extrait tient toute la journée.",
    origin: { "Camboya": "Cambodge", "Apicultores artesanos italianos": "Apiculteurs artisans italiens" },
  },
  p5: {
    description: "Un oud soyeux enveloppé de violette et de vanille.",
    story:
      "Oud Satin Mood est la lecture la plus soyeuse de l'oud par Francis Kurkdjian : une rose bulgare enveloppée de violette et de vanille qui se pose sur la peau comme un châle de soie.",
    sillageDesc: "Sillage chaud, sensuel, féminin.",
    projection: "Veloutée, douce sans être écœurante.",
    recommendedFor: "Pour qui cherche un oud floral et soyeux, loin des ouds agressifs.",
    howToWear: "À appliquer sur le décolleté pour que vanille et oud se réchauffent avec la peau.",
    origin: { "Valle de Kazanlak, Bulgaria": "Vallée de Kazanlak, Bulgarie", "Madagascar": "Madagascar" },
  },
  p6: {
    description: "Intense, sombre et addictif. Une expérience unique.",
    story:
      "Black Afgano est la signature rebelle de Nasomatto : un accord vert-résineux évoquant tabac haché, café noir et résines épaisses. Une déclaration d'intentions pour qui ne demande pas la permission.",
    sillageDesc: "Sillage dense, reconnaissable à l'instant.",
    projection: "Bestiale les premières heures, hypnotique en fond.",
    recommendedFor: "Amateurs d'extraits denses et sans concession.",
    howToWear: "Une vaporisation. Une seule. Et laissez respirer 15 minutes.",
    origin: { "Asia Central": "Asie centrale", "Mediterráneo": "Méditerranée" },
  },
  p9: {
    description: "Un classique moderne : tabac, vanille et épices chaudes.",
    story:
      "Tobacco Vanille est un classique moderne de la Private Blend. Olivier Gillotin capture un salon de fumeurs victorien : tabac haché, vanille dense, fruits secs et épices douces.",
    sillageDesc: "Gourmand chaleureux et cocooning.",
    projection: "Douce, épicée, réconfortante.",
    recommendedFor: "Pour qui aime les gourmands mûrs au caractère épicé.",
    howToWear: "Sur la laine ou le cachemire, déploie toute sa facette douillette.",
    origin: { "Virginia, EE.UU.": "Virginie, États-Unis", "Madagascar": "Madagascar" },
  },
  p10: {
    description: "Un parfum signature polyvalent jour et nuit.",
    story:
      "Layton porte l'esprit des chevaux de course de la maison royale française : elle s'ouvre sur la pomme fraîche et la lavande pour se poser sur une base orientale crémeuse de vanille et de gaïac.",
    sillageDesc: "Sillage élégant et très reconnaissable.",
    projection: "Fraîche au départ, crémeuse et épicée en fond.",
    recommendedFor: "Pour qui cherche une signature polyvalente jour et nuit.",
    howToWear: "Deux vaporisations dans le cou pour un sillage parfait.",
    origin: { "Provenza, Francia": "Provence, France", "Madagascar": "Madagascar" },
  },
  p12: {
    description: "Le parfum viral qui a conquis le monde.",
    story:
      "Baccarat Rouge 540 est né comme pièce commémorative pour les 250 ans de la cristallerie Baccarat. Un accord ambré-safrané d'une pureté cristalline, aujourd'hui phénomène mondial.",
    sillageDesc: "Sillage lumineux qui remplit les pièces.",
    projection: "Brillante, douce, éthérée.",
    recommendedFor: "Pour qui cherche une signature virale alliant luxe et modernité.",
    howToWear: "Une seule vaporisation sur le vêtement tient pendant des jours.",
    origin: { "Cachemira": "Cachemire", "Atlas, Marruecos": "Atlas, Maroc" },
  },
  p22: {
    description: "La vision brutaliste de l'oud par Le Labo : brut et fumé.",
    story:
      "Oud 27 est la vision brutaliste de Le Labo : un oud cru, fumé et incandescent enveloppé d'encens noir et de bois résineux. Sans compromis, comme toute la maison new-yorkaise.",
    sillageDesc: "Fumé et résineux.",
    projection: "Dense et minérale.",
    recommendedFor: "Pour qui rejette les ouds sucrés et cherche le brut.",
    howToWear: "À appliquer sur la laine ou le cuir pour intensifier la facette fumée.",
    origin: { "Bangladesh y Laos": "Bangladesh et Laos", "Somalia": "Somalie" },
  },
  p23: {
    description: "Une forêt anglaise unique : ciguë, pin et oud.",
    story:
      "Ormonde Man part d'un ingrédient rare : la ciguë. Linda Pilkington construit une forêt enchantée britannique où l'obscurité verte fusionne avec un oud velouté.",
    sillageDesc: "Sillage boisé, presque mystique.",
    projection: "Verte, profonde, légèrement fumée.",
    recommendedFor: "Pour qui apprécie les parfums narratifs et peu conventionnels.",
    howToWear: "Sur peau propre pour mieux capter la ciguë et le vétiver.",
    origin: { "Reconstrucción aromática inglesa": "Reconstitution aromatique anglaise", "Haití": "Haïti" },
  },
  p24: {
    description: "Le multifloral originel de 1912 qui a défini la parfumerie moderne.",
    story:
      "Quelques Fleurs L'Original, lancée en 1912, fut le premier multifloral de l'histoire. Houbigant a capturé un bouquet de quinze fleurs dans une seule formule, posant les bases de la parfumerie moderne.",
    sillageDesc: "Floral classique, raffiné.",
    projection: "Brillante, romantique, intemporelle.",
    recommendedFor: "Amateurs des grands classiques floraux.",
    howToWear: "Une vaporisation dans les cheveux et une sur les poignets.",
    origin: { "Grasse, Francia": "Grasse, France" },
  },
  p25: {
    description: "Roja Dove élève l'oud au rang de joyau — royal et presque sacré.",
    story:
      "Roja Dove élève l'oud au rang de joyau. Aoud combine les bois les plus rares à la rose de Damas et au santal Mysore pour une expérience royale, presque sacrée.",
    sillageDesc: "Sillage majestueux.",
    projection: "Opulente, épicée, profondément luxueuse.",
    recommendedFor: "Pour qui cherche la parfumerie la plus haute et exclusive.",
    howToWear: "Une seule goutte sur le pouls. L'extrait tient une journée entière.",
    origin: { "Assam, India": "Assam, Inde", "Mysore, India": "Mysore, Inde" },
  },
  p26: {
    description: "Un musc animal de culte : sauvage, charnel et magnétique.",
    story:
      "Muscs Koublai Khan est un musc sauvage et animal de culte. Lutens évoque la peau nue et les chevaux de l'empire mongol avec civette, ambre et rose.",
    sillageDesc: "Chaud, charnel, magnétique.",
    projection: "Animale et épicée, profondément sensuelle.",
    recommendedFor: "Amateurs de muscs puissants et sans filtre.",
    howToWear: "Une vaporisation sur peau propre ; le musc fait le reste.",
    origin: { "Reconstrucción sintética (sin animales)": "Reconstitution synthétique (sans animaux)", "Marruecos": "Maroc" },
  },
  p27: {
    description: "Asphalte mouillé, cuir et épices sous la lumière froide des néons.",
    story:
      "Nightscape capture le paysage urbain de New York après la pluie : asphalte mouillé, cuir et épices sous la lumière froide des néons.",
    sillageDesc: "Urbain et discret.",
    projection: "Équilibrée, minimaliste, contemporaine.",
    recommendedFor: "Pour qui apprécie les boisés modernes et architecturaux.",
    howToWear: "Deux vaporisations dans le cou en sortant de chez soi.",
    origin: { "Virginia, EE.UU.": "Virginie, États-Unis", "Haití": "Haïti" },
  },
  p28: {
    description: "Un patchouli lumineux enveloppé de musc blanc et de rose.",
    story:
      "Moonlight Patchouli réinvente le patchouli dans une clé lumineuse : blanchi par musc blanc, rose et vanille, il brille comme la lune sur la soie.",
    sillageDesc: "Raffiné et sensuel.",
    projection: "Lumineuse, légèrement terreuse.",
    recommendedFor: "Pour qui cherche un patchouli élégant, ni hippie ni gothique.",
    howToWear: "À appliquer aux poignets et au cou pour une diffusion équilibrée.",
    origin: { "Indonesia": "Indonésie", "Turquía": "Turquie" },
  },
  p29: {
    description: "Haute parfumerie émirienne : oud rare, encens d'Oman et roses.",
    story:
      "Black III appartient à la trilogie noire de Widian : haute parfumerie émirienne avec les ouds les plus sélectionnés, l'encens d'Oman et des roses rares. Un joyau liquide embouteillé comme tel.",
    sillageDesc: "Sillage arabe imposant.",
    projection: "Épicée, royale, profondément orientale.",
    recommendedFor: "Pour qui veut vivre la haute parfumerie arabe sans filtre.",
    howToWear: "Une vaporisation sur la nuque ; l'extrait suffit largement.",
    origin: { "Camboya": "Cambodge", "Dhofar, Omán": "Dhofar, Oman" },
  },
  p30: {
    description: "L'oud pionnier qui a ouvert la voie à toute une génération.",
    story:
      "M7 fut révolutionnaire en 2002 : Tom Ford, alors directeur créatif d'YSL, introduisait l'oud dans la parfumerie mainstream. La version Oud Absolu intensifie cette vision pionnière.",
    sillageDesc: "Chaude et reconnaissable.",
    projection: "Agrumée au départ, résineuse et profonde ensuite.",
    recommendedFor: "Pour qui veut connaître l'oud qui a ouvert la voie à toute une génération.",
    howToWear: "Trois vaporisations sur le torse pour compenser la concentration EDT.",
    origin: { "Marruecos": "Maroc", "Etiopía": "Éthiopie" },
  },
  p31: {
    description: "Une recréation artistique 100 % végane de la légendaire note de civette.",
    story:
      "Civet de Zoologist est une recréation artistique (100 % végane) du mythique ingrédient animal. Un parfum conceptuel qui combine civette synthétique, fleurs blanches et muscs crémeux.",
    sillageDesc: "Charnel, floral et magnétique.",
    projection: "Sensuelle, légèrement sauvage.",
    recommendedFor: "Pour qui cherche une expérience olfactive conceptuelle et différente.",
    howToWear: "Une seule vaporisation sur le pouls. La civette amplifie tout.",
    origin: { "Reconstrucción sintética cruelty-free": "Reconstitution synthétique cruelty-free", "India": "Inde" },
  },
}

const I18N_BY_LANG: Record<Lang, Record<string, PerfumeTextI18n>> = {
  ES: {},
  EN: I18N_EN,
  FR: I18N_FR,
}

export function getPerfumeI18n(id: string, lang: Lang): PerfumeTextI18n {
  return I18N_BY_LANG[lang]?.[id] ?? {}
}

/** Devuelve un Perfume con campos traducidos al idioma activo. */
export function localizePerfume(p: Perfume, lang: Lang): Perfume {
  if (lang === "ES") return p
  const t = getPerfumeI18n(p.id, lang)
  return {
    ...p,
    notes: tTerms(p.notes, lang),
    description: t.description ?? p.description,
    category: tTerm(p.category, lang),
  }
}

/** Traduce un texto que es la *concatenación* de varias notas para fallback. */
export function tList(items: string[], lang: Lang): string[] {
  return items.map((i) => tTerm(i, lang))
}

/** Traduce el origen libre (ciudad/país). Cae al original si no hay match. */
export function tOrigin(id: string, originES: string, lang: Lang): string {
  if (lang === "ES") return originES
  const map = getPerfumeI18n(id, lang).origin
  return map?.[originES] ?? originES
}

export function tStory(id: string, fallback: string, lang: Lang): string {
  if (lang === "ES") return fallback
  return getPerfumeI18n(id, lang).story ?? fallback
}
export function tSillageDesc(id: string, fallback: string, lang: Lang): string {
  if (lang === "ES") return fallback
  return getPerfumeI18n(id, lang).sillageDesc ?? fallback
}
export function tProjection(id: string, fallback: string, lang: Lang): string {
  if (lang === "ES") return fallback
  return getPerfumeI18n(id, lang).projection ?? fallback
}
export function tRecommendedFor(id: string, fallback: string, lang: Lang): string {
  if (lang === "ES") return fallback
  return getPerfumeI18n(id, lang).recommendedFor ?? fallback
}
export function tHowToWear(id: string, fallback: string, lang: Lang): string {
  if (lang === "ES") return fallback
  return getPerfumeI18n(id, lang).howToWear ?? fallback
}