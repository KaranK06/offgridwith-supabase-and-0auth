import ivory from "@/assets/product-2.jpg";
import jacket from "@/assets/product-4.jpg";
import menTshirt from "@/assets/men-tshirt.jpg";
import menHoodie from "@/assets/men-hoodie.jpg";
import menJacket from "@/assets/men-jacket.jpg";
import menCargo from "@/assets/men-cargo.jpg";
import womenCroptop from "@/assets/women-croptop.jpg";
import womenDress from "@/assets/women-dress.jpg";
import womenHoodie from "@/assets/women-oversized-hoodie.jpg";
import womenCoord from "@/assets/women-coord.jpg";
// The database stores a short "image_key" (text) per product; this map turns it into the real bundled image file.
export const imageByKey: Record<string, string> = {
  ivory,
  jacket,
  "men-tshirt": menTshirt,
  "men-hoodie": menHoodie,
  "men-jacket": menJacket,
  "men-cargo": menCargo,
  "women-croptop": womenCroptop,
  "women-dress": womenDress,
  "women-oversized-hoodie": womenHoodie,
  "women-coord": womenCoord,
};
export const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
export const denominations = [1000, 2000, 5000];
export const countries = [
  { name: "India", symbol: "₹" },
  { name: "USA", symbol: "$" },
  { name: "UK", symbol: "£" },
  { name: "UAE", symbol: "AED " },
  { name: "Canada", symbol: "C$" },
  { name: "Australia", symbol: "A$" },
];
export type Product = {
  id: string;
  name: string;
  category: string;
  audience: string;
  price: number;
  image: string;
  alternate: string;
  colors: string[];
  soldOut: string[];
  limited: boolean;
  few: boolean;
  tag?: string | undefined;
};
const rows: [string, string, string, number, string][] = [
  ["After Hours Oversized Tee", "T-Shirts", "Men", 1499, menTshirt],
  ["Essential Boxy Tee", "T-Shirts", "Women", 1299, ivory],
  ["Off Duty Zip Hoodie", "Hoodies", "Men", 2799, menHoodie],
  ["Utility Bomber Jacket", "Jackets", "Women", 3499, jacket],
  ["Concrete Oversized Tee", "Drop Tees", "Men", 1799, menTshirt],
  ["Everyday Heavyweight Tee", "T-Shirts", "Women", 1599, ivory],
  ["Midnight Cargo Pants", "Cargo Pants", "Men", 2499, menCargo],
  ["Studio Crop Top", "Crop Tops", "Women", 999, womenCroptop],
  ["Downtown T-shirt Dress", "Dresses", "Women", 1999, womenDress],
  ["Cloud Oversized Hoodie", "Oversized Hoodies", "Women", 2999, womenHoodie],
  ["Offgrid Co-ord Set", "Co-ord Sets", "Women", 3999, womenCoord],
  ["Archive Collab Hoodie", "Collab Hoodies", "Men", 3299, menHoodie],
  ["Field Statement Jacket", "Statement Jackets", "Men", 4499, menJacket],
  ["Edition 001 Collector Set", "Collector Sets", "Women", 4999, womenCoord],
  ["Washed Workwear Jacket", "Jackets", "Men", 3199, menJacket],
  ["Weekend Pullover Hoodie", "Hoodies", "Men", 2599, menHoodie],
];
// Built-in sample catalog. It is the instant first render and the fallback if the database cannot be reached.
// The live catalog comes from the Supabase "products" table (see products-db.ts).
export const products: Product[] = rows.map((r, i) => ({
  id: `piece-${i + 1}`,
  name: r[0],
  category: r[1],
  audience: r[2],
  price: r[3],
  image: r[4],
  alternate: r[4],
  colors: ["Onyx", "Chalk", "Olive"],
  soldOut: i % 3 === 0 ? ["XS", "XXL"] : [],
  limited: [4, 11, 12, 13].includes(i),
  few: [4, 11, 13].includes(i),
  tag: i === 0 ? "Exclusive Price" : i === 4 ? "Pre-Order Now" : undefined,
})).filter((p) => p.id !== "piece-4");
// Curated image order only; product order and category destinations stay unchanged.
export function menuCollageProducts(audience: string, list: Product[] = products) {
  const categories = audience === "Men"
    ? ["T-Shirts", "Hoodies", "Jackets", "Cargo Pants"]
    : ["Crop Tops", "Dresses", "Oversized Hoodies", "Co-ord Sets"];
  return categories.flatMap((category) => {
    const product = list.find((p) => p.audience === audience && p.category === category);
    return product ? [product] : [];
  });
}
// Existing saved bags retain all item data and display the latest catalog photo.
export function productPhoto(product: Product, list: Product[] = products) {
  return list.find((p) => p.id === product.id)?.image ?? product.image;
}
export function collectionProducts(slug: string, list: Product[] = products) {
  const label = slug.replaceAll("-", " ").toLowerCase();
  return list.filter(
    (p) =>
      label === "shop all" ||
      label === "new in" ||
      label === "bestsellers" ||
      (label === "limited edition" && p.limited) ||
      (label === "only few left" && p.few) ||
      p.audience.toLowerCase() === label ||
      p.category.toLowerCase() === label,
  );
}
export const slugify = (s: string) => s.toLowerCase().replaceAll(" ", "-");
export const pageTitles: Record<string, string> = {
  "about-us": "About Us",
  "design-lab": "Design Lab",
  faq: "FAQ",
  care: "Care",
  "returns-and-exchanges": "Returns and Exchanges",
  referral: "Refer a Friend",
  "store-locator": "Store Locator",
  "order-tracking": "Track Your Order",
  contact: "Contact Us",
  "find-your-fit": "Find Your Fit",
  terms: "Terms",
  privacy: "Privacy",
  "shipping-policy": "Shipping Policy",
  "return-and-refund-policy": "Return and Refund Policy",
  careers: "Careers",
};
export const pageLinks = Object.entries(pageTitles);
export const meta = (title: string, description: string, image?: string) => ({
  meta: [
    { title: `${title} — OFFGRID` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} — OFFGRID` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    ...(image?.startsWith("https://") ? [{ property: "og:image", content: image }, { name: "twitter:image", content: image }] : []),
  ],
});

export function canAddSize(product: Product, size: string) {
  return (
    (product.category === "Gift Card" && size === "Digital") ||
    (sizes.includes(size) && !product.soldOut.includes(size))
  );
}
