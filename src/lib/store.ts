"use client"

import { useEffect, useState } from "react"
import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: string
  name: string
  brand: string
  price: number
  image: string
  quantity: number
  size: string
}

export interface Comment {
  id: string
  author: {
    name: string
    username: string
    avatar: string
  }
  content: string
  createdAt: string
  likes: number
}

export interface Post {
  id: string
  author: {
    name: string
    username: string
    avatar: string
    tags: string[]
  }
  content: string
  image?: string
  video?: string
  likes: number
  comments: Comment[]
  shares: number
  liked: boolean
  saved: boolean
  createdAt: string
}

export interface User {
  id: string
  name: string
  username: string
  avatar: string
  followers: number
  following: number
  tags: string[]
  bio: string
  location: string
  website: string
  perfumeCount: number
}

export interface Perfume {
  id: string
  name: string
  brand: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  size: string
  category: string
  notes: string[]
  description: string
  bestseller?: boolean
  new?: boolean
  exclusive?: boolean
}

export interface UserProfile {
  name: string
  username: string
  avatar: string
  coverImage: string
  bio: string
  location: string
  website: string
  joinedDate: string
  tags: string[]
}

export interface Notification {
  id: string
  type: "like" | "comment" | "follow" | "mention"
  from: {
    name: string
    username: string
    avatar: string
  }
  content: string
  postId?: string
  read: boolean
  createdAt: string
}

export interface Message {
  id: string
  from: {
    name: string
    username: string
    avatar: string
  }
  to: {
    name: string
    username: string
    avatar: string
  }
  content: string
  read: boolean
  createdAt: string
}

export interface Conversation {
  id: string
  participant: {
    name: string
    username: string
    avatar: string
  }
  lastMessage: string
  unreadCount: number
  createdAt: string
}

interface ShopFilters {
  brands: string[]
  categories: string[]
  priceRange: { min: number; max: number } | null
  sortBy: string
}

export interface AuthUser {
  name: string
  username: string
  email: string
  avatar: string
  bio: string
}

interface AppState {
  // Auth
  isAuthenticated: boolean
  isGuest: boolean
  authUser: AuthUser | null
  login: (user: AuthUser) => void
  loginAsGuest: () => void
  logout: () => void
  register: (user: AuthUser) => void

  // Cart
  cartItems: CartItem[]
  cartOpen: boolean
  addToCart: (item: Omit<CartItem, "quantity">) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  toggleCart: () => void
  clearCart: () => void

  // Language
  language: string
  setLanguage: (lang: string) => void

  // Location
  location: string
  setLocation: (loc: string) => void

  // Posts
  posts: Post[]
  toggleLike: (postId: string) => void
  toggleSave: (postId: string) => void
  addPost: (post: Omit<Post, "id" | "likes" | "comments" | "shares" | "liked" | "saved" | "createdAt">) => void
  addComment: (postId: string, comment: Omit<Comment, "id" | "createdAt" | "likes">) => void

  // Users
  users: User[]

  // Perfumes
  perfumes: Perfume[]

  // User Profile
  userProfile: UserProfile
  updateUserProfile: (profile: Partial<UserProfile>) => void

  // Menu
  menuOpen: boolean
  toggleMenu: () => void

  // Search
  searchQuery: string
  searchFilter: string
  setSearchQuery: (query: string) => void
  setSearchFilter: (filter: string) => void

  // Shop Filters
  shopFilters: ShopFilters
  setShopFilters: (filters: Partial<ShopFilters>) => void
  clearShopFilters: () => void

  // Saved Posts
  savedPosts: string[]

  // Following Users
  followingUsers: string[]
  toggleFollow: (username: string) => void
  isFollowing: (username: string) => boolean

  // User Collection
  userCollection: string[]
  addToCollection: (perfumeId: string) => void
  removeFromCollection: (perfumeId: string) => void

  // Joined Communities
  joinedCommunities: string[]
  joinCommunity: (communityId: string) => void
  leaveCommunity: (communityId: string) => void

  // Liked Collections
  likedCollections: string[]
  toggleLikeCollection: (collectionId: string) => void

  // Community posts (creator-only posts per community)
  communityPosts: Record<string, Post[]>
  toggleCommunityLike: (communityId: string, postId: string) => void
  toggleCommunitySave: (communityId: string, postId: string) => void
  addCommunityComment: (
    communityId: string,
    postId: string,
    comment: Omit<Comment, "id" | "createdAt" | "likes">
  ) => void

  // Notifications
  notifications: Notification[]
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void

  // Messages
  conversations: Conversation[]
  messages: Message[]
  sendMessage: (toUsername: string, content: string) => void
  markMessageRead: (id: string) => void

  // Theme
  theme: "light" | "dark" | "system"
  setTheme: (t: "light" | "dark" | "system") => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      isAuthenticated: false,
      isGuest: false,
      authUser: null,
      login: (user) =>
        set({
          isAuthenticated: true,
          isGuest: false,
          authUser: user,
          userProfile: {
            ...get().userProfile,
            name: user.name,
            username: user.username,
            bio: user.bio || "",
            avatar: user.avatar || "",
          },
        }),
      loginAsGuest: () =>
        set({
          isAuthenticated: false,
          isGuest: true,
          authUser: null,
        }),
      logout: () =>
        set({
          isAuthenticated: false,
          isGuest: false,
          authUser: null,
        }),
      register: (user) =>
        set({
          isAuthenticated: true,
          isGuest: false,
          authUser: user,
          userProfile: {
            ...get().userProfile,
            name: user.name,
            username: user.username,
            bio: user.bio || "",
            avatar: user.avatar || "",
          },
        }),

