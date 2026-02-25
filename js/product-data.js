/*
 * ==========================================
 * 📦 KORA PORT — Products & Categories Data
 * ==========================================
 */

const CATEGORIES = [
  { id: "tshirt",     name: "T-Shirt",          icon: "👕", type: "regular" },
  { id: "shirt",      name: "Shirt",            icon: "👔", type: "regular" },
  { id: "pants",      name: "Pants",            icon: "👖", type: "regular" },
  { id: "panjabi",    name: "Panjabi",          icon: "🥻", type: "regular" },
  { id: "hoodie",     name: "Hoodie & Jacket",  icon: "🧥", type: "regular" },
  { id: "underwear",  name: "Innerwear",        icon: "🩲", type: "regular" },
  { id: "accessories",name: "Accessories",      icon: "⌚", type: "regular" },
  { id: "new-arrivals",    name: "New Arrivals",    icon: "🆕", type: "special" },
  { id: "hot-sales",       name: "Hot Sales",       icon: "🔥", type: "special" },
  { id: "stock-clearance", name: "Stock Clearance",  icon: "💥", type: "special" },
  { id: "eid-special",     name: "Eid Special",     icon: "🌙", type: "special" }
];

const PRODUCTS = [
  {
    id: "p1",
    name: "Premium Cotton Round Neck T-Shirt",
    shortDesc: "Ultra-soft 100% combed cotton, everyday essential",
    description: "Experience ultimate comfort with our Premium Cotton T-Shirt. Made from 100% combed cotton, featuring reinforced stitching, ribbed collar, and pre-shrunk fabric for a lasting perfect fit.",
    price: 699,
    discountPrice: 499,
    categories: ["tshirt", "new-arrivals"],
    image: "https://placehold.co/500x600/222222/ffffff?text=Cotton+Tee",
    sizes: ["M", "L", "XL", "XXL"],
    colors: [
      { name: "Black", code: "#222222" },
      { name: "White", code: "#FFFFFF" },
      { name: "Navy", code: "#1B2A4A" }
    ],
    stock: 45,
    rating: 4.5,
    reviewCount: 28,
    badge: "new",
    featured: true
  },
  {
    id: "p2",
    name: "Oversized Drop Shoulder Tee",
    shortDesc: "Trendy oversized fit with drop shoulder design",
    description: "Stay on trend with our Oversized Drop Shoulder Tee. Features a relaxed, streetwear-inspired silhouette with premium cotton-polyester blend fabric.",
    price: 899,
    discountPrice: 649,
    categories: ["tshirt", "hot-sales"],
    image: "https://placehold.co/500x600/4A5530/ffffff?text=Oversized+Tee",
    sizes: ["M", "L", "XL", "XXL"],
    colors: [
      { name: "Olive", code: "#4A5530" },
      { name: "Black", code: "#222222" },
      { name: "Cream", code: "#F5F0E1" }
    ],
    stock: 32,
    rating: 4.3,
    reviewCount: 15,
    badge: "hot",
    featured: true
  },
  {
    id: "p3",
    name: "Vintage Acid Wash T-Shirt",
    shortDesc: "Retro acid wash finish with a modern cut",
    description: "Stand out with our Vintage Acid Wash T-Shirt. Each piece is uniquely washed for a one-of-a-kind retro look.",
    price: 599,
    discountPrice: 449,
    categories: ["tshirt"],
    image: "https://placehold.co/500x600/6B7280/ffffff?text=Acid+Wash+Tee",
    sizes: ["M", "L", "XL"],
    colors: [
      { name: "Grey", code: "#6B7280" },
      { name: "Charcoal", code: "#374151" }
    ],
    stock: 20,
    rating: 4.1,
    reviewCount: 9,
    badge: null,
    featured: false
  },
  {
    id: "p4",
    name: "Classic Stripe Polo Shirt",
    shortDesc: "Timeless polo with contrast stripe detail",
    description: "Elevate your casual style with our Classic Stripe Polo. Features a traditional collar and two-button placket.",
    price: 899,
    discountPrice: 499,
    categories: ["tshirt", "stock-clearance"],
    image: "https://placehold.co/500x600/1B2A4A/ffffff?text=Stripe+Polo",
    sizes: ["M", "L", "XL", "XXL"],
    colors: [
      { name: "Navy/White", code: "#1B2A4A" },
      { name: "Black/Red", code: "#222222" }
    ],
    stock: 12,
    rating: 4.0,
    reviewCount: 34,
    badge: "sale",
    featured: false
  },
  {
    id: "p5",
    name: "Slim Fit Premium Casual Shirt",
    shortDesc: "Modern slim fit with premium cotton fabric",
    description: "Our Slim Fit Premium Casual Shirt offers a tailored look with comfortable stretch. Perfect for office or smart-casual occasions.",
    price: 1299,
    discountPrice: 999,
    categories: ["shirt", "new-arrivals"],
    image: "https://placehold.co/500x600/5B9BD5/ffffff?text=Casual+Shirt",
    sizes: ["M", "L", "XL", "XXL"],
    colors: [
      { name: "Sky Blue", code: "#5B9BD5" },
      { name: "White", code: "#FFFFFF" },
      { name: "Navy", code: "#1B2A4A" }
    ],
    stock: 38,
    rating: 4.6,
    reviewCount: 19,
    badge: "new",
    featured: true
  },
  {
    id: "p6",
    name: "Premium Oxford Button-Down Shirt",
    shortDesc: "Classic Oxford weave with button-down collar",
    description: "A wardrobe essential — our Premium Oxford Shirt features authentic Oxford weave fabric and button-down collar.",
    price: 1499,
    discountPrice: null,
    categories: ["shirt"],
    image: "https://placehold.co/500x600/E8E8E8/333333?text=Oxford+Shirt",
    sizes: ["M", "L", "XL", "XXL"],
    colors: [
      { name: "White", code: "#FFFFFF" },
      { name: "Light Blue", code: "#B0D4F1" },
      { name: "Pink", code: "#F0C0C0" }
    ],
    stock: 25,
    rating: 4.7,
    reviewCount: 22,
    badge: null,
    featured: false
  },
  {
    id: "p7",
    name: "Breathable Linen Summer Shirt",
    shortDesc: "Lightweight linen blend, perfect for summer",
    description: "Stay cool in our Breathable Linen Shirt. Made from a premium linen-cotton blend with a mandarin collar.",
    price: 1199,
    discountPrice: 699,
    categories: ["shirt", "stock-clearance", "hot-sales"],
    image: "https://placehold.co/500x600/C3B091/333333?text=Linen+Shirt",
    sizes: ["M", "L", "XL"],
    colors: [
      { name: "Cream", code: "#F5F0E1" },
      { name: "Olive", code: "#4A5530" },
      { name: "Sky Blue", code: "#87CEEB" }
    ],
    stock: 8,
    rating: 4.2,
    reviewCount: 11,
    badge: "sale",
    featured: false
  },
  {
    id: "p8",
    name: "Slim Fit Chino Pants",
    shortDesc: "Classic chino with stretch comfort",
    description: "Our Slim Fit Chino Pants combine style and comfort. Made from stretch cotton twill with a modern slim profile.",
    price: 1299,
    discountPrice: 999,
    categories: ["pants", "new-arrivals"],
    image: "https://placehold.co/500x600/C3B091/333333?text=Chino+Pants",
    sizes: ["28", "30", "32", "34", "36"],
    colors: [
      { name: "Khaki", code: "#C3B091" },
      { name: "Navy", code: "#1B2A4A" },
      { name: "Olive", code: "#4A5530" }
    ],
    stock: 40,
    rating: 4.4,
    reviewCount: 31,
    badge: "new",
    featured: true
  },
  {
    id: "p9",
    name: "Relaxed Fit Jogger Pants",
    shortDesc: "Ultimate comfort jogger with tapered leg",
    description: "Chill in style with our Relaxed Fit Jogger Pants. Made from soft French terry cotton with elastic waistband.",
    price: 999,
    discountPrice: 749,
    categories: ["pants", "hot-sales"],
    image: "https://placehold.co/500x600/374151/ffffff?text=Jogger+Pants",
    sizes: ["M", "L", "XL", "XXL"],
    colors: [
      { name: "Black", code: "#222222" },
      { name: "Grey", code: "#6B7280" },
      { name: "Navy", code: "#1B2A4A" }
    ],
    stock: 55,
    rating: 4.5,
    reviewCount: 42,
    badge: "hot",
    featured: false
  },
  {
    id: "p10",
    name: "Classic Denim Jeans",
    shortDesc: "Premium denim with comfortable stretch",
    description: "Our Classic Denim Jeans are crafted from premium stretch denim for comfort and durability.",
    price: 1599,
    discountPrice: 1199,
    categories: ["pants"],
    image: "https://placehold.co/500x600/1E3A5F/ffffff?text=Denim+Jeans",
    sizes: ["28", "30", "32", "34", "36"],
    colors: [
      { name: "Dark Blue", code: "#1E3A5F" },
      { name: "Black", code: "#222222" },
      { name: "Light Blue", code: "#6B8EB5" }
    ],
    stock: 35,
    rating: 4.3,
    reviewCount: 27,
    badge: null,
    featured: false
  },
  {
    id: "p11",
    name: "Premium Embroidered Panjabi",
    shortDesc: "Elegant hand-embroidered premium cotton panjabi",
    description: "Make a statement with our Premium Embroidered Panjabi. Features intricate hand-embroidery on the chest and cuffs.",
    price: 2999,
    discountPrice: 2499,
    categories: ["panjabi", "eid-special"],
    image: "https://placehold.co/500x600/F5F0E1/333333?text=Embroidered+Panjabi",
    sizes: ["38", "40", "42", "44"],
    colors: [
      { name: "Off-White", code: "#FAF0E6" },
      { name: "Cream", code: "#F5F0E1" }
    ],
    stock: 25,
    rating: 4.8,
    reviewCount: 18,
    badge: "eid",
    featured: true
  },
  {
    id: "p12",
    name: "Classic White Cotton Panjabi",
    shortDesc: "Pure white cotton panjabi, timeless elegance",
    description: "Our Classic White Cotton Panjabi is a must-have for every man. Made from breathable pure cotton.",
    price: 1499,
    discountPrice: 1199,
    categories: ["panjabi", "eid-special"],
    image: "https://placehold.co/500x600/EEEEEE/333333?text=White+Panjabi",
    sizes: ["38", "40", "42", "44"],
    colors: [
      { name: "White", code: "#FFFFFF" },
      { name: "Off-White", code: "#FAF0E6" }
    ],
    stock: 30,
    rating: 4.6,
    reviewCount: 35,
    badge: "eid",
    featured: false
  },
  {
    id: "p13",
    name: "Designer Semi-Silk Panjabi",
    shortDesc: "Luxurious semi-silk with modern design",
    description: "Elevate your festive wardrobe with our Designer Semi-Silk Panjabi. Crafted from premium semi-silk fabric with a subtle sheen.",
    price: 3499,
    discountPrice: 2799,
    categories: ["panjabi", "eid-special", "new-arrivals"],
    image: "https://placehold.co/500x600/1B2A4A/ffffff?text=Silk+Panjabi",
    sizes: ["38", "40", "42", "44"],
    colors: [
      { name: "Navy", code: "#1B2A4A" },
      { name: "Maroon", code: "#6B1D2A" },
      { name: "Black", code: "#222222" }
    ],
    stock: 15,
    rating: 4.9,
    reviewCount: 8,
    badge: "eid",
    featured: true
  },
  {
    id: "p14",
    name: "Classic Pullover Hoodie",
    shortDesc: "Warm fleece-lined hoodie for cool days",
    description: "Stay warm and stylish with our Classic Pullover Hoodie. Features soft fleece lining and kangaroo pocket.",
    price: 1499,
    discountPrice: 1199,
    categories: ["hoodie", "new-arrivals"],
    image: "https://placehold.co/500x600/374151/ffffff?text=Pullover+Hoodie",
    sizes: ["M", "L", "XL", "XXL"],
    colors: [
      { name: "Charcoal", code: "#374151" },
      { name: "Black", code: "#222222" },
      { name: "Olive", code: "#4A5530" }
    ],
    stock: 28,
    rating: 4.4,
    reviewCount: 16,
    badge: "new",
    featured: true
  },
  {
    id: "p15",
    name: "Premium Zip-Up Hoodie",
    shortDesc: "Full-zip hoodie with premium finish",
    description: "Our Premium Zip-Up Hoodie offers versatile layering with a full metal zipper.",
    price: 1799,
    discountPrice: 1399,
    categories: ["hoodie"],
    image: "https://placehold.co/500x600/1B2A4A/ffffff?text=Zip+Hoodie",
    sizes: ["M", "L", "XL", "XXL"],
    colors: [
      { name: "Black", code: "#222222" },
      { name: "Navy", code: "#1B2A4A" },
      { name: "Beige", code: "#D2B48C" }
    ],
    stock: 22,
    rating: 4.5,
    reviewCount: 13,
    badge: null,
    featured: false
  },
  {
    id: "p16",
    name: "Cotton Boxer Briefs (3-Pack)",
    shortDesc: "Breathable cotton boxer briefs, pack of 3",
    description: "All-day comfort with our Cotton Boxer Briefs. Made from 95% cotton and 5% spandex for stretch and support.",
    price: 699,
    discountPrice: 499,
    categories: ["underwear"],
    image: "https://placehold.co/500x600/4d4d4d/ffffff?text=Boxer+Briefs",
    sizes: ["M", "L", "XL", "XXL"],
    colors: [{ name: "Black/Grey/Navy", code: "#333333" }],
    stock: 60,
    rating: 4.3,
    reviewCount: 45,
    badge: null,
    featured: false
  },
  {
    id: "p17",
    name: "Premium Trunks (3-Pack)",
    shortDesc: "Premium micro-modal trunks, ultimate comfort",
    description: "Experience luxury comfort with our Premium Trunks. Made from ultra-soft micro-modal fabric.",
    price: 899,
    discountPrice: 649,
    categories: ["underwear", "hot-sales"],
    image: "https://placehold.co/500x600/555555/ffffff?text=Premium+Trunks",
    sizes: ["M", "L", "XL", "XXL"],
    colors: [{ name: "Assorted Pack", code: "#444444" }],
    stock: 48,
    rating: 4.4,
    reviewCount: 38,
    badge: "hot",
    featured: false
  },
  {
    id: "p18",
    name: "Genuine Leather Belt",
    shortDesc: "Handcrafted genuine leather with classic buckle",
    description: "Complete your look with our Genuine Leather Belt. Handcrafted from full-grain leather with brushed metal buckle.",
    price: 799,
    discountPrice: 599,
    categories: ["accessories"],
    image: "https://placehold.co/500x600/6B3A2A/ffffff?text=Leather+Belt",
    sizes: ["Free Size"],
    colors: [
      { name: "Brown", code: "#6B3A2A" },
      { name: "Black", code: "#222222" }
    ],
    stock: 50,
    rating: 4.2,
    reviewCount: 29,
    badge: null,
    featured: false
  },
  {
    id: "p19",
    name: "Classic Aviator Sunglasses",
    shortDesc: "UV400 polarized aviator sunglasses",
    description: "Shield your eyes in style with our Classic Aviator Sunglasses. Features UV400 polarized lenses.",
    price: 999,
    discountPrice: 699,
    categories: ["accessories", "hot-sales"],
    image: "https://placehold.co/500x600/2d2d3d/ffffff?text=Aviator+Sunglasses",
    sizes: ["Free Size"],
    colors: [
      { name: "Gold/Brown", code: "#DAA520" },
      { name: "Silver/Grey", code: "#A8A9AD" },
      { name: "Black", code: "#222222" }
    ],
    stock: 35,
    rating: 4.6,
    reviewCount: 21,
    badge: "hot",
    featured: true
  },
  {
    id: "p20",
    name: "Minimalist Stainless Steel Watch",
    shortDesc: "Elegant minimalist watch with mesh band",
    description: "Timeless elegance meets modern minimalism. Features Japanese quartz movement and mesh band.",
    price: 2999,
    discountPrice: 2499,
    categories: ["accessories", "new-arrivals"],
    image: "https://placehold.co/500x600/A8A9AD/333333?text=Steel+Watch",
    sizes: ["Free Size"],
    colors: [
      { name: "Silver", code: "#A8A9AD" },
      { name: "Black", code: "#222222" },
      { name: "Rose Gold", code: "#B76E79" }
    ],
    stock: 15,
    rating: 4.7,
    reviewCount: 12,
    badge: "new",
    featured: false
  }
];

function getAllProducts() { return PRODUCTS; }
function getProductById(id) { return PRODUCTS.find(function(p) { return p.id === id; }); }
function getProductsByCategory(categoryId) {
  if (categoryId === "all") return PRODUCTS;
  return PRODUCTS.filter(function(p) { return p.categories.includes(categoryId); });
}
function getFeaturedProducts() { return PRODUCTS.filter(function(p) { return p.featured === true; }); }
function searchProducts(query) {
  var q = query.toLowerCase();
  return PRODUCTS.filter(function(p) {
    return p.name.toLowerCase().includes(q) || p.shortDesc.toLowerCase().includes(q) || p.categories.some(function(c) { return c.includes(q); });
  });
}
function getDiscountPercent(product) {
  if (!product.discountPrice) return 0;
  return Math.round(((product.price - product.discountPrice) / product.price) * 100);
}
function getEffectivePrice(product) { return product.discountPrice || product.price; }