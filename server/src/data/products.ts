import { Product } from '../types.js';

export const INITIAL_PRODUCTS: Product[] = [
  // --- Electronics ---
  {
    product_id: 'PROD-1001',
    product_name: 'boAt Rockerz 450 Bluetooth On-Ear Headphones',
    category: 'Electronics',
    price: 1499,
    stock: 85,
    rating: 4.4,
    description: 'Up to 15 hours battery life, 40mm dynamic drivers, padded ear cushions and integrated mic for crystal clear calls.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    brand: 'boAt'
  },
  {
    product_id: 'PROD-1002',
    product_name: 'Noise ColorFit Pulse 2 Max Smartwatch',
    category: 'Electronics',
    price: 1999,
    stock: 64,
    rating: 4.3,
    description: '1.85 inch TFT LCD display, 550 nits brightness, Bluetooth calling, 100 sports modes, and SpO2 tracking.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    brand: 'Noise'
  },
  {
    product_id: 'PROD-1003',
    product_name: 'OnePlus Bullets Wireless Z2 Earphones',
    category: 'Electronics',
    price: 1799,
    stock: 92,
    rating: 4.5,
    description: 'Acoustic 12.4mm bass drivers, 30 hours playback, 10-minute quick charge for 20 hours music, IP55 sweat resistance.',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    brand: 'OnePlus'
  },
  {
    product_id: 'PROD-1004',
    product_name: 'Portronics SoundDrum 15W Portable Speaker',
    category: 'Electronics',
    price: 1299,
    stock: 45,
    rating: 4.2,
    description: '15W powerful stereo audio, in-built FM radio, Type-C fast charging, and TWS connectivity support.',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
    brand: 'Portronics'
  },
  {
    product_id: 'PROD-1005',
    product_name: 'Mi Power Bank 3i 20000mAh Fast Charging',
    category: 'Electronics',
    price: 2199,
    stock: 110,
    rating: 4.6,
    description: '18W fast charging with triple output ports, advanced 12-layer circuit protection, and smart power management.',
    image: 'https://images.unsplash.com/photo-1609592426505-dd8b22a61159?auto=format&fit=crop&w=800&q=80',
    brand: 'Xiaomi'
  },
  {
    product_id: 'PROD-1006',
    product_name: 'Logitech MK240 Wireless Keyboard & Mouse Combo',
    category: 'Electronics',
    price: 1695,
    stock: 38,
    rating: 4.4,
    description: 'Space-saving compact keyboard layout with splash-proof design, smooth optical tracking, 36-month battery life.',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    brand: 'Logitech'
  },

  // --- Clothing ---
  {
    product_id: 'PROD-1007',
    product_name: 'FabIndia Pure Cotton Printed Kurta',
    category: 'Clothing',
    price: 2490,
    stock: 50,
    rating: 4.5,
    description: 'Authentic handcrafted breathable cotton long kurta with mandarin collar, ideal for casual and festive occasions.',
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
    brand: 'FabIndia'
  },
  {
    product_id: 'PROD-1008',
    product_name: 'Raymond Formal Slim Fit Poly-Viscose Trousers',
    category: 'Clothing',
    price: 1899,
    stock: 42,
    rating: 4.3,
    description: 'Crisp tailored flat-front formal trousers in charcoal grey with wrinkle-resistant premium stretch fabric.',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
    brand: 'Raymond'
  },
  {
    product_id: 'PROD-1009',
    product_name: 'W for Woman Floral A-Line Anarkali Kurti',
    category: 'Clothing',
    price: 2199,
    stock: 58,
    rating: 4.6,
    description: 'Elegant festive rayon flared anarkali kurti featuring intricate gold foil print and stylish round neck.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    brand: 'W for Woman'
  },
  {
    product_id: 'PROD-1010',
    product_name: 'Allen Solly Men Solid Regular Fit Polo',
    category: 'Clothing',
    price: 999,
    stock: 75,
    rating: 4.3,
    description: 'Classic pique cotton polo t-shirt with signature brand stag embroidery, ribbed collar and cuff detailing.',
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80',
    brand: 'Allen Solly'
  },
  {
    product_id: 'PROD-1011',
    product_name: 'Biba Embroidered Straight Cotton Suit Set',
    category: 'Clothing',
    price: 3499,
    stock: 30,
    rating: 4.7,
    description: '3-piece ethnic ensemble consisting of an embroidered kurta, straight pants, and printed lightweight dupatta.',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    brand: 'Biba'
  },

  // --- Shoes ---
  {
    product_id: 'PROD-1012',
    product_name: 'Puma Men Comet 2 Alt Running Shoes',
    category: 'Shoes',
    price: 2799,
    stock: 55,
    rating: 4.4,
    description: 'Featherlight cushioned running sneakers with SoftFoam+ sockliner and high-traction rubber outsole.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    brand: 'Puma'
  },
  {
    product_id: 'PROD-1013',
    product_name: 'Red Tape Men Classic Leather Chelsea Boots',
    category: 'Shoes',
    price: 3299,
    stock: 34,
    rating: 4.5,
    description: 'Genuine high-grade leather ankle boots with dual stretch side panels and cushioned memory foam insole.',
    image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=800&q=80',
    brand: 'Red Tape'
  },
  {
    product_id: 'PROD-1014',
    product_name: 'Bata Women Formal Pointed Block Heels',
    category: 'Shoes',
    price: 1499,
    stock: 48,
    rating: 4.2,
    description: 'Sophisticated 2-inch block heels crafted with anti-slip synthetic sole and cushioned footbed for all-day office comfort.',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
    brand: 'Bata'
  },
  {
    product_id: 'PROD-1015',
    product_name: 'Campus Men Oxyfit Lightweight Walking Shoes',
    category: 'Shoes',
    price: 1199,
    stock: 80,
    rating: 4.3,
    description: 'Air-capsule responsive sole with breathable knitted mesh upper for daily morning walks and gym sessions.',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80',
    brand: 'Campus'
  },
  {
    product_id: 'PROD-1016',
    product_name: 'Woodland Camel Casual Leather Loafers',
    category: 'Shoes',
    price: 3995,
    stock: 29,
    rating: 4.6,
    description: 'Rugged nubuck leather slip-on shoes with heavy-duty grooved rubber sole engineered for outdoor durability.',
    image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=800&q=80',
    brand: 'Woodland'
  },

  // --- Accessories ---
  {
    product_id: 'PROD-1017',
    product_name: 'Titan Karishma Analog Watch with Champagne Dial',
    category: 'Accessories',
    price: 2395,
    stock: 62,
    rating: 4.6,
    description: 'Water-resistant mineral quartz analog watch with gold-plated metallic strap and elegant date display window.',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80',
    brand: 'Titan'
  },
  {
    product_id: 'PROD-1018',
    product_name: 'Fastrack Polarized Aviator Sunglasses',
    category: 'Accessories',
    price: 1350,
    stock: 50,
    rating: 4.3,
    description: '100% UV400 protected glare-free metal frame shades designed for modern style and outdoor eye protection.',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    brand: 'Fastrack'
  },
  {
    product_id: 'PROD-1019',
    product_name: 'Wildcraft 35L Water Resistant Laptop Backpack',
    category: 'Accessories',
    price: 1899,
    stock: 70,
    rating: 4.5,
    description: 'Multi-compartment ergonomic backpack featuring dedicated 15.6 inch padded laptop sleeve and rain cover.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    brand: 'Wildcraft'
  },
  {
    product_id: 'PROD-1020',
    product_name: 'Hidesign Genuine Full-Grain Leather Bi-Fold Wallet',
    category: 'Accessories',
    price: 2495,
    stock: 35,
    rating: 4.7,
    description: 'Vegetable-tanned handcrafted cowhide leather wallet with 8 card slots, RFID blocking layer, and coin pocket.',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    brand: 'Hidesign'
  },
  {
    product_id: 'PROD-1021',
    product_name: 'Caprese Women Faux Leather Structured Tote Bag',
    category: 'Accessories',
    price: 2899,
    stock: 40,
    rating: 4.4,
    description: 'Spacious dual-handle designer tote bag in blush pink with gold metallic logo charm and zippered organizer pouch.',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    brand: 'Caprese'
  },

  // --- Home & Kitchen ---
  {
    product_id: 'PROD-1022',
    product_name: 'Prestige Deluxe Alpha Stainless Steel Pressure Cooker 3L',
    category: 'Home & Kitchen',
    price: 2250,
    stock: 80,
    rating: 4.6,
    description: 'Induction and gas compatible thick alpha base pressure cooker with pressure indicator and safety release valve.',
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80',
    brand: 'Prestige'
  },
  {
    product_id: 'PROD-1023',
    product_name: 'Pigeon by Stovekraft 1.5L Stainless Steel Electric Kettle',
    category: 'Home & Kitchen',
    price: 699,
    stock: 120,
    rating: 4.3,
    description: '1500W rapid boil kettle with automatic shut-off safety protection, 360-degree swivel cordless power base.',
    image: 'https://images.unsplash.com/photo-1594213114663-ddf4f240f084?auto=format&fit=crop&w=800&q=80',
    brand: 'Pigeon'
  },
  {
    product_id: 'PROD-1024',
    product_name: 'Borosil Stainless Steel Insulated Hydra Trek Flask 700ml',
    category: 'Home & Kitchen',
    price: 945,
    stock: 95,
    rating: 4.5,
    description: 'Double-walled vacuum insulation keeps liquids cold for 24 hours or hot for 14 hours. 100% leak proof.',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
    brand: 'Borosil'
  },
  {
    product_id: 'PROD-1025',
    product_name: 'Philips Daily Collection 500W Mixer Grinder',
    category: 'Home & Kitchen',
    price: 2899,
    stock: 40,
    rating: 4.4,
    description: 'Heavy duty motor with 3 stainless steel jars for wet grinding, dry grinding, and smooth chutney preparation.',
    image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80',
    brand: 'Philips'
  },
  {
    product_id: 'PROD-1026',
    product_name: 'Solimo 100% Cotton 300TC Double Bedsheet with Pillows',
    category: 'Home & Kitchen',
    price: 1299,
    stock: 65,
    rating: 4.3,
    description: 'Sateen weave ultra-soft king size pure cotton bedsheet with two matching pillow covers, fade resistant.',
    image: 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=800&q=80',
    brand: 'Solimo'
  },

  // --- Beauty ---
  {
    product_id: 'PROD-1027',
    product_name: 'Mamaearth Onion Hair Fall Control Oil with Redensyl 150ml',
    category: 'Beauty',
    price: 419,
    stock: 140,
    rating: 4.4,
    description: 'Enriched with sulfur and potassium to boost hair growth, minimize breakage, and nourish scalp roots naturally.',
    image: 'https://images.unsplash.com/photo-1608248597359-bb582311b7d5?auto=format&fit=crop&w=800&q=80',
    brand: 'Mamaearth'
  },
  {
    product_id: 'PROD-1028',
    product_name: 'The Derma Co 1% Hyaluronic Sunscreen Aqua Gel SPF 50',
    category: 'Beauty',
    price: 499,
    stock: 115,
    rating: 4.6,
    description: 'Non-greasy, fragrance-free broad spectrum PA++++ sunscreen with Vitamin E that leaves zero white cast.',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    brand: 'The Derma Co'
  },
  {
    product_id: 'PROD-1029',
    product_name: 'Forest Essentials Delicate Facial Cleanser Kashmiri Saffron',
    category: 'Beauty',
    price: 1550,
    stock: 35,
    rating: 4.8,
    description: 'Ayurvedic infusion of pure saffron, neem leaves and kewda flower water to gently purify and illuminate complexion.',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80',
    brand: 'Forest Essentials'
  },
  {
    product_id: 'PROD-1030',
    product_name: 'Biotique Bio Kelp Protein Complex Anti Hair Fall Shampoo',
    category: 'Beauty',
    price: 299,
    stock: 160,
    rating: 4.2,
    description: '100% botanical extract formula blend of pure kelp, peppermint oil and bhringraj for invigorating healthy hair wash.',
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80',
    brand: 'Biotique'
  },
  {
    product_id: 'PROD-1031',
    product_name: 'Plum Green Tea Alcohol-Free Clarifying Face Toner',
    category: 'Beauty',
    price: 390,
    stock: 85,
    rating: 4.5,
    description: 'Infused with green tea antioxidants and glycolic acid to tone skin pores and control excess sebum secretion.',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
    brand: 'Plum'
  },

  // --- Sports ---
  {
    product_id: 'PROD-1032',
    product_name: 'Yonex Muscle Power 29 Light Badminton Racquet',
    category: 'Sports',
    price: 2490,
    stock: 45,
    rating: 4.6,
    description: 'Isometric carbon graphite frame with shock-damping grommet system for maximum smash power and pinpoint accuracy.',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
    brand: 'Yonex'
  },
  {
    product_id: 'PROD-1033',
    product_name: 'Nivia Storm Rubber Football Size 5',
    category: 'Sports',
    price: 649,
    stock: 75,
    rating: 4.3,
    description: 'All-weather 32-panel durable rubber molded football suitable for hard grounds, turf, and wet outdoor conditions.',
    image: 'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?auto=format&fit=crop&w=800&q=80',
    brand: 'Nivia'
  },
  {
    product_id: 'PROD-1034',
    product_name: 'Strauss Anti-Skid Extra Thick 6mm Yoga Mat',
    category: 'Sports',
    price: 899,
    stock: 90,
    rating: 4.4,
    description: 'High-density EVA foam mat with non-slip dual ribbed texture, carrying strap included, eco-friendly and moisture resistant.',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80',
    brand: 'Strauss'
  },
  {
    product_id: 'PROD-1035',
    product_name: 'Kobo Cast Iron Hex Dumbbell Pair 5kg x 2',
    category: 'Sports',
    price: 1999,
    stock: 40,
    rating: 4.7,
    description: 'Solid hexagonal cast-iron weights coated with heavy rubber to prevent floor chipping and noise during workout sets.',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80',
    brand: 'Kobo'
  }
];