      // Cart
      cartItems: [],
      cartOpen: false,
      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cartItems.find((i) => i.id === item.id)
          if (existingItem) {
            return {
              cartItems: state.cartItems.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)),
            }
          }
          return { cartItems: [...state.cartItems, { ...item, quantity: 1 }] }
        }),
      removeFromCart: (id) =>
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          cartItems: state.cartItems
            .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item))
            .filter((item) => item.quantity > 0),
        })),
      toggleCart: () => set((state) => ({ cartOpen: !state.cartOpen })),
      clearCart: () => set({ cartItems: [] }),

      // Language
      language: "ES",
      setLanguage: (lang) => set({ language: lang }),

      // Location
      location: "España",
      setLocation: (loc) => set({ location: loc }),

      // Users
      users: [
        {
          id: "1",
          name: "María García",
          username: "@mariaoud",
          avatar: "/elegant-woman-portrait.png",
          followers: 12400,
          following: 567,
          tags: ["Amante del Oud", "Coleccionista"],
          bio: "Apasionada por las fragancias orientales y el oud desde hace más de 10 años.",
          location: "Madrid, España",
          website: "fraganciasmaria.blog",
          perfumeCount: 89,
        },
        {
          id: "2",
          name: "Carlos Mendez",
          username: "@carlosfragrance",
          avatar: "/man-portrait-sophisticated.jpg",
          followers: 34200,
          following: 234,
          tags: ["Experto", "Reviewer", "YouTuber"],
          bio: "Crítico de fragancias y creador de contenido. Reviews honestos desde 2015.",
          location: "Barcelona, España",
          website: "carlosfragrance.com",
          perfumeCount: 156,
        },
        {
          id: "3",
          name: "Ana Rodríguez",
          username: "@ana_scents",
          avatar: "/woman-portrait-elegant-style.jpg",
          followers: 8900,
          following: 412,
          tags: ["Blogger", "Amante del Oud"],
          bio: "Blogger de perfumes y lifestyle. Descubriendo joyas olfativas cada día.",
          location: "Valencia, España",
          website: "anascents.blog",
          perfumeCount: 67,
        },
        {
          id: "4",
          name: "Luis Fernández",
          username: "@luisperfumes",
          avatar: "/man-sophisticated-portrait.jpg",
          followers: 5600,
          following: 890,
          tags: ["Coleccionista", "Vintage"],
          bio: "Coleccionista de fragancias vintage y descontinuadas. Historia del perfume.",
          location: "Sevilla, España",
          website: "",
          perfumeCount: 234,
        },
        {
          id: "5",
          name: "Elena Martín",
          username: "@elena_oud",
          avatar: "/elegant-woman-avatar.jpg",
          followers: 15800,
          following: 345,
          tags: ["Experta en Oud", "Influencer"],
          bio: "Especialista en fragancias orientales. Embajadora de casas nicho.",
          location: "Málaga, España",
          website: "elenaoud.com",
          perfumeCount: 112,
        },
        {
          id: "6",
          name: "Pedro Sánchez",
          username: "@pedroscents",
          avatar: "/man-portrait-sophisticated.jpg",
          followers: 2300,
          following: 567,
          tags: ["Principiante", "Entusiasta"],
          bio: "Nuevo en el mundo de los perfumes. Aprendiendo cada día.",
          location: "Bilbao, España",
          website: "",
          perfumeCount: 23,
        },
        {
          id: "7",
          name: "Laura Torres",
          username: "@lauraperfume",
          avatar: "/woman-portrait-elegant-style.jpg",
          followers: 7800,
          following: 234,
          tags: ["Reviewer", "Blogger"],
          bio: "Reviews detallados de fragancias nicho y diseñador.",
          location: "Zaragoza, España",
          website: "lauraperfume.es",
          perfumeCount: 78,
        },
        {
          id: "8",
          name: "Javier López",
          username: "@javierfragrances",
          avatar: "/man-sophisticated-portrait.jpg",
          followers: 11200,
          following: 456,
          tags: ["Experto", "Coleccionista"],
          bio: "Perfumista aficionado y coleccionista de ediciones limitadas.",
          location: "Granada, España",
          website: "javierfragrances.com",
          perfumeCount: 145,
        },
      ],

      // Perfumes
      perfumes: [
        // A - Amouage
        {
          id: "p1",
          name: "Interlude Man",
          brand: "Amouage",
          price: 385,
          originalPrice: 420,
          image: "/perfume-amouage-interlude-man.jpg",
          rating: 4.9,
          reviews: 234,
          size: "100ml",
          category: "Oriental",
          notes: ["Incienso", "Ámbar", "Oud", "Especias"],
          description: "Una fragancia intensa y compleja con notas de incienso y oud.",
          bestseller: true,
        },
        {
          id: "p7",
          name: "Jubilation XXV",
          brand: "Amouage",
          price: 410,
          image: "/perfume-amouage-jubilation.jpg",
          rating: 4.9,
          reviews: 178,
          size: "100ml",
          category: "Oriental",
          notes: ["Incienso", "Mirra", "Oud", "Miel"],
          description: "Una celebración olfativa de la perfumería oriental.",
        },
        // A - Acqua di Parma
        {
          id: "p13",
          name: "Colonia Oud",
          brand: "Acqua di Parma",
          price: 245,
          image: "/perfume-acqua-di-parma-colonia-oud.jpg",
          rating: 4.5,
          reviews: 312,
          size: "100ml",
          category: "Oud",
          notes: ["Oud", "Cítricos", "Cuero", "Ámbar"],
          description: "La elegancia italiana fusionada con el misterio del oud.",
        },
        // B - Byredo
        {
          id: "p14",
          name: "Oud Immortel",
          brand: "Byredo",
          price: 285,
          image: "/perfume-byredo-oud-immortel.jpg",
          rating: 4.7,
          reviews: 423,
          size: "100ml",
          category: "Oud",
          notes: ["Oud", "Incienso", "Papiro", "Musgo"],
          description: "Una interpretación moderna y artística del oud.",
          new: true,
        },
        // C - Creed
        {
          id: "p3",
          name: "Royal Oud",
          brand: "Creed",
          price: 445,
          image: "/perfume-creed-royal-oud.jpg",
          rating: 4.8,
          reviews: 189,
          size: "100ml",
          category: "Oud",
          notes: ["Oud", "Cedro", "Pomelo", "Pimienta Rosa"],
          description: "Una interpretación real y majestuosa del oud.",
          new: true,
        },
        {
          id: "p8",
          name: "Aventus",
          brand: "Creed",
          price: 395,
          image: "/perfume-creed-aventus.jpg",
          rating: 4.7,
          reviews: 892,
          size: "100ml",
          category: "Fresco",
          notes: ["Piña", "Abedul", "Musgo", "Almizcle"],
          description: "El legendario Aventus, símbolo de poder y éxito.",
          bestseller: true,
        },
        // D - Dior
        {
          id: "p15",
          name: "Oud Ispahan",
          brand: "Dior",
          price: 320,
          image: "/perfume-dior-oud-ispahan.jpg",
          rating: 4.6,
          reviews: 567,
          size: "125ml",
          category: "Oriental",
          notes: ["Oud", "Rosa", "Labdanum", "Ámbar"],
          description: "La rosa de Damasco encuentra el oud en esta creación sublime.",
          bestseller: true,
        },
        // E - Ex Nihilo
        {
          id: "p16",
          name: "Fleur Narcotique",
          brand: "Ex Nihilo",
          price: 295,
          image: "/perfume-ex-nihilo-fleur-narcotique.jpg",
          rating: 4.8,
          reviews: 234,
          size: "100ml",
          category: "Floral",
          notes: ["Peonía", "Melocotón", "Almizcle", "Musgo"],
          description: "Una fragancia adictiva con un bouquet floral intoxicante.",
        },
        // F - Floris
        {
          id: "p17",
          name: "Oud & Cashmere",
          brand: "Floris London",
          price: 225,
          image: "/perfume-floris-oud-cashmere.jpg",
          rating: 4.4,
          reviews: 156,
          size: "100ml",
          category: "Oud",
          notes: ["Oud", "Cachemira", "Rosa", "Sándalo"],
          description: "La tradición británica se encuentra con el lujo oriental.",
        },
        // G - Guerlain
        {
          id: "p18",
          name: "Oud Essentiel",
          brand: "Guerlain",
          price: 275,
          image: "/perfume-guerlain-oud-essentiel.jpg",
          rating: 4.7,
          reviews: 389,
          size: "125ml",
          category: "Oud",
          notes: ["Oud", "Rosa", "Incienso", "Ámbar"],
          description: "La maison francesa rinde homenaje al oro líquido de Oriente.",
          exclusive: true,
        },
        // H - Histoires de Parfums
        {
          id: "p19",
          name: "1899 Hemingway",
          brand: "Histoires de Parfums",
          price: 195,
          image: "/perfume-histoires-1899-hemingway.jpg",
          rating: 4.5,
          reviews: 178,
          size: "120ml",
          category: "Especiado",
          notes: ["Ron", "Tabaco", "Cuero", "Maderas"],
          description: "Un homenaje olfativo al espíritu aventurero de Hemingway.",
        },
        // I - Initio
        {
          id: "p11",
          name: "Oud for Greatness",
          brand: "Initio",
          price: 345,
          image: "/perfume-initio-oud-greatness.jpg",
          rating: 4.9,
          reviews: 267,
          size: "90ml",
          category: "Oud",
          notes: ["Oud", "Lavanda", "Azafrán", "Almizcle"],
          description: "Un oud potente y adictivo para los amantes del género.",
          new: true,
        },
        // J - Jo Malone
        {
          id: "p20",
          name: "Oud & Bergamot",
          brand: "Jo Malone",
          price: 165,
          image: "/perfume-jo-malone-oud-bergamot.jpg",
          rating: 4.3,
          reviews: 456,
          size: "100ml",
          category: "Oud",
          notes: ["Oud", "Bergamota", "Cedro", "Cítricos"],
          description: "Una introducción elegante y accesible al mundo del oud.",
        },
        // K - Kilian
        {
          id: "p21",
          name: "Black Phantom",
          brand: "Kilian",
          price: 295,
          image: "/perfume-kilian-black-phantom.jpg",
          rating: 4.8,
          reviews: 345,
          size: "50ml",
          category: "Oriental",
          notes: ["Ron", "Café", "Chocolate", "Azúcar"],
          description: "Memento Mori - Una fragancia oscura y golosa.",
          bestseller: true,
        },
        // L - Le Labo
        {
          id: "p22",
          name: "Oud 27",
          brand: "Le Labo",
          price: 420,
          image: "/perfume-le-labo-oud-27.jpg",
          rating: 4.9,
          reviews: 234,
          size: "100ml",
          category: "Oud",
          notes: ["Oud", "Incienso", "Ciprés", "Cedro"],
          description: "La interpretación artesanal de Le Labo del ingrediente rey.",
          exclusive: true,
        },
        // M - Maison Francis Kurkdjian
        {
          id: "p5",
          name: "Oud Satin Mood",
          brand: "Maison Francis Kurkdjian",
          price: 325,
          image: "/perfume-mfk-oud-satin-mood.jpg",
          rating: 4.6,
          reviews: 342,
          size: "70ml",
          category: "Oud",
          notes: ["Oud", "Rosa", "Vainilla", "Violeta"],
          description: "Un oud suave y aterciopelado con toques florales.",
        },
        {
          id: "p12",
          name: "Baccarat Rouge 540",
          brand: "Maison Francis Kurkdjian",
          price: 355,
          image: "/perfume-mfk-baccarat-rouge-540.jpg",
          rating: 4.7,
          reviews: 1234,
          size: "70ml",
          category: "Amaderado",
          notes: ["Azafrán", "Ámbar", "Cedro", "Almizcle"],
          description: "La fragancia viral que conquistó el mundo.",
          bestseller: true,
        },
        // N - Nasomatto
        {
          id: "p6",
          name: "Black Afgano",
          brand: "Nasomatto",
          price: 195,
          image: "/perfume-nasomatto-black-afgano.jpg",
          rating: 4.8,
          reviews: 456,
          size: "30ml",
          category: "Oriental",
          notes: ["Hachís", "Café", "Oud", "Tabaco"],
          description: "Intenso, oscuro y adictivo. Una experiencia única.",
          bestseller: true,
        },
        // O - Ormonde Jayne
        {
          id: "p23",
          name: "Ormonde Man",
          brand: "Ormonde Jayne",
          price: 185,
          image: "/perfume-ormonde-jayne-ormonde-man.jpg",
          rating: 4.6,
          reviews: 267,
          size: "120ml",
          category: "Amaderado",
          notes: ["Cicuta", "Vetiver", "Cedro", "Oud"],
          description: "Una fragancia verde y misteriosa con un corazón de oud.",
        },
        // P - Parfums de Marly
        {
          id: "p10",
          name: "Layton",
          brand: "Parfums de Marly",
          price: 265,
          image: "/perfume-parfums-de-marly-layton.jpg",
          rating: 4.6,
          reviews: 534,
          size: "75ml",
          category: "Especiado",
          notes: ["Manzana", "Lavanda", "Vainilla", "Guayaco"],
          description: "Elegancia francesa con un toque oriental.",
        },
        // Q - Quelques Fleurs
        {
          id: "p24",
          name: "L'Original",
          brand: "Quelques Fleurs",
          price: 175,
          image: "/perfume-quelques-fleurs-original.jpg",
          rating: 4.4,
          reviews: 123,
          size: "100ml",
          category: "Floral",
          notes: ["Rosa", "Jazmín", "Tuberosa", "Almizcle"],
          description: "Un clásico floral atemporal de la perfumería francesa.",
        },
        // R - Roja Parfums
        {
          id: "p25",
          name: "Oud Aoud",
          brand: "Roja Parfums",
          price: 595,
          image: "/perfume-roja-oud-aoud.jpg",
          rating: 5.0,
          reviews: 89,
          size: "100ml",
          category: "Oud",
          notes: ["Oud", "Rosa", "Sándalo", "Almizcle"],
          description: "La máxima expresión del lujo en perfumería de oud.",
          exclusive: true,
        },
        // S - Serge Lutens
        {
          id: "p26",
          name: "Muscs Koublai Khan",
          brand: "Serge Lutens",
          price: 165,
          image: "/perfume-serge-lutens-muscs-koublai-khan.jpg",
          rating: 4.7,
          reviews: 345,
          size: "50ml",
          category: "Oriental",
          notes: ["Almizcle", "Rosa", "Civeta", "Ámbar"],
          description: "Un almizcle salvaje y animalístico de culto.",
        },
        // T - Tom Ford
        {
          id: "p2",
          name: "Oud Wood",
          brand: "Tom Ford",
          price: 285,
          image: "/perfume-tom-ford-oud-wood.jpg",
          rating: 4.7,
          reviews: 567,
          size: "50ml",
          category: "Oud",
          notes: ["Oud", "Sándalo", "Vetiver", "Cardamomo"],
          description: "El icónico oud de Tom Ford, elegante y sofisticado.",
          bestseller: true,
        },
        {
          id: "p9",
          name: "Tobacco Vanille",
          brand: "Tom Ford",
          price: 295,
          image: "/perfume-tom-ford-tobacco-vanille.jpg",
          rating: 4.8,
          reviews: 623,
          size: "50ml",
          category: "Especiado",
          notes: ["Tabaco", "Vainilla", "Cacao", "Especias"],
          description: "Cálido, dulce y adictivo como un habano de lujo.",
        },
        // U - Ulrich Lang
        {
          id: "p27",
          name: "Nightscape",
          brand: "Ulrich Lang",
          price: 145,
          image: "/perfume-ulrich-lang-nightscape.jpg",
          rating: 4.3,
          reviews: 98,
          size: "100ml",
          category: "Amaderado",
          notes: ["Cardamomo", "Cedro", "Vetiver", "Cuero"],
          description: "Un paisaje nocturno urbano capturado en fragancia.",
        },
        // V - Van Cleef & Arpels
        {
          id: "p28",
          name: "Moonlight Patchouli",
          brand: "Van Cleef & Arpels",
          price: 195,
          image: "/perfume-van-cleef-moonlight-patchouli.jpg",
          rating: 4.5,
          reviews: 234,
          size: "75ml",
          category: "Oriental",
          notes: ["Pachulí", "Rosa", "Cedro", "Vainilla"],
          description: "Un pachulí luminoso bajo la luz de la luna.",
        },
        // W - Widian
        {
          id: "p29",
          name: "Black III",
          brand: "Widian",
          price: 485,
          image: "/perfume-widian-black-iii.jpg",
          rating: 4.9,
          reviews: 67,
          size: "50ml",
          category: "Oud",
          notes: ["Oud", "Incienso", "Azafrán", "Rosa"],
          description: "Alta perfumería árabe con los mejores ingredientes.",
          exclusive: true,
        },
        // X - Xerjoff
        {
          id: "p4",
          name: "Alexandria II",
          brand: "Xerjoff",
          price: 520,
          image: "/perfume-xerjoff-alexandria-ii.jpg",
          rating: 5.0,
          reviews: 89,
          size: "50ml",
          category: "Oriental",
          notes: ["Oud Camboyano", "Azafrán", "Rosa", "Ámbar"],
          description: "Una obra maestra olfativa de la casa italiana.",
          exclusive: true,
        },
        // Y - Yves Saint Laurent
        {
          id: "p30",
          name: "M7 Oud Absolu",
          brand: "Yves Saint Laurent",
          price: 125,
          image: "/perfume-ysl-m7-oud-absolu.jpg",
          rating: 4.4,
          reviews: 567,
          size: "80ml",
          category: "Oud",
          notes: ["Oud", "Ámbar", "Mandarina", "Vetiver"],
          description: "Una fragancia pionera que introdujo el oud en el mainstream.",
        },
        // Z - Zoologist
        {
          id: "p31",
          name: "Civet",
          brand: "Zoologist",
          price: 175,
          image: "/perfume-zoologist-civet.jpg",
          rating: 4.6,
          reviews: 145,
          size: "60ml",
          category: "Animalístico",
          notes: ["Civeta", "Rosa", "Jazmín", "Almizcle"],
          description: "Una recreación artística del civeta sin ingredientes animales.",
          new: true,
        },
      ],

      // Posts with comments
      posts: [
        {
          id: "1",
          author: {
            name: "María García",
            username: "@mariaoud",
            avatar: "/elegant-woman-portrait.png",
            tags: ["Amante del Oud", "Coleccionista"],
          },
          content:
            "Acabo de descubrir esta joya de Amouage. El Interlude Man es simplemente extraordinario. Notas de incienso, ámbar y oud que te transportan a otro mundo. ¿Alguien más lo ha probado?",
          image: "/amouage-interlude-perfume-bottle-luxury.jpg",
          likes: 234,
          comments: [
            {
              id: "c1",
              author: { name: "Carlos Mendez", username: "@carlosfragrance", avatar: "/man-portrait-sophisticated.jpg" },
              content: "¡Es una bestia! Lo tengo y me encanta para ocasiones especiales.",
              createdAt: "1h",
              likes: 12,
            },
            {
              id: "c2",
              author: { name: "Ana Rodríguez", username: "@ana_scents", avatar: "/woman-portrait-elegant-style.jpg" },
              content: "Lo probé la semana pasada. Demasiado intenso para mi gusto, pero entiendo por qué gusta tanto.",
              createdAt: "45m",
              likes: 5,
            },
          ],
          shares: 12,
          liked: false,
          saved: false,
          createdAt: "2h",
        },
        {
          id: "2",
          author: {
            name: "Carlos Mendez",
            username: "@carlosfragrance",
            avatar: "/man-portrait-sophisticated.jpg",
            tags: ["Experto", "Reviewer"],
          },
          content:
            "Mi colección actual de fragancias nicho. 5 años coleccionando y cada una cuenta una historia. El Oud Wood de Tom Ford sigue siendo mi firma.",
          image: "/luxury-perfume-collection-display-oud.jpg",
          likes: 567,
          comments: [
            {
              id: "c3",
              author: { name: "María García", username: "@mariaoud", avatar: "/elegant-woman-portrait.png" },
              content: "¡Qué colección más impresionante! El Oud Wood es un clásico atemporal.",
              createdAt: "3h",
              likes: 23,
            },
          ],
          shares: 34,
          liked: true,
          saved: true,
          createdAt: "5h",
        },
        {
          id: "3",
          author: {
            name: "Ana Rodríguez",
            username: "@ana_scents",
            avatar: "/woman-portrait-elegant-style.jpg",
            tags: ["Blogger", "Amante del Oud"],
          },
          content:
            "Review completo del nuevo lanzamiento de Xerjoff: Alexandria II. Una obra maestra olfativa que combina oud cambodiano con especias orientales. Próximamente en mi blog.",
          likes: 189,
          comments: [],
          shares: 8,
          liked: false,
          saved: false,
          createdAt: "8h",
        },
        {
          id: "4",
          author: {
            name: "Elena Martín",
            username: "@elena_oud",
            avatar: "/elegant-woman-avatar.jpg",
            tags: ["Experta en Oud", "Influencer"],
          },
          content:
            "Hoy visité la boutique de Amouage en Dubai. Una experiencia increíble poder oler todas sus creaciones en persona. El Jubilation XXV sigue siendo mi favorito de la casa.",
          image: "/dubai-perfume-souq.jpg",
          likes: 456,
          comments: [
            {
              id: "c4",
              author: { name: "Luis Fernández", username: "@luisperfumes", avatar: "/man-sophisticated-portrait.jpg" },
              content: "¡Qué envidia! Dubai es el paraíso de los perfumes. ¿Probaste algo nuevo?",
              createdAt: "6h",
              likes: 8,
            },
            {
              id: "c5",
              author: { name: "María García", username: "@mariaoud", avatar: "/elegant-woman-portrait.png" },
              content: "El Jubilation XXV es increíble. Tengo que volver a probarlo.",
              createdAt: "5h",
              likes: 15,
            },
          ],
          shares: 23,
          liked: false,
          saved: true,
          createdAt: "1d",
        },
        {
          id: "5",
          author: {
            name: "Luis Fernández",
            username: "@luisperfumes",
            avatar: "/man-sophisticated-portrait.jpg",
            tags: ["Coleccionista", "Vintage"],
          },
          content:
            "Encontré esta joya vintage en una tienda de antigüedades. Un Guerlain de los años 80 sin abrir. La perfumería de antes tenía una magia especial que se está perdiendo.",
          image: "/oud-distillation-process.jpg",
          likes: 312,
          comments: [
            {
              id: "c6",
              author: { name: "Carlos Mendez", username: "@carlosfragrance", avatar: "/man-portrait-sophisticated.jpg" },
              content: "¡Increíble hallazgo! Los Guerlain vintage son tesoros. ¿Cuál es exactamente?",
              createdAt: "20h",
              likes: 7,
            },
          ],
          shares: 18,
          liked: true,
          saved: false,
          createdAt: "1d",
        },
        {
          id: "6",
          author: {
            name: "Laura Torres",
            username: "@lauraperfume",
            avatar: "/woman-portrait-elegant-style.jpg",
            tags: ["Reviewer", "Blogger"],
          },
          content:
            "Comparativa: Baccarat Rouge 540 vs Cloud de Ariana Grande. ¿Vale la pena pagar 5 veces más? Mi opinión honesta en el blog. Spoiler: depende de lo que busques.",
          likes: 234,
          comments: [
            {
              id: "c7",
              author: { name: "Ana Rodríguez", username: "@ana_scents", avatar: "/woman-portrait-elegant-style.jpg" },
              content: "Gran comparativa. El BR540 tiene más profundidad, pero Cloud es sorprendentemente bueno.",
              createdAt: "18h",
              likes: 19,
            },
          ],
          shares: 45,
          liked: false,
          saved: false,
          createdAt: "2d",
        },
        {
          id: "7",
          author: {
            name: "Javier López",
            username: "@javierfragrances",
            avatar: "/man-sophisticated-portrait.jpg",
            tags: ["Experto", "Coleccionista"],
          },
          content:
            "Técnicas de layering que he descubierto este mes: Oud Wood + Tobacco Vanille = magia pura. También funciona increíble BR540 + Oud Satin Mood. ¿Cuáles son vuestras combinaciones favoritas?",
          image: "/perfume-layering-technique.jpg",
          likes: 567,
          comments: [
            {
              id: "c8",
              author: { name: "Elena Martín", username: "@elena_oud", avatar: "/elegant-woman-avatar.jpg" },
              content: "¡Nunca había probado esas combinaciones! Voy a intentar la de Oud Wood + Tobacco Vanille.",
              createdAt: "1d",
              likes: 11,
            },
            {
              id: "c9",
              author: { name: "Pedro Sánchez", username: "@pedroscents", avatar: "/man-portrait-sophisticated.jpg" },
              content: "Como principiante, esto me parece fascinante. ¿Algún consejo para empezar con el layering?",
              createdAt: "22h",
              likes: 4,
            },
          ],
          shares: 67,
          liked: true,
          saved: true,
          createdAt: "2d",
        },
        {
          id: "8",
          author: {
            name: "Pedro Sánchez",
            username: "@pedroscents",
            avatar: "/man-portrait-sophisticated.jpg",
            tags: ["Principiante", "Entusiasta"],
          },
          content:
            "Mi primera compra de fragancia nicho: Layton de Parfums de Marly. Después de meses investigando, me decidí. ¿Hice buena elección? Estoy nervioso pero emocionado.",
          likes: 145,
          comments: [
            {
              id: "c10",
              author: { name: "Carlos Mendez", username: "@carlosfragrance", avatar: "/man-portrait-sophisticated.jpg" },
              content: "¡Excelente elección para empezar! Layton es versátil y tiene muy buena proyección.",
              createdAt: "1d",
              likes: 22,
            },
            {
              id: "c11",
              author: { name: "Javier López", username: "@javierfragrances", avatar: "/man-sophisticated-portrait.jpg" },
              content: "Bienvenido al mundo nicho. Layton es perfecta, prepárate para que tu colección crezca rápido.",
              createdAt: "23h",
              likes: 16,
            },
          ],
          shares: 5,
          liked: false,
          saved: false,
          createdAt: "3d",
        },
      ],
      toggleLike: (postId) =>
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === postId
              ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
              : post,
          ),
        })),
      toggleSave: (postId) =>
        set((state) => {
          const post = state.posts.find((p) => p.id === postId)
          const newSavedPosts = post?.saved
            ? state.savedPosts.filter((id) => id !== postId)
            : [...state.savedPosts, postId]
          return {
            posts: state.posts.map((post) =>
              post.id === postId ? { ...post, saved: !post.saved } : post,
            ),
            savedPosts: newSavedPosts,
          }
        }),
      addPost: (post) =>
        set((state) => ({
          posts: [
            {
              ...post,
              id: Date.now().toString(),
              likes: 0,
              comments: [],
              shares: 0,
              liked: false,
              saved: false,
              createdAt: "Ahora",
            },
            ...state.posts,
          ],
        })),
      addComment: (postId, comment) =>
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  comments: [
                    ...post.comments,
                    {
                      ...comment,
                      id: `c${Date.now()}`,
                      createdAt: "Ahora",
                      likes: 0,
                    },
                  ],
                }
              : post,
          ),
        })),

      // User Profile
      userProfile: {
        name: "",
        username: "",
        avatar: "",
        coverImage: "",
        bio: "",
        location: "",
        website: "",
        joinedDate: "",
        tags: [],
      },
      updateUserProfile: (profile) =>
        set((state) => ({
          userProfile: { ...state.userProfile, ...profile },
        })),

      // Menu
      menuOpen: false,
      toggleMenu: () => set((state) => ({ menuOpen: !state.menuOpen })),

      // Search
      searchQuery: "",
      searchFilter: "all",
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSearchFilter: (filter) => set({ searchFilter: filter }),

      // Shop Filters
      shopFilters: {
        brands: [],
        categories: [],
        priceRange: null,
        sortBy: "featured",
      },
      setShopFilters: (filters) =>
        set((state) => ({
          shopFilters: { ...state.shopFilters, ...filters },
        })),
      clearShopFilters: () =>
        set({
          shopFilters: {
            brands: [],
            categories: [],
            priceRange: null,
            sortBy: "featured",
          },
        }),

      // Saved Posts
      savedPosts: ["2", "4", "7"],

      // Following Users
      followingUsers: ["@carlosfragrance", "@elena_oud"],
      toggleFollow: (username) =>
        set((state) => ({
          followingUsers: state.followingUsers.includes(username)
            ? state.followingUsers.filter((u) => u !== username)
            : [...state.followingUsers, username],
        })),
      isFollowing: (username) => get().followingUsers.includes(username),

      // User Collection
      userCollection: ["p1", "p2", "p5", "p8"],
      addToCollection: (perfumeId) =>
        set((state) => ({
          userCollection: [...state.userCollection, perfumeId],
        })),
      removeFromCollection: (perfumeId) =>
        set((state) => ({
          userCollection: state.userCollection.filter((id) => id !== perfumeId),
        })),

      // Joined Communities
      joinedCommunities: [],
      joinCommunity: (communityId) =>
        set((state) => ({
          joinedCommunities: [...state.joinedCommunities, communityId],
        })),
      leaveCommunity: (communityId) =>
        set((state) => ({
          joinedCommunities: state.joinedCommunities.filter((id) => id !== communityId),
        })),

      // Liked Collections
      likedCollections: [],
      toggleLikeCollection: (collectionId) =>
        set((state) => ({
          likedCollections: state.likedCollections.includes(collectionId)
            ? state.likedCollections.filter((id) => id !== collectionId)
            : [...state.likedCollections, collectionId],
        })),

      // Community posts (only creators can author these)
      communityPosts: {
        "1": [
          {
            id: "cp1-1",
            author: { name: "Elena Perfumes", username: "@elenaperfumes", avatar: "/elegant-woman-portrait.png", tags: ["Experta en Oud"] },
            content: "Bienvenidos a Amantes del Oud. Esta semana hablaremos del Oud Ispahan de Dior y su comparación con clásicos árabes.",
            image: "/luxury-oud-perfume-bottle-gold.jpg",
            likes: 142,
            comments: [
              { id: "cpc1", author: { name: "María García", username: "@mariaoud", avatar: "/elegant-woman-portrait.png" }, content: "¡Genial! Llevo tiempo esperando esta comparativa.", createdAt: "1h", likes: 8 },
            ],
            shares: 12, liked: false, saved: false, createdAt: "3h",
          },
          {
            id: "cp1-2",
            author: { name: "Elena Perfumes", username: "@elenaperfumes", avatar: "/elegant-woman-portrait.png", tags: ["Experta en Oud"] },
            content: "Catas virtuales de oud cambodiano este viernes. Reserva tu plaza en el evento de la comunidad.",
            likes: 88, comments: [], shares: 5, liked: false, saved: false, createdAt: "1d",
          },
        ],
        "2": [
          {
            id: "cp2-1",
            author: { name: "Luis Fernández", username: "@luisperfumes", avatar: "/man-sophisticated-portrait.jpg", tags: ["Coleccionista"] },
            content: "Nuevas adquisiciones de enero: tres piezas raras de Xerjoff y un descatalogado de Amouage. Pronto reviews.",
            image: "/luxury-perfume-collection-display-oud.jpg",
            likes: 203, comments: [
              { id: "cpc2", author: { name: "Elena Martín", username: "@elena_oud", avatar: "/elegant-woman-avatar.jpg" }, content: "¡Qué envidia sana! Espero las reviews.", createdAt: "2h", likes: 6 },
            ], shares: 14, liked: false, saved: false, createdAt: "5h",
          },
        ],
        "3": [
          {
            id: "cp3-1",
            author: { name: "Ana Rodríguez", username: "@ana_scents", avatar: "/woman-portrait-elegant-style.jpg", tags: ["Blogger"] },
            content: "Oud Wood 2024 reformulado: análisis completo en el blog. Spoiler: la base es diferente pero sigue siendo Tom Ford.",
            image: "/tom-ford-oud-wood-perfume.jpg",
            likes: 312, comments: [
              { id: "cpc3", author: { name: "Carlos Mendez", username: "@carlosfragrance", avatar: "/man-portrait-sophisticated.jpg" }, content: "Lo noté también, menos resinoso que el original.", createdAt: "30m", likes: 14 },
            ], shares: 28, liked: false, saved: false, createdAt: "1h",
          },
        ],
        "4": [
          {
            id: "cp4-1",
            author: { name: "Laura Torres", username: "@lauraperfume", avatar: "/woman-portrait-elegant-style.jpg", tags: ["Experta"] },
            content: "Mi primer perfume casero terminado. Compartiré la receta y las proporciones en el próximo post.",
            image: "/perfume-workshop-artisan.jpg",
            likes: 96, comments: [], shares: 7, liked: false, saved: false, createdAt: "6h",
          },
        ],
        "5": [
          {
            id: "cp5-1",
            author: { name: "Javier López", username: "@javierfragrances", avatar: "/man-sophisticated-portrait.jpg", tags: ["Experto"] },
            content: "Crónica de mi viaje al zoco de Dubai. Encontré attars únicos y bakhoor de altísima calidad.",
            image: "/dubai-perfume-souq.jpg",
            likes: 245, comments: [
              { id: "cpc4", author: { name: "Elena Martín", username: "@elena_oud", avatar: "/elegant-woman-avatar.jpg" }, content: "¡Esos zocos son mágicos! ¿Compraste algún oud puro?", createdAt: "2h", likes: 9 },
            ], shares: 22, liked: false, saved: false, createdAt: "4h",
          },
        ],
        "6": [
          {
            id: "cp6-1",
            author: { name: "Carlos Mendez", username: "@carlosfragrance", avatar: "/man-portrait-sophisticated.jpg", tags: ["Reviewer"] },
            content: "Review completa: Xerjoff Naxos. Tabaco dulce, miel y especias. Una bomba de proyección.",
            image: "/xerjoff-perfume-bottle-luxury.jpg",
            likes: 421, comments: [
              { id: "cpc5", author: { name: "María García", username: "@mariaoud", avatar: "/elegant-woman-portrait.png" }, content: "Naxos es de mis favoritos del invierno.", createdAt: "1h", likes: 18 },
            ], shares: 36, liked: false, saved: false, createdAt: "2h",
          },
        ],
      },
      toggleCommunityLike: (communityId, postId) =>
        set((state) => ({
          communityPosts: {
            ...state.communityPosts,
            [communityId]: (state.communityPosts[communityId] || []).map((p) =>
              p.id === postId ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p,
            ),
          },
        })),
      toggleCommunitySave: (communityId, postId) =>
        set((state) => ({
          communityPosts: {
            ...state.communityPosts,
            [communityId]: (state.communityPosts[communityId] || []).map((p) =>
              p.id === postId ? { ...p, saved: !p.saved } : p,
            ),
          },
        })),
      addCommunityComment: (communityId, postId, comment) =>
        set((state) => ({
          communityPosts: {
            ...state.communityPosts,
            [communityId]: (state.communityPosts[communityId] || []).map((p) =>
              p.id === postId
                ? { ...p, comments: [...p.comments, { ...comment, id: `cpc${Date.now()}`, createdAt: "Ahora", likes: 0 }] }
                : p,
            ),
          },
        })),


      // Notifications
      notifications: [
        {
          id: "n1",
          type: "like",
          from: { name: "Carlos Mendez", username: "@carlosfragrance", avatar: "/man-portrait-sophisticated.jpg" },
          content: "le dio me gusta a tu publicación",
          postId: "1",
          read: false,
          createdAt: "5m",
        },
        {
          id: "n2",
          type: "comment",
          from: { name: "Elena Martín", username: "@elena_oud", avatar: "/elegant-woman-avatar.jpg" },
          content: "comentó en tu publicación: '¡Increíble colección!'",
          postId: "2",
          read: false,
          createdAt: "15m",
        },
        {
          id: "n3",
          type: "follow",
          from: { name: "Pedro Sánchez", username: "@pedroscents", avatar: "/man-portrait-sophisticated.jpg" },
          content: "comenzó a seguirte",
          read: false,
          createdAt: "1h",
        },
        {
          id: "n4",
          type: "mention",
          from: { name: "Ana Rodríguez", username: "@ana_scents", avatar: "/woman-portrait-elegant-style.jpg" },
          content: "te mencionó en una publicación",
          postId: "3",
          read: true,
          createdAt: "2h",
        },
        {
          id: "n5",
          type: "like",
          from: { name: "Javier López", username: "@javierfragrances", avatar: "/man-sophisticated-portrait.jpg" },
          content: "le dio me gusta a tu comentario",
          read: true,
          createdAt: "3h",
        },
      ],
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),
      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      // Messages
      conversations: [
        {
          id: "conv1",
          participant: { name: "Carlos Mendez", username: "@carlosfragrance", avatar: "/man-portrait-sophisticated.jpg" },
          lastMessage: "¿Has probado el nuevo Amouage?",
          unreadCount: 2,
          createdAt: "10m",
        },
        {
          id: "conv2",
          participant: { name: "Elena Martín", username: "@elena_oud", avatar: "/elegant-woman-avatar.jpg" },
          lastMessage: "Gracias por la recomendación!",
          unreadCount: 0,
          createdAt: "1h",
        },
        {
          id: "conv3",
          participant: { name: "Ana Rodríguez", username: "@ana_scents", avatar: "/woman-portrait-elegant-style.jpg" },
          lastMessage: "Te paso el link del blog",
          unreadCount: 1,
          createdAt: "3h",
        },
      ],
      messages: [
        {
          id: "m1",
          from: { name: "Carlos Mendez", username: "@carlosfragrance", avatar: "/man-portrait-sophisticated.jpg" },
          to: { name: "María García", username: "@mariaoud", avatar: "/elegant-woman-portrait.png" },
          content: "¡Hola María! ¿Has probado el nuevo Amouage?",
          read: false,
          createdAt: "10m",
        },
        {
          id: "m2",
          from: { name: "Carlos Mendez", username: "@carlosfragrance", avatar: "/man-portrait-sophisticated.jpg" },
          to: { name: "María García", username: "@mariaoud", avatar: "/elegant-woman-portrait.png" },
          content: "Creo que te encantaría, tiene notas de oud increíbles",
          read: false,
          createdAt: "8m",
        },
      ],
      sendMessage: (toUsername, content) =>
        set((state) => {
          const toUser = state.users.find((u) => u.username === toUsername)
          if (!toUser) return state
          const newMessage: Message = {
            id: `m${Date.now()}`,
            from: {
              name: state.userProfile.name,
              username: state.userProfile.username,
              avatar: state.userProfile.avatar,
            },
            to: {
              name: toUser.name,
              username: toUser.username,
              avatar: toUser.avatar,
            },
            content,
            read: true,
            createdAt: "Ahora",
          }
          // Update or create conversation
          const existingConv = state.conversations.find((c) => c.participant.username === toUsername)
          const updatedConversations = existingConv
            ? state.conversations.map((c) =>
                c.participant.username === toUsername ? { ...c, lastMessage: content, createdAt: "Ahora" } : c,
              )
            : [
                {
                  id: `conv${Date.now()}`,
                  participant: { name: toUser.name, username: toUser.username, avatar: toUser.avatar },
                  lastMessage: content,
                  unreadCount: 0,
                  createdAt: "Ahora",
                },
                ...state.conversations,
              ]
          return {
            messages: [...state.messages, newMessage],
            conversations: updatedConversations,
          }
        }),
      markMessageRead: (id) =>
        set((state) => ({
          messages: state.messages.map((m) => (m.id === id ? { ...m, read: true } : m)),
        })),

      // Theme
      theme: "light",
      setTheme: (t) => set({ theme: t }),
    }),
    {
      name: "aoud-storage",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        isGuest: state.isGuest,
        authUser: state.authUser,
        userProfile: state.userProfile,
        cartItems: state.cartItems,
        joinedCommunities: state.joinedCommunities,
        likedCollections: state.likedCollections,
        userCollection: state.userCollection,
        savedPosts: state.savedPosts,
        followingUsers: state.followingUsers,
        language: state.language,
        theme: state.theme,
      }),
      onRehydrateStorage: () => () => {
        // Mark hydration complete so SSR-driven redirects don't flash
        _markHydrated()
      },
    }
  )
)

// Tracks whether the persisted store has rehydrated from localStorage.
// Used to gate auth-based redirects so we don't flash a login screen on reload.

const hydratedStore = create<{ hydrated: boolean }>(() => ({
  hydrated: false,
}))

// Overload to support both selector-based and direct usage.
// Always resolves to true after client mount as a safety net against
// persist middleware skipping the rehydrate callback (e.g. fresh visits
// with no stored data under SSR).
export function useHasHydrated<T = boolean>(
  selector?: (s: { hydrated: boolean }) => T,
): T {
  const stateValue = hydratedStore(
    (selector ?? ((s) => s.hydrated as unknown as T)) as (s: { hydrated: boolean }) => T,
  )
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
    if (!hydratedStore.getState().hydrated) {
      hydratedStore.setState({ hydrated: true })
    }
  }, [])
  if (!selector) {
    return (mounted || (stateValue as unknown as boolean)) as unknown as T
  }
  return stateValue
}

// Internal accessor used by the persist onRehydrateStorage callback.
export const _markHydrated = () => hydratedStore.setState({ hydrated: true })
