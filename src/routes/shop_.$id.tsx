import { createFileRoute } from "@tanstack/react-router";

import { useParams, useRouter } from "@/lib/next-shim"
import { Header } from "@/components/header"
import { MobileMenu } from "@/components/mobile-menu"
import { CartSidebar } from "@/components/cart-sidebar"
import { Footer } from "@/components/footer"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { GuestRestrictionModal } from "@/components/guest-restriction-modal"
import { Button } from "@/components/ui/button"
import { useAppStore, type Perfume } from "@/lib/store"
import {
  Star,
  ShoppingCart,
  Heart,
  ArrowLeft,
  Share2,
  Package,
  Truck,
  Shield,
  ChevronRight,
  Clock,
  Wind,
  Sparkles,
  User as UserIcon,
  Calendar,
  Droplet,
  Flame,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import Link from "@/lib/next-shim"
import { useT } from "@/lib/i18n"
import {
  localizePerfume,
  tTerm,
  tTerms,
  tStory,
  tSillageDesc,
  tProjection,
  tRecommendedFor,
  tHowToWear,
  tOrigin,
  type Lang,
} from "@/lib/perfumes-i18n"

interface PerfumeDetail {
  story: string
  perfumer: string
  year: number
  concentration: string
  gender: "Masculino" | "Femenino" | "Unisex"
  pyramid: { top: string[]; heart: string[]; base: string[] }
  longevity: { label: string; hours: string }
  sillage: { label: string; description: string }
  projection: string
  season: string[]
  occasions: string[]
  recommendedFor: string
  howToWear: string
  ingredientsOrigin: { ingredient: string; origin: string }[]
}

// Información creada específicamente para cada fragancia.
// Si una fragancia no aparece aquí, se genera contenido derivado de sus notas y marca.
const detailsById: Record<string, PerfumeDetail> = {
  p1: {
    story:
      "Interlude Man nace en 2012 como un manifiesto del caos olfativo. Amouage quiso capturar el ruido interior del hombre moderno: una tormenta de incienso, especias y oud que se asienta lentamente sobre la piel hasta convertirse en una calma ambarada.",
    perfumer: "Pierre Negrin",
    year: 2012,
    concentration: "Eau de Parfum",
    gender: "Masculino",
    pyramid: {
      top: ["Bergamota", "Orégano", "Pimienta Negra"],
      heart: ["Incienso", "Ámbar", "Cisto Labdanum"],
      base: ["Oud", "Cuero", "Sándalo", "Pachulí"],
    },
    longevity: { label: "Eterna", hours: "10–12 h" },
    sillage: { label: "Enorme", description: "Llena la habitación en minutos." },
    projection: "Alta los primeros 90 minutos, luego se vuelve íntima.",
    season: ["Otoño", "Invierno"],
    occasions: ["Veladas formales", "Cenas de gala", "Eventos nocturnos"],
    recommendedFor: "Hombres seguros que buscan dejar huella sin decir una palabra.",
    howToWear:
      "Dos pulverizaciones bastan: una en el cuello y otra en la muñeca. Más es una declaración de guerra.",
    ingredientsOrigin: [
      { ingredient: "Oud", origin: "Assam, India" },
      { ingredient: "Incienso", origin: "Dhofar, Omán" },
      { ingredient: "Labdanum", origin: "Andalucía, España" },
    ],
  },
  p7: {
    story:
      "Jubilation XXV celebra el 25 aniversario de Amouage. Es una sinfonía oriental con miel, mirra e incienso que evoca un templo dorado al amanecer.",
    perfumer: "Bertrand Duchaufour",
    year: 2007,
    concentration: "Eau de Parfum",
    gender: "Masculino",
    pyramid: {
      top: ["Bergamota", "Pimienta Rosa", "Naranja Sanguina", "Davana"],
      heart: ["Incienso", "Mirra", "Cilantro", "Miel"],
      base: ["Oud", "Ámbar", "Pachulí", "Musgo de Roble"],
    },
    longevity: { label: "Excelente", hours: "9–11 h" },
    sillage: { label: "Notable", description: "Estela cálida y reconocible." },
    projection: "Densa al inicio, melosa al final.",
    season: ["Otoño", "Invierno"],
    occasions: ["Cenas elegantes", "Reuniones de negocios nocturnas"],
    recommendedFor: "Quien aprecia los orientales clásicos con un giro contemporáneo.",
    howToWear: "Aplicar sobre piel hidratada para potenciar las notas melosas.",
    ingredientsOrigin: [
      { ingredient: "Miel", origin: "Apicultores tradicionales de Omán" },
      { ingredient: "Mirra", origin: "Etiopía" },
    ],
  },
  p13: {
    story:
      "Acqua di Parma reinterpreta el espíritu mediterráneo a través de un oud sorprendentemente luminoso. Colonia Oud es la chispa cítrica italiana abrazada por las maderas preciosas de Oriente.",
    perfumer: "Françoise Caron",
    year: 2012,
    concentration: "Eau de Cologne Concentrée",
    gender: "Unisex",
    pyramid: {
      top: ["Bergamota de Calabria", "Limón", "Petitgrain"],
      heart: ["Rosa", "Cuero", "Cardamomo"],
      base: ["Oud", "Ámbar", "Sándalo"],
    },
    longevity: { label: "Buena", hours: "7–9 h" },
    sillage: { label: "Moderada", description: "Refinada, nunca invasiva." },
    projection: "Equilibrada y elegante.",
    season: ["Todo el año"],
    occasions: ["Oficina", "Citas", "Aperitivos"],
    recommendedFor: "Amantes de la elegancia italiana que quieren probar el oud sin compromiso.",
    howToWear: "Ideal en capas con la crema corporal de la misma línea.",
    ingredientsOrigin: [
      { ingredient: "Bergamota", origin: "Reggio Calabria, Italia" },
      { ingredient: "Oud", origin: "Indonesia" },
    ],
  },
  p14: {
    story:
      "Oud Immortel es la visión sueca del oud: minimalista, brumoso y casi melancólica. Ben Gorham la concibió como un homenaje a las maderas eternas que sobreviven a generaciones.",
    perfumer: "Jérôme Epinette",
    year: 2008,
    concentration: "Eau de Parfum",
    gender: "Unisex",
    pyramid: {
      top: ["Papiro", "Limón", "Incienso"],
      heart: ["Cuero", "Oud", "Almizcle"],
      base: ["Pachulí", "Musgo", "Maderas Negras"],
    },
    longevity: { label: "Muy buena", hours: "8–10 h" },
    sillage: { label: "Discreta", description: "Aura cercana, casi un secreto." },
    projection: "Íntima y sofisticada.",
    season: ["Otoño", "Invierno", "Primavera fría"],
    occasions: ["Uso diario", "Reuniones creativas", "Lecturas largas"],
    recommendedFor: "Quien rehúye lo evidente y prefiere los perfumes que se descubren al acercarse.",
    howToWear: "Una sola pulverización en la nuca. Deja que respire 10 minutos antes de moverte.",
    ingredientsOrigin: [
      { ingredient: "Oud sintético de alta calidad", origin: "Laboratorios suizos" },
      { ingredient: "Papiro", origin: "Egipto" },
    ],
  },
  p3: {
    story:
      "Royal Oud es el oud de la realeza según Creed. Olivier Creed mezcla maderas nobles con cítricos vibrantes para crear una fragancia que se siente como vestir un traje hecho a medida.",
    perfumer: "Olivier Creed",
    year: 2011,
    concentration: "Eau de Parfum",
    gender: "Unisex",
    pyramid: {
      top: ["Limón Siciliano", "Pomelo Rosa", "Pimienta Rosa"],
      heart: ["Oud", "Galbano", "Angelica"],
      base: ["Cedro de Virginia", "Sándalo", "Almizcle Blanco"],
    },
    longevity: { label: "Excelente", hours: "9–11 h" },
    sillage: { label: "Notable", description: "Refinada pero presente." },
    projection: "Vibrante en la apertura, aterciopelada en el fondo.",
    season: ["Primavera", "Otoño"],
    occasions: ["Eventos formales", "Cenas de trabajo", "Bodas"],
    recommendedFor: "Quien busca lujo silencioso con un toque de frescura cítrica.",
    howToWear: "Pulveriza a 20 cm sobre el torso para una difusión homogénea.",
    ingredientsOrigin: [
      { ingredient: "Limón", origin: "Sicilia, Italia" },
      { ingredient: "Sándalo", origin: "Mysore, India" },
    ],
  },
  p8: {
    story:
      "Aventus es leyenda viva desde 2010. Inspirada en la vida de Napoleón Bonaparte, encarna fuerza, visión y éxito en cada nota.",
    perfumer: "Erwin Creed y Olivier Creed",
    year: 2010,
    concentration: "Eau de Parfum",
    gender: "Masculino",
    pyramid: {
      top: ["Piña", "Bergamota", "Grosella Negra", "Manzana"],
      heart: ["Abedul", "Pachulí", "Jazmín marroquí", "Rosa"],
      base: ["Musgo de Roble", "Almizcle", "Vainilla", "Ámbar Gris"],
    },
    longevity: { label: "Excelente", hours: "9–12 h" },
    sillage: { label: "Enorme", description: "Una de las estelas más reconocibles del mundo." },
    projection: "Frutal y poderosa al inicio, ahumada en el corazón, dulce y animal en el fondo.",
    season: ["Primavera", "Verano", "Otoño"],
    occasions: ["Trabajo", "Citas", "Cualquier momento donde quieras destacar"],
    recommendedFor: "Hombres ambiciosos que quieren un perfume firma reconocible.",
    howToWear: "Tres pulverizaciones: cuello, pecho y antebrazo. La piña pide piel limpia.",
    ingredientsOrigin: [
      { ingredient: "Piña", origin: "Costa de Marfil" },
      { ingredient: "Abedul", origin: "Países Nórdicos" },
    ],
  },
  p15: {
    story:
      "Oud Ispahan, parte de la Collection Privée Christian Dior, es una rosa de Damasco abrazada por un oud aterciopelado. Una fragancia narcótica, opulenta, casi hipnótica.",
    perfumer: "François Demachy",
    year: 2012,
    concentration: "Eau de Parfum",
    gender: "Unisex",
    pyramid: {
      top: ["Rosa de Damasco", "Azafrán"],
      heart: ["Oud", "Pachulí", "Sándalo"],
      base: ["Labdanum", "Ámbar", "Bencina"],
    },
    longevity: { label: "Eterna", hours: "10–14 h" },
    sillage: { label: "Enorme", description: "Una estela densa y reconocible." },
    projection: "Saturada las primeras horas, embriagadora hasta el final.",
    season: ["Otoño", "Invierno"],
    occasions: ["Veladas íntimas", "Galas", "Bodas"],
    recommendedFor: "Quien quiera vestir una rosa oriental sin sutilezas.",
    howToWear: "Una sola pulverización es suficiente. Dos, y eres inolvidable.",
    ingredientsOrigin: [
      { ingredient: "Rosa de Damasco", origin: "Valle de las Rosas, Turquía" },
      { ingredient: "Oud", origin: "Laos" },
    ],
  },
  p16: {
    story:
      "Fleur Narcotique se ha convertido en un fenómeno: un bouquet floral-afrutado adictivo que combina peonía, melocotón y almizcle blanco con un magnetismo casi peligroso.",
    perfumer: "Quentin Bisch",
    year: 2013,
    concentration: "Eau de Parfum",
    gender: "Unisex",
    pyramid: {
      top: ["Bergamota", "Mandarina", "Lichi"],
      heart: ["Peonía", "Jazmín", "Rosa"],
      base: ["Melocotón", "Almizcle Blanco", "Musgo de Roble"],
    },
    longevity: { label: "Muy buena", hours: "8–10 h" },
    sillage: { label: "Notable", description: "Dulce y luminosa, atrapa miradas." },
    projection: "Brillante, jugosa, romántica.",
    season: ["Primavera", "Verano"],
    occasions: ["Citas diurnas", "Bodas de día", "Brunch"],
    recommendedFor: "Quien busca una flor moderna con un guiño afrutado.",
    howToWear: "En el pelo, una pulverización potencia la estela durante horas.",
    ingredientsOrigin: [
      { ingredient: "Peonía", origin: "Re-creada en laboratorio (la peonía no rinde aceite esencial)" },
      { ingredient: "Melocotón", origin: "Acordes Provenza, Francia" },
    ],
  },
  p17: {
    story:
      "Floris London, perfumistas de la corona británica desde 1730, propone un oud civilizado, envuelto en cachemira y rosas. Una elegancia susurrada al estilo Savile Row.",
    perfumer: "Shyamala Maisondieu",
    year: 2017,
    concentration: "Eau de Parfum",
    gender: "Unisex",
    pyramid: {
      top: ["Pimienta Rosa", "Cardamomo"],
      heart: ["Rosa Centifolia", "Cachemira", "Iris"],
      base: ["Oud", "Sándalo", "Almizcle"],
    },
    longevity: { label: "Buena", hours: "7–9 h" },
    sillage: { label: "Moderada", description: "Sutil, refinada, británica." },
    projection: "Suave y constante.",
    season: ["Otoño", "Invierno"],
    occasions: ["Reuniones formales", "Ópera", "Tardes en el club"],
    recommendedFor: "Caballeros y damas que prefieren un oud diplomático.",
    howToWear: "Aplica sobre la bufanda para una difusión calidísima en invierno.",
    ingredientsOrigin: [
      { ingredient: "Rosa Centifolia", origin: "Grasse, Francia" },
      { ingredient: "Oud", origin: "Bangladesh" },
    ],
  },
  p18: {
    story:
      "Oud Essentiel es la lectura francesa del oro líquido: brillante, accesible y firmada por la perfumista interna de Guerlain. Una invitación al oud para quien empieza.",
    perfumer: "Thierry Wasser y Delphine Jelk",
    year: 2018,
    concentration: "Eau de Parfum",
    gender: "Unisex",
    pyramid: {
      top: ["Pimienta Rosa", "Limón"],
      heart: ["Rosa", "Incienso"],
      base: ["Oud", "Ámbar", "Vainilla"],
    },
    longevity: { label: "Buena", hours: "7–9 h" },
    sillage: { label: "Moderada", description: "Cálida y envolvente." },
    projection: "Sedosa.",
    season: ["Otoño", "Invierno"],
    occasions: ["Uso diario", "Cenas casuales"],
    recommendedFor: "Quien quiera un oud sin la opulencia de los nicho clásicos.",
    howToWear: "Combina con cualquier piel y ropa de oficina.",
    ingredientsOrigin: [{ ingredient: "Oud", origin: "Indonesia" }],
  },
  p19: {
    story:
      "1899 Hemingway es un homenaje al año de nacimiento del escritor: ron, tabaco y cuero recrean la atmósfera de una taberna habanera al ocaso.",
    perfumer: "Gerald Ghislain",
    year: 2001,
    concentration: "Eau de Parfum",
    gender: "Masculino",
    pyramid: {
      top: ["Pimienta Negra", "Anís", "Bergamota"],
      heart: ["Tabaco", "Ron", "Canela"],
      base: ["Cuero", "Cedro", "Vainilla"],
    },
    longevity: { label: "Excelente", hours: "9–11 h" },
    sillage: { label: "Notable", description: "Cálida y narrativa." },
    projection: "Especiada y embriagadora.",
    season: ["Otoño", "Invierno"],
    occasions: ["Bares de jazz", "Cenas con whisky", "Lecturas de invierno"],
    recommendedFor: "Hombres con biblioteca personal y gusto por lo añejo.",
    howToWear: "Sobre lana o tweed despliega su lado más cálido.",
    ingredientsOrigin: [{ ingredient: "Tabaco", origin: "Vuelta Abajo, Cuba" }],
  },
  p11: {
    story:
      "Oud for Greatness es el oud más vendido de Initio: potente, lavanda especiada y un fondo animal magnético. Para quienes no temen ocupar espacio.",
    perfumer: "Maria Suba",
    year: 2018,
    concentration: "Eau de Parfum",
    gender: "Unisex",
    pyramid: {
      top: ["Lavanda", "Azafrán", "Nuez Moscada"],
      heart: ["Oud", "Pachulí"],
      base: ["Almizcle", "Musgo"],
    },
    longevity: { label: "Eterna", hours: "10–14 h" },
    sillage: { label: "Enorme", description: "Atraviesa la habitación y se queda." },
    projection: "Bestial las primeras 3 horas.",
    season: ["Otoño", "Invierno"],
    occasions: ["Noches de invierno", "Eventos donde quieras ser recordado"],
    recommendedFor: "Quien busca un oud potente y moderno.",
    howToWear: "Una sola pulverización. Repetimos: una.",
    ingredientsOrigin: [
      { ingredient: "Lavanda", origin: "Provenza, Francia" },
      { ingredient: "Oud", origin: "Camboya" },
    ],
  },
  p20: {
    story:
      "Oud & Bergamot es la puerta de entrada al universo del oud según Jo Malone: cítrica, ligera, perfecta para combinar con otras colonias de la casa.",
    perfumer: "Christine Nagel",
    year: 2010,
    concentration: "Cologne Intense",
    gender: "Unisex",
    pyramid: {
      top: ["Bergamota", "Limón"],
      heart: ["Oud"],
      base: ["Cedro"],
    },
    longevity: { label: "Buena", hours: "6–8 h" },
    sillage: { label: "Discreta", description: "Cercana y elegante." },
    projection: "Ligera y luminosa.",
    season: ["Primavera", "Verano", "Otoño"],
    occasions: ["Uso diario", "Oficina"],
    recommendedFor: "Quien quiera explorar el oud sin compromiso.",
    howToWear: "Excelente para hacer 'fragrance combining' con Wood Sage & Sea Salt.",
    ingredientsOrigin: [{ ingredient: "Bergamota", origin: "Calabria, Italia" }],
  },
  p21: {
    story:
      "Black Phantom — Memento Mori — viene en una botella con calavera de cerámica y promete una experiencia barroca: café, ron y almendras amargas en un cofre dorado.",
    perfumer: "Sidonie Lancesseur",
    year: 2017,
    concentration: "Eau de Parfum",
    gender: "Unisex",
    pyramid: {
      top: ["Caña de Azúcar", "Almendra Amarga"],
      heart: ["Café", "Ron"],
      base: ["Vainilla", "Sándalo", "Pachulí"],
    },
    longevity: { label: "Excelente", hours: "9–11 h" },
    sillage: { label: "Notable", description: "Gourmand y ahumada." },
    projection: "Dulce, oscura, adictiva.",
    season: ["Otoño", "Invierno"],
    occasions: ["Citas nocturnas", "Cenas íntimas"],
    recommendedFor: "Amantes de los gourmands oscuros con dramatismo barroco.",
    howToWear: "Sobre la clavícula, irradia calor durante horas.",
    ingredientsOrigin: [{ ingredient: "Café", origin: "Etiopía" }],
  },
  p2: {
    story:
      "Oud Wood es la puerta de entrada al universo del oud según Tom Ford. Lanzada en 2007 dentro de la Private Blend Collection, suaviza la madera salvaje con sándalo cremoso y un toque de cardamomo para volverla cosmopolita y sensual.",
    perfumer: "Richard Herpin",
    year: 2007,
    concentration: "Eau de Parfum",
    gender: "Unisex",
    pyramid: {
      top: ["Cardamomo", "Pimienta Rosa", "Palo de Rosa Brasileño"],
      heart: ["Oud", "Sándalo", "Palo de Oud Chino"],
      base: ["Vetiver", "Ámbar", "Vainilla", "Almizcle"],
    },
    longevity: { label: "Muy buena", hours: "8–10 h" },
    sillage: { label: "Moderada", description: "Cercana, elegante, jamás invasiva." },
    projection: "Cremosa y refinada de principio a fin.",
    season: ["Otoño", "Invierno", "Primavera fresca"],
    occasions: ["Cenas elegantes", "Reuniones de negocios", "Bodas"],
    recommendedFor: "Quien quiere descubrir el oud en su forma más pulida y vestible.",
    howToWear: "Dos pulverizaciones bastan: una en el cuello, otra en el pecho.",
    ingredientsOrigin: [
      { ingredient: "Oud", origin: "Laos y Vietnam" },
      { ingredient: "Sándalo", origin: "Nueva Caledonia" },
    ],
  },
  p4: {
    story:
      "Alexandria II rinde tributo a la mítica biblioteca egipcia. Sergio Momo construye un oriental opulento con oud camboyano, dátiles confitados y miel, evocando los pasillos de mármol bañados por luz dorada.",
    perfumer: "Chris Maurice",
    year: 2011,
    concentration: "Extrait de Parfum",
    gender: "Unisex",
    pyramid: {
      top: ["Bergamota", "Lavanda", "Dátil"],
      heart: ["Miel", "Vainilla", "Azafrán", "Rosa"],
      base: ["Oud Camboyano", "Ámbar", "Benjuí", "Sándalo"],
    },
    longevity: { label: "Eterna", hours: "10–14 h" },
    sillage: { label: "Enorme", description: "Estela dorada que envuelve el aire." },
    projection: "Densa, dulce y narcótica.",
    season: ["Otoño", "Invierno"],
    occasions: ["Galas", "Veladas íntimas", "Eventos memorables"],
    recommendedFor: "Quien quiera vestir un oriental de alta perfumería sin medias tintas.",
    howToWear: "Una pulverización en la nuca; el extracto rinde durante todo el día.",
    ingredientsOrigin: [
      { ingredient: "Oud", origin: "Camboya" },
      { ingredient: "Miel", origin: "Apicultores artesanos italianos" },
    ],
  },
  p5: {
    story:
      "Oud Satin Mood es la lectura más sedosa del oud por Francis Kurkdjian: una rosa búlgara envuelta en violeta y vainilla que se posa sobre la piel como un chal de seda.",
    perfumer: "Francis Kurkdjian",
    year: 2015,
    concentration: "Eau de Parfum",
    gender: "Unisex",
    pyramid: {
      top: ["Violeta", "Nuez Moscada"],
      heart: ["Rosa de Bulgaria", "Rosa de Turquía"],
      base: ["Oud", "Vainilla de Madagascar", "Benjuí"],
    },
    longevity: { label: "Muy buena", hours: "8–10 h" },
    sillage: { label: "Notable", description: "Estela cálida, sensual, femenina." },
    projection: "Aterciopelada, dulce sin empalagar.",
    season: ["Otoño", "Invierno"],
    occasions: ["Citas nocturnas", "Cenas a la luz de las velas"],
    recommendedFor: "Quien busque un oud floral y sedoso, lejos de los oud agresivos.",
    howToWear: "Aplica en el escote para que la vainilla y el oud se calienten con la piel.",
    ingredientsOrigin: [
      { ingredient: "Rosa", origin: "Valle de Kazanlak, Bulgaria" },
      { ingredient: "Vainilla", origin: "Madagascar" },
    ],
  },
  p6: {
    story:
      "Black Afgano es la firma rebelde de Nasomatto: un acorde verde-resinoso que evoca tabaco picado, café oscuro y resinas espesas. Una declaración de intenciones para quien no busca permiso.",
    perfumer: "Alessandro Gualtieri",
    year: 2009,
    concentration: "Extrait de Parfum",
    gender: "Unisex",
    pyramid: {
      top: ["Notas Verdes", "Café"],
      heart: ["Cannabis", "Resinas"],
      base: ["Oud", "Tabaco", "Incienso"],
    },
    longevity: { label: "Eterna", hours: "12+ h" },
    sillage: { label: "Enorme", description: "Estela densa y reconocible al instante." },
    projection: "Bestial las primeras horas, hipnótica en el fondo.",
    season: ["Otoño", "Invierno"],
    occasions: ["Noches subterráneas", "Eventos donde quieras provocar"],
    recommendedFor: "Amantes de los extractos densos y sin concesiones.",
    howToWear: "Una pulverización. Solo una. Y deja que respire 15 minutos.",
    ingredientsOrigin: [
      { ingredient: "Resinas", origin: "Asia Central" },
      { ingredient: "Tabaco", origin: "Mediterráneo" },
    ],
  },
  p9: {
    story:
      "Tobacco Vanille es un clásico moderno de la Private Blend. Olivier Gillotin captura una sala de fumadores victoriana: tabaco picado, vainilla densa, frutos secos y especias dulces.",
    perfumer: "Olivier Gillotin",
    year: 2007,
    concentration: "Eau de Parfum",
    gender: "Unisex",
    pyramid: {
      top: ["Hoja de Tabaco", "Especias"],
      heart: ["Flor de Tabaco", "Vainilla", "Cacao", "Fruta del Tonka"],
      base: ["Frutos Secos", "Tonka", "Madera Seca"],
    },
    longevity: { label: "Excelente", hours: "9–12 h" },
    sillage: { label: "Notable", description: "Gourmand cálido y abrigado." },
    projection: "Dulce, especiada, reconfortante.",
    season: ["Otoño", "Invierno"],
    occasions: ["Sobremesas largas", "Veladas con whisky", "Citas íntimas"],
    recommendedFor: "Quien ame los gourmand maduros con carácter especiado.",
    howToWear: "Sobre lana o cachemira despliega toda su faceta abrigada.",
    ingredientsOrigin: [
      { ingredient: "Tabaco", origin: "Virginia, EE.UU." },
      { ingredient: "Vainilla", origin: "Madagascar" },
    ],
  },
  p10: {
    story:
      "Layton lleva el espíritu de los caballos de carrera de la casa real francesa: empieza con manzana fresca y lavanda, y se asienta sobre una base oriental cremosa de vainilla y guayaco.",
    perfumer: "Hamid Merati-Kashani",
    year: 2016,
    concentration: "Eau de Parfum",
    gender: "Masculino",
    pyramid: {
      top: ["Manzana", "Bergamota", "Mandarina", "Lavanda"],
      heart: ["Geranio", "Violeta", "Jazmín", "Cardamomo"],
      base: ["Vainilla", "Sándalo", "Guayaco", "Pachulí", "Almizcle"],
    },
    longevity: { label: "Excelente", hours: "9–11 h" },
    sillage: { label: "Enorme", description: "Estela elegante y muy reconocible." },
    projection: "Fresca al inicio, cremosa y especiada en el fondo.",
    season: ["Otoño", "Invierno", "Primavera"],
    occasions: ["Oficina", "Cenas", "Citas"],
    recommendedFor: "Quien busque un firma versátil de día y noche.",
    howToWear: "Dos pulverizaciones en el cuello para una estela perfecta.",
    ingredientsOrigin: [
      { ingredient: "Lavanda", origin: "Provenza, Francia" },
      { ingredient: "Vainilla", origin: "Madagascar" },
    ],
  },
  p12: {
    story:
      "Baccarat Rouge 540 nació como pieza conmemorativa para los 250 años de la cristalería Baccarat. Un acorde ambarado-azafranado de cristalina pureza, hoy fenómeno mundial.",
    perfumer: "Francis Kurkdjian",
    year: 2015,
    concentration: "Eau de Parfum",
    gender: "Unisex",
    pyramid: {
      top: ["Azafrán", "Jazmín"],
      heart: ["Ámbar Gris", "Madera de Cedro"],
      base: ["Resinas", "Almizcle Blanco"],
    },
    longevity: { label: "Excelente", hours: "9–12 h" },
    sillage: { label: "Enorme", description: "Estela luminosa que llena estancias." },
    projection: "Brillante, dulce, etérea.",
    season: ["Todo el año"],
    occasions: ["Cualquier ocasión, día o noche"],
    recommendedFor: "Quien busque una firma viral que combine lujo y modernidad.",
    howToWear: "Una sola pulverización en la ropa rinde durante días.",
    ingredientsOrigin: [
      { ingredient: "Azafrán", origin: "Cachemira" },
      { ingredient: "Cedro", origin: "Atlas, Marruecos" },
    ],
  },
  p22: {
    story:
      "Oud 27 es la visión brutalista de Le Labo: un oud crudo, ahumado e incandescente envuelto en incienso negro y maderas resinosas. Sin compromisos, como toda la casa neoyorquina.",
    perfumer: "Annick Menardo",
    year: 2009,
    concentration: "Eau de Parfum",
    gender: "Unisex",
    pyramid: {
      top: ["Pimienta Negra", "Azafrán"],
      heart: ["Oud", "Incienso Negro"],
      base: ["Ciprés", "Cedro", "Pachulí"],
    },
    longevity: { label: "Excelente", hours: "9–11 h" },
    sillage: { label: "Notable", description: "Ahumada y resinosa." },
    projection: "Densa y mineral.",
    season: ["Otoño", "Invierno"],
    occasions: ["Galerías de arte", "Cenas íntimas", "Noches de invierno"],
    recommendedFor: "Quien rechace los oud edulcorados y busque lo crudo.",
    howToWear: "Aplica sobre lana o cuero para potenciar la faceta ahumada.",
    ingredientsOrigin: [
      { ingredient: "Oud", origin: "Bangladesh y Laos" },
      { ingredient: "Incienso", origin: "Somalia" },
    ],
  },
  p23: {
    story:
      "Ormonde Man parte de un ingrediente raro: la cicuta. Linda Pilkington construye un bosque encantado británico donde la oscuridad verde se funde con un oud aterciopelado.",
    perfumer: "Geza Schoen",
    year: 2004,
    concentration: "Eau de Parfum",
    gender: "Masculino",
    pyramid: {
      top: ["Bergamota", "Cardamomo", "Pimienta Negra"],
      heart: ["Cicuta", "Pino", "Rosa Negra"],
      base: ["Vetiver", "Cedro", "Oud", "Almizcle"],
    },
    longevity: { label: "Muy buena", hours: "8–10 h" },
    sillage: { label: "Moderada", description: "Estela boscosa, casi mística." },
    projection: "Verde, profunda, ligeramente ahumada.",
    season: ["Otoño", "Invierno"],
    occasions: ["Paseos por el bosque", "Cenas creativas", "Eventos discretos"],
    recommendedFor: "Quien aprecie las fragancias narrativas y poco convencionales.",
    howToWear: "Sobre piel limpia para captar mejor la cicuta y el vetiver.",
    ingredientsOrigin: [
      { ingredient: "Cicuta", origin: "Reconstrucción aromática inglesa" },
      { ingredient: "Vetiver", origin: "Haití" },
    ],
  },
  p24: {
    story:
      "Quelques Fleurs L'Original, lanzada en 1912, fue el primer multifloral de la historia. Houbigant capturó un ramo de quince flores en una sola fórmula, sentando las bases de la perfumería moderna.",
    perfumer: "Robert Bienaimé",
    year: 1912,
    concentration: "Eau de Parfum",
    gender: "Femenino",
    pyramid: {
      top: ["Bergamota", "Limón", "Cilantro"],
      heart: ["Rosa", "Jazmín", "Lirio del Valle", "Tuberosa", "Violeta"],
      base: ["Almizcle", "Sándalo", "Vainilla", "Ámbar"],
    },
    longevity: { label: "Buena", hours: "7–9 h" },
    sillage: { label: "Moderada", description: "Floral clásico, refinado." },
    projection: "Brillante, romántica, atemporal.",
    season: ["Primavera", "Verano"],
    occasions: ["Bodas", "Brunch", "Citas diurnas"],
    recommendedFor: "Amantes de los grandes clásicos florales.",
    howToWear: "Una pulverización en el pelo y otra en las muñecas.",
    ingredientsOrigin: [
      { ingredient: "Rosa", origin: "Grasse, Francia" },
      { ingredient: "Jazmín", origin: "Grasse, Francia" },
    ],
  },
  p25: {
    story:
      "Roja Dove eleva el oud a categoría de joya. Aoud combina las maderas más raras con rosa de Damasco y sándalo Mysore para una experiencia regia, casi sagrada.",
    perfumer: "Roja Dove",
    year: 2010,
    concentration: "Extrait de Parfum",
    gender: "Unisex",
    pyramid: {
      top: ["Bergamota", "Limón", "Pimienta Rosa"],
      heart: ["Rosa de Damasco", "Jazmín", "Azafrán"],
      base: ["Oud", "Sándalo Mysore", "Ámbar", "Almizcle"],
    },
    longevity: { label: "Eterna", hours: "12+ h" },
    sillage: { label: "Enorme", description: "Estela majestuosa." },
    projection: "Opulenta, especiada, profundamente lujosa.",
    season: ["Otoño", "Invierno"],
    occasions: ["Eventos de gala", "Bodas reales", "Veladas exclusivas"],
    recommendedFor: "Quien busque la perfumería más alta y exclusiva.",
    howToWear: "Una sola gota en el pulso. El extracto rinde un día entero.",
    ingredientsOrigin: [
      { ingredient: "Oud", origin: "Assam, India" },
      { ingredient: "Sándalo", origin: "Mysore, India" },
    ],
  },
  p26: {
    story:
      "Muscs Koublai Khan es un almizcle salvaje y animal de culto. Lutens evoca la piel desnuda y los caballos del imperio mongol con civeta, ámbar y rosa.",
    perfumer: "Christopher Sheldrake",
    year: 1998,
    concentration: "Eau de Parfum",
    gender: "Unisex",
    pyramid: {
      top: ["Comino", "Cisto"],
      heart: ["Almizcle", "Civeta", "Castóreo"],
      base: ["Rosa", "Pachulí", "Ámbar"],
    },
    longevity: { label: "Muy buena", hours: "8–10 h" },
    sillage: { label: "Notable", description: "Cálida, carnal, magnética." },
    projection: "Animal y especiada, profundamente sensual.",
    season: ["Otoño", "Invierno"],
    occasions: ["Noches privadas", "Encuentros íntimos"],
    recommendedFor: "Amantes de los almizcles potentes y sin filtros.",
    howToWear: "Una pulverización en piel limpia; el almizcle hace el resto.",
    ingredientsOrigin: [
      { ingredient: "Almizcle", origin: "Reconstrucción sintética (sin animales)" },
      { ingredient: "Rosa", origin: "Marruecos" },
    ],
  },
  p27: {
    story:
      "Nightscape captura el paisaje urbano de Nueva York tras la lluvia: asfalto húmedo, cuero y especias bajo la luz fría de los neones.",
    perfumer: "Mark Buxton",
    year: 2014,
    concentration: "Eau de Parfum",
    gender: "Unisex",
    pyramid: {
      top: ["Cardamomo", "Pimienta Rosa"],
      heart: ["Cedro", "Vetiver", "Iris"],
      base: ["Cuero", "Pachulí", "Ámbar"],
    },
    longevity: { label: "Buena", hours: "7–9 h" },
    sillage: { label: "Moderada", description: "Urbana y discreta." },
    projection: "Equilibrada, minimalista, contemporánea.",
    season: ["Otoño", "Invierno", "Primavera"],
    occasions: ["Uso diario", "Eventos creativos", "Trabajo"],
    recommendedFor: "Quien aprecie los amaderados modernos y arquitectónicos.",
    howToWear: "Dos pulverizaciones en el cuello al salir de casa.",
    ingredientsOrigin: [
      { ingredient: "Cedro", origin: "Virginia, EE.UU." },
      { ingredient: "Vetiver", origin: "Haití" },
    ],
  },
  p28: {
    story:
      "Moonlight Patchouli reinventa el pachulí en clave luminosa: blanqueado por almizcle blanco, rosa y vainilla, brilla como la luna sobre la seda.",
    perfumer: "Antoine Maisondieu",
    year: 2014,
    concentration: "Eau de Parfum",
    gender: "Unisex",
    pyramid: {
      top: ["Pimienta Rosa", "Cilantro"],
      heart: ["Pachulí", "Rosa", "Iris"],
      base: ["Cedro", "Vainilla", "Almizcle Blanco"],
    },
    longevity: { label: "Muy buena", hours: "8–10 h" },
    sillage: { label: "Notable", description: "Refinada y sensual." },
    projection: "Luminosa, ligeramente terrosa.",
    season: ["Otoño", "Invierno", "Primavera"],
    occasions: ["Cenas", "Citas", "Eventos sociales"],
    recommendedFor: "Quien busque un pachulí elegante, ni hippie ni gótico.",
    howToWear: "Aplica en muñecas y cuello para una difusión equilibrada.",
    ingredientsOrigin: [
      { ingredient: "Pachulí", origin: "Indonesia" },
      { ingredient: "Rosa", origin: "Turquía" },
    ],
  },
  p29: {
    story:
      "Black III pertenece a la trilogía negra de Widian: alta perfumería emiratí con los oud más selectos, incienso de Omán y rosas raras. Una joya líquida embotellada como tal.",
    perfumer: "Roberto Drago",
    year: 2014,
    concentration: "Extrait de Parfum",
    gender: "Unisex",
    pyramid: {
      top: ["Azafrán", "Pimienta Rosa"],
      heart: ["Rosa de Damasco", "Oud"],
      base: ["Incienso", "Sándalo", "Ámbar"],
    },
    longevity: { label: "Eterna", hours: "12+ h" },
    sillage: { label: "Enorme", description: "Estela árabe imponente." },
    projection: "Especiada, regia, profundamente oriental.",
    season: ["Otoño", "Invierno"],
    occasions: ["Eventos exclusivos", "Cenas de gala", "Noches especiales"],
    recommendedFor: "Quien quiera vivir la alta perfumería árabe sin filtros.",
    howToWear: "Una pulverización en la nuca; el extracto basta y sobra.",
    ingredientsOrigin: [
      { ingredient: "Oud", origin: "Camboya" },
      { ingredient: "Incienso", origin: "Dhofar, Omán" },
    ],
  },
  p30: {
    story:
      "M7 fue revolucionaria en 2002: Tom Ford, entonces director creativo de YSL, introdujo el oud en la perfumería mainstream. La versión Oud Absolu intensifica esa visión pionera.",
    perfumer: "Jacques Cavallier y Alberto Morillas",
    year: 2011,
    concentration: "Eau de Toilette",
    gender: "Masculino",
    pyramid: {
      top: ["Mandarina", "Bergamota"],
      heart: ["Oud", "Mirra"],
      base: ["Ámbar", "Vetiver", "Almizcle"],
    },
    longevity: { label: "Muy buena", hours: "8–10 h" },
    sillage: { label: "Notable", description: "Cálida y reconocible." },
    projection: "Cítrica al inicio, resinosa y profunda después.",
    season: ["Otoño", "Invierno"],
    occasions: ["Cenas", "Trabajo en climas fríos", "Noches"],
    recommendedFor: "Quien quiera conocer el oud que abrió camino a toda una generación.",
    howToWear: "Tres pulverizaciones en torso para compensar la concentración EDT.",
    ingredientsOrigin: [
      { ingredient: "Oud", origin: "Marruecos" },
      { ingredient: "Mirra", origin: "Etiopía" },
    ],
  },
  p31: {
    story:
      "Civet de Zoologist es una recreación artística (100 % vegana) del mítico ingrediente animal. Una fragancia conceptual que combina civeta sintética con flores blancas y almizcles cremosos.",
    perfumer: "Shelley Waddington",
    year: 2017,
    concentration: "Eau de Parfum",
    gender: "Unisex",
    pyramid: {
      top: ["Bergamota", "Pimienta Rosa", "Azahar"],
      heart: ["Jazmín", "Rosa", "Ylang-Ylang", "Civeta"],
      base: ["Almizcle", "Sándalo", "Ámbar", "Vainilla"],
    },
    longevity: { label: "Muy buena", hours: "8–10 h" },
    sillage: { label: "Notable", description: "Carnal, floral y magnética." },
    projection: "Sensual, ligeramente salvaje.",
    season: ["Otoño", "Invierno"],
    occasions: ["Citas", "Eventos artísticos", "Noches creativas"],
    recommendedFor: "Quien busque una experiencia olfativa conceptual y diferente.",
    howToWear: "Una sola pulverización en el pulso. La civeta amplifica todo.",
    ingredientsOrigin: [
      { ingredient: "Civeta", origin: "Reconstrucción sintética cruelty-free" },
      { ingredient: "Jazmín", origin: "India" },
    ],
  },
}

function buildFallbackDetail(product: Perfume): PerfumeDetail {
  const [n1, n2, n3, n4] = product.notes
  return {
    story: `${product.name} de ${product.brand} es una fragancia ${product.category.toLowerCase()} construida en torno a ${product.notes
      .slice(0, 3)
      .join(", ")}. ${product.description} Su carácter ${product.category.toLowerCase()} la convierte en una elección distinguida dentro del catálogo de ${product.brand}.`,
    perfumer: `Maître Perfumista de ${product.brand}`,
    year: 2015 + (parseInt(product.id.replace(/\D/g, "") || "0") % 9),
    concentration: "Eau de Parfum",
    gender: "Unisex",
    pyramid: {
      top: [n1 || "Bergamota", n2 || "Cítricos"].filter(Boolean),
      heart: [n2 || "Rosa", n3 || "Especias"].filter(Boolean),
      base: [n3 || "Maderas", n4 || "Almizcle"].filter(Boolean),
    },
    longevity: { label: "Muy buena", hours: "7–9 h" },
    sillage: { label: "Moderada", description: "Estela equilibrada, presente sin invadir." },
    projection: "Equilibrada durante todo el día.",
    season: product.category === "Fresco" ? ["Primavera", "Verano"] : ["Otoño", "Invierno"],
    occasions: ["Uso diario", "Eventos especiales", "Cenas elegantes"],
    recommendedFor: `Personas con sensibilidad por las fragancias ${product.category.toLowerCase()}.`,
    howToWear:
      "Pulveriza sobre piel hidratada en los puntos de pulso: muñecas, cuello y detrás de las orejas.",
    ingredientsOrigin: product.notes.slice(0, 3).map((ingredient) => ({
      ingredient,
      origin: "Selección artesanal de proveedores internacionales",
    })),
  }
}

function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { perfumes, addToCart, toggleCart, isGuest, language } = useAppStore()
  const t = useT()
  const lang = language as Lang
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showGuestModal, setShowGuestModal] = useState(false)

  const toggleWishlist = () => {
    if (isGuest) {
      setShowGuestModal(true)
      return
    }
    setIsWishlisted(!isWishlisted)
  }

  const baseProduct = perfumes.find((p) => p.id === params.id)
  const product = baseProduct ? localizePerfume(baseProduct, lang) : undefined

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <MobileMenu />
        <CartSidebar />
        <main className="flex-1 flex items-center justify-center pb-24 lg:pb-0">
          <div className="text-center">
            <h1 className="font-serif text-2xl font-bold text-foreground mb-4">{t("shop.notFound")}</h1>
            <p className="text-muted-foreground mb-6">{t("shop.notFound")}</p>
            <Button onClick={() => router.push("/shop")} className="rounded-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("nav.shop")}
            </Button>
          </div>
        </main>
        <Footer />
        <MobileBottomNav />
      </div>
    )
  }

  const baseDetail = detailsById[product.id] ?? buildFallbackDetail(baseProduct!)
  const detail: PerfumeDetail = {
    ...baseDetail,
    concentration: tTerm(baseDetail.concentration, lang),
    gender: tTerm(baseDetail.gender, lang) as PerfumeDetail["gender"],
    pyramid: {
      top: tTerms(baseDetail.pyramid.top, lang),
      heart: tTerms(baseDetail.pyramid.heart, lang),
      base: tTerms(baseDetail.pyramid.base, lang),
    },
    longevity: { label: tTerm(baseDetail.longevity.label, lang), hours: baseDetail.longevity.hours },
    sillage: {
      label: tTerm(baseDetail.sillage.label, lang),
      description: tSillageDesc(product.id, baseDetail.sillage.description, lang),
    },
    projection: tProjection(product.id, baseDetail.projection, lang),
    season: tTerms(baseDetail.season, lang),
    occasions: tTerms(baseDetail.occasions, lang),
    recommendedFor: tRecommendedFor(product.id, baseDetail.recommendedFor, lang),
    howToWear: tHowToWear(product.id, baseDetail.howToWear, lang),
    story: tStory(product.id, baseDetail.story, lang),
    ingredientsOrigin: baseDetail.ingredientsOrigin.map((it) => ({
      ingredient: tTerm(it.ingredient, lang),
      origin: tOrigin(product.id, it.origin, lang),
    })),
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        image: product.image,
        size: product.size,
      })
    }
    toggleCart()
  }

  const images = [product.image, product.image, product.image]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-secondary/20 to-background">
      <GuestRestrictionModal
        isOpen={showGuestModal}
        onClose={() => setShowGuestModal(false)}
        action={t("shop.wishlist")}
      />
      <Header />
      <MobileMenu />
      <CartSidebar />

      <main className="flex-1 pb-24 lg:pb-0">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/shop" className="hover:text-primary transition-colors">
              {t("nav.shop")}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>

        {/* Product Detail Section */}
        <div className="container mx-auto px-4 py-6 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-card via-card to-secondary/30 border border-border/50 shadow-xl">
                <img
                  src={images[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.bestseller && (
                    <span className="px-4 py-2 bg-gradient-to-r from-primary to-gold-dark text-primary-foreground text-sm font-medium rounded-full shadow-lg">
                      {tTerm("Bestseller", lang)}
                    </span>
                  )}
                  {product.new && (
                    <span className="px-4 py-2 bg-gradient-to-r from-secondary to-beige text-secondary-foreground text-sm font-medium rounded-full shadow-lg">
                      {tTerm("Nuevo", lang)}
                    </span>
                  )}
                  {product.exclusive && (
                    <span className="px-4 py-2 bg-gradient-to-r from-foreground to-brown-medium text-background text-sm font-medium rounded-full shadow-lg">
                      {tTerm("Exclusivo", lang)}
                    </span>
                  )}
                </div>

                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button
                    onClick={toggleWishlist}
                    className={cn(
                      "h-12 w-12 rounded-full bg-background/90 backdrop-blur-md flex items-center justify-center shadow-lg transition-all hover:scale-110",
                      isWishlisted ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                    )}
                  >
                    <Heart className={cn("h-6 w-6", isWishlisted && "fill-current")} />
                  </button>
                  <button className="h-12 w-12 rounded-full bg-background/90 backdrop-blur-md flex items-center justify-center shadow-lg text-muted-foreground hover:text-primary transition-all hover:scale-110">
                    <Share2 className="h-6 w-6" />
                  </button>
                </div>

                {product.originalPrice && (
                  <div className="absolute bottom-4 right-4">
                    <span className="px-4 py-2 bg-gradient-to-r from-destructive to-red-600 text-destructive-foreground text-sm font-bold rounded-full shadow-lg">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-center">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all",
                      selectedImage === index
                        ? "border-primary shadow-lg scale-105"
                        : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <img src={img || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <span className="text-primary font-medium uppercase tracking-wider text-sm">
                  {product.brand}
                </span>
                <h1 className="font-serif text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mt-2 text-balance">
                  {product.name}
                </h1>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-5 w-5",
                        i < Math.floor(product.rating)
                          ? "text-primary fill-primary"
                          : "text-muted-foreground"
                      )}
                    />
                  ))}
                </div>
                <span className="text-foreground font-semibold">{product.rating}</span>
                <span className="text-muted-foreground">({product.reviews} {t("shop.reviews")})</span>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="inline-block px-4 py-2 bg-gradient-to-r from-muted to-secondary/50 text-muted-foreground text-sm rounded-full">
                  {product.category}
                </span>
                <span className="inline-block px-4 py-2 bg-primary/10 text-primary text-sm rounded-full">
                  {detail.concentration}
                </span>
                <span className="inline-block px-4 py-2 bg-secondary/40 text-secondary-foreground text-sm rounded-full">
                  {detail.gender}
                </span>
              </div>

              <div className="flex items-baseline gap-4">
                <span className="font-serif text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-gold-dark bg-clip-text text-transparent">
                  €{product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    €{product.originalPrice}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium text-foreground">{t("shop.sizeLabel")}</span>
                <div className="flex gap-3">
                  <button className="px-6 py-3 border-2 border-primary bg-primary/10 text-primary rounded-2xl font-medium">
                    {product.size}
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <div className="flex items-center border border-border rounded-2xl overflow-hidden bg-card">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    -
                  </button>
                  <span className="px-6 py-3 font-semibold text-foreground min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    +
                  </button>
                </div>

                <Button
                  onClick={handleAddToCart}
                  className="flex-1 h-14 bg-gradient-to-r from-primary to-gold-dark hover:from-primary/90 hover:to-gold-dark/90 text-primary-foreground rounded-2xl text-lg font-semibold gap-3 shadow-lg hover:shadow-xl transition-all"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {t("shop.addToCart")}
                </Button>
              </div>

              <Button
                variant="outline"
                onClick={toggleWishlist}
                className={cn(
                  "w-full h-12 rounded-2xl gap-2 border-2 transition-all bg-transparent",
                  isWishlisted
                    ? "border-red-500 text-red-500 bg-red-500/10"
                    : "border-border hover:border-red-500 hover:text-red-500"
                )}
              >
                <Heart className={cn("h-5 w-5", isWishlisted && "fill-current")} />
                {t("shop.wishlist")}
              </Button>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-border">
                <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-card to-secondary/30 rounded-2xl">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{t("shop.original")}</p>
                    <p className="text-xs text-muted-foreground">{t("shop.authentic")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-card to-secondary/30 rounded-2xl">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{t("shop.freeShipping")}</p>
                    <p className="text-xs text-muted-foreground">{t("shop.ordersOver")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-card to-secondary/30 rounded-2xl">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{t("shop.warranty")}</p>
                    <p className="text-xs text-muted-foreground">{t("shop.warrantyDays")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rich Fragrance Information */}
        <div className="container mx-auto px-4 py-8 lg:py-12 space-y-8">
          {/* Story */}
          <section className="bg-gradient-to-br from-card to-secondary/20 rounded-3xl border border-border/50 p-6 lg:p-10 shadow-md">
            <h2 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-4 flex items-center gap-3">
              <Sparkles className="h-7 w-7 text-primary" />
              {t("shop.storyOf")} {product.name}
            </h2>
            <p className="text-muted-foreground leading-relaxed text-base lg:text-lg">{detail.story}</p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              <div className="p-4 rounded-2xl bg-background/60 border border-border/40">
                <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider mb-1">
                  <UserIcon className="h-4 w-4" />
                  {t("shop.perfumer")}
                </div>
                <p className="font-semibold text-foreground">{detail.perfumer}</p>
              </div>
              <div className="p-4 rounded-2xl bg-background/60 border border-border/40">
                <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider mb-1">
                  <Calendar className="h-4 w-4" />
                  {t("shop.year")}
                </div>
                <p className="font-semibold text-foreground">{detail.year}</p>
              </div>
              <div className="p-4 rounded-2xl bg-background/60 border border-border/40">
                <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider mb-1">
                  <Droplet className="h-4 w-4" />
                  {t("shop.concentration")}
                </div>
                <p className="font-semibold text-foreground">{detail.concentration}</p>
              </div>
              <div className="p-4 rounded-2xl bg-background/60 border border-border/40">
                <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider mb-1">
                  <Flame className="h-4 w-4" />
                  {t("shop.gender")}
                </div>
                <p className="font-semibold text-foreground">{detail.gender}</p>
              </div>
            </div>
          </section>

          {/* Pyramid */}
          <section className="bg-gradient-to-br from-card to-secondary/20 rounded-3xl border border-border/50 p-6 lg:p-10 shadow-md">
            <h2 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-2">
              {t("shop.pyramid")}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t("shop.pyramidDesc").replace("{name}", product.name)}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: t("shop.topNotes"), notes: detail.pyramid.top, accent: "from-primary/20 to-primary/5" },
                { label: t("shop.heartNotes"), notes: detail.pyramid.heart, accent: "from-gold-dark/20 to-gold-dark/5" },
                { label: t("shop.baseNotes"), notes: detail.pyramid.base, accent: "from-foreground/15 to-foreground/0" },
              ].map((layer) => (
                <div
                  key={layer.label}
                  className={cn(
                    "rounded-2xl p-6 bg-gradient-to-br border border-border/50",
                    layer.accent
                  )}
                >
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                    {layer.label}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {layer.notes.map((n) => (
                      <span
                        key={n}
                        className="px-3 py-1.5 bg-background/80 text-foreground text-sm rounded-full border border-border/60"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Performance */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-card to-secondary/20 rounded-3xl border border-border/50 p-6 shadow-md">
              <div className="flex items-center gap-2 text-primary mb-2">
                <Clock className="h-5 w-5" />
                <h3 className="font-semibold text-foreground">{t("shop.duration")}</h3>
              </div>
              <p className="text-2xl font-serif font-bold text-foreground">{detail.longevity.label}</p>
              <p className="text-sm text-muted-foreground mt-1">{detail.longevity.hours}</p>
            </div>
            <div className="bg-gradient-to-br from-card to-secondary/20 rounded-3xl border border-border/50 p-6 shadow-md">
              <div className="flex items-center gap-2 text-primary mb-2">
                <Wind className="h-5 w-5" />
                <h3 className="font-semibold text-foreground">Sillage</h3>
              </div>
              <p className="text-2xl font-serif font-bold text-foreground">{detail.sillage.label}</p>
              <p className="text-sm text-muted-foreground mt-1">{detail.sillage.description}</p>
            </div>
            <div className="bg-gradient-to-br from-card to-secondary/20 rounded-3xl border border-border/50 p-6 shadow-md">
              <div className="flex items-center gap-2 text-primary mb-2">
                <Sparkles className="h-5 w-5" />
                <h3 className="font-semibold text-foreground">{t("shop.projection")}</h3>
              </div>
              <p className="text-base text-foreground">{detail.projection}</p>
            </div>
          </section>

          {/* Season & Occasions */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-card to-secondary/20 rounded-3xl border border-border/50 p-6 shadow-md">
              <h3 className="font-serif text-xl font-bold text-foreground mb-3">{t("shop.bestSeason")}</h3>
              <div className="flex flex-wrap gap-2">
                {detail.season.map((s) => (
                  <span
                    key={s}
                    className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-card to-secondary/20 rounded-3xl border border-border/50 p-6 shadow-md">
              <h3 className="font-serif text-xl font-bold text-foreground mb-3">{t("shop.idealOccasions")}</h3>
              <ul className="space-y-2">
                {detail.occasions.map((o) => (
                  <li key={o} className="flex items-start gap-2 text-muted-foreground">
                    <ChevronRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Recommended for / How to wear */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-card to-secondary/20 rounded-3xl border border-border/50 p-6 shadow-md">
              <h3 className="font-serif text-xl font-bold text-foreground mb-3">{t("shop.recommendedFor")}</h3>
              <p className="text-muted-foreground leading-relaxed">{detail.recommendedFor}</p>
            </div>
            <div className="bg-gradient-to-br from-card to-secondary/20 rounded-3xl border border-border/50 p-6 shadow-md">
              <h3 className="font-serif text-xl font-bold text-foreground mb-3">{t("shop.howToWear")}</h3>
              <p className="text-muted-foreground leading-relaxed">{detail.howToWear}</p>
            </div>
          </section>

          {/* Ingredients origin */}
          {detail.ingredientsOrigin.length > 0 && (
            <section className="bg-gradient-to-br from-card to-secondary/20 rounded-3xl border border-border/50 p-6 lg:p-10 shadow-md">
              <h2 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-6">
                {t("shop.ingredientsOrigin")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {detail.ingredientsOrigin.map((item) => (
                  <div
                    key={item.ingredient}
                    className="p-5 rounded-2xl bg-background/60 border border-border/40"
                  >
                    <p className="font-semibold text-foreground">{item.ingredient}</p>
                    <p className="text-sm text-muted-foreground mt-1">{item.origin}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  )
}


export const Route = createFileRoute("/shop_/$id")({
  component: ProductDetailPage,
});
