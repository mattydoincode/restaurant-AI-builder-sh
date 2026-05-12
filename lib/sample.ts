import type { RestaurantData } from "./schema";

export const SAMPLE_RESTAURANT: RestaurantData = {
  name: "Pizzeria Lina",
  tagline: "Wood-fired Neapolitan pizza in the heart of the East Village",
  story:
    "Founded by sisters Lina and Marta in 2019, Pizzeria Lina brings the spirit of Naples to New York. We import our 00 flour and San Marzano tomatoes directly from Italy, and our dough ferments for 48 hours before meeting our 900-degree wood-fired oven. Every pie is hand-shaped, blistered, and ready in 90 seconds.",
  cuisine: "Neapolitan Italian",
  priceLevel: "$$",
  heroImageUrl:
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1600&q=80",
  gallery: [
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
  ],
  menu: [
    {
      id: "sec-1",
      name: "Antipasti",
      items: [
        {
          id: "i-1",
          name: "Burrata",
          description:
            "Creamy burrata, heirloom tomatoes, basil, aged balsamic",
          price: "$16",
          tags: ["V", "GF"],
          imageUrl:
            "https://images.unsplash.com/photo-1626200419199-391ae4be7a44?auto=format&fit=crop&w=800&q=80",
          gallery: [],
          chef: "",
        },
        {
          id: "i-2",
          name: "Polpette al Sugo",
          description: "House-made meatballs, San Marzano sauce, pecorino",
          price: "$14",
          tags: [],
          imageUrl:
            "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=800&q=80",
          gallery: [],
          chef: "",
        },
      ],
    },
    {
      id: "sec-2",
      name: "Pizze",
      items: [
        {
          id: "i-3",
          name: "Margherita D.O.P.",
          description:
            "San Marzano tomatoes, fior di latte, basil, extra virgin olive oil",
          price: "$18",
          tags: ["V"],
          imageUrl:
            "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=800&q=80",
          gallery: [
            "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",
          ],
          chef: "Marta Russo",
        },
        {
          id: "i-4",
          name: "Diavola",
          description: "Tomato, fior di latte, spicy soppressata, chili oil",
          price: "$21",
          tags: ["Spicy"],
          imageUrl:
            "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80",
          gallery: [],
          chef: "",
        },
        {
          id: "i-5",
          name: "Funghi e Tartufo",
          description:
            "Wild mushrooms, truffle cream, fontina, thyme",
          price: "$24",
          tags: ["V"],
          imageUrl:
            "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=800&q=80",
          gallery: [],
          chef: "",
        },
      ],
    },
    {
      id: "sec-3",
      name: "Dolci",
      items: [
        {
          id: "i-6",
          name: "Tiramisu",
          description: "Espresso-soaked ladyfingers, mascarpone, cocoa",
          price: "$11",
          tags: ["V"],
          imageUrl:
            "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80",
          gallery: [],
          chef: "",
        },
      ],
    },
  ],
  hours: [
    { day: "Mon", open: "17:00", close: "22:00", closed: false },
    { day: "Tue", open: "17:00", close: "22:00", closed: false },
    { day: "Wed", open: "17:00", close: "22:00", closed: false },
    { day: "Thu", open: "17:00", close: "23:00", closed: false },
    { day: "Fri", open: "17:00", close: "23:30", closed: false },
    { day: "Sat", open: "12:00", close: "23:30", closed: false },
    { day: "Sun", open: "12:00", close: "21:00", closed: false },
  ],
  contact: {
    phone: "(212) 555-0142",
    email: "ciao@pizzerialina.example",
    address: "212 East 7th Street, New York, NY 10009",
    mapsUrl: "https://maps.google.com/?q=212+East+7th+Street+New+York",
    instagram: "@pizzerialina",
  },
  theme: { preset: "modernBistro", mode: "dark", colors: {} },
  recentImageUrls: [],
};

export const STOCK_HERO_IMAGES = [
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1600&q=80",
];
