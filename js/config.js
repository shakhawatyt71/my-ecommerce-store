/*
 * ⚙️ KORA PORT — Store Configuration (Updated)
 */
const CONFIG = {
  store: {
    name: "Kora Port",
    tagline: "Redefine Your Style",
    description: "Premium Men's Fashion & Lifestyle Store",
    email: "shakhawatyt77@gmail.com",
    contactEmail: "contact@koraport.com",
    phone: "+8801935158745",
    whatsapp: "+8801935158745"
  },
  currency: { symbol: "৳", code: "BDT", position: "before" },
  payment: {
    bkash: { number: "01306267594", type: "Personal", enabled: true },
    nagad: { number: "01935158745", type: "Personal", enabled: true },
    cod: { enabled: true, label: "Cash on Delivery" },
    bank: { enabled: true, label: "Bank Transfer", note: "Coming Soon" },
    card: { enabled: true, label: "Debit/Credit Card", note: "Coming Soon" }
  },
  shipping: {
    insideDhaka: 60,
    outsideDhaka: 120,
    freeShippingMin: 2999,
    estimatedDelivery: { insideDhaka: "1-2 দিন", outsideDhaka: "3-5 দিন" }
  },
  social: {
    facebook: "https://www.facebook.com/thekoraport",
    instagram: "https://www.instagram.com/eldoradotale/",
    tiktok: "https://www.tiktok.com/kora.port",
    whatsappChat: "https://wa.me/8801935158745"
  },
  tracking: { gtmId: "GTM-TWPPQPTG" },
  coupons: [
    { code: "KORA10", discount: 10, type: "percent", active: true },
    { code: "APNALOK20", discount: 20, type: "percent", active: true }
  ],
  settings: {
    productsPerPage: 12,
    orderPrefix: "KP",
    adminPassword: "koraport2024"
  }
};