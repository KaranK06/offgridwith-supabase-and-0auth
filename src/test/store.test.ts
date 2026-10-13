import { describe, expect, it } from "vitest";
import {
  products,
  sizes,
  denominations,
  countries,
  collectionProducts,
  canAddSize,
} from "@/lib/store/catalog";
import { mergeCart, cartTotal } from "@/lib/store/context";
describe("Showcase shopping rules", () => {
  it("offers 15 clothing products with no footwear", () => {
    expect(products).toHaveLength(15);
    const clothing = [
      "T-Shirts",
      "Hoodies",
      "Jackets",
      "Cargo Pants",
      "Drop Tees",
      "Crop Tops",
      "Dresses",
      "Oversized Hoodies",
      "Co-ord Sets",
      "Collab Hoodies",
      "Statement Jackets",
      "Collector Sets",
    ];
    expect(products.every((p) => clothing.includes(p.category))).toBe(true);
  });
  it("offers the exact six requested sizes", () => {
    expect(sizes).toEqual(["XS", "S", "M", "L", "XL", "XXL"]);
  });
  it("offers gift amounts 1000, 2000 and 5000", () => {
    expect(denominations).toEqual([1000, 2000, 5000]);
  });
  it("offers the six countries with India default currency", () => {
    expect(countries.map((c) => c.name)).toEqual([
      "India",
      "USA",
      "UK",
      "UAE",
      "Canada",
      "Australia",
    ]);
    expect(countries[0]?.symbol).toBe("₹");
    expect(countries[1]?.symbol).toBe("$");
  });
  it("blocks sold-out sizes and permits an available size", () => {
    const p = products[0];
    if (!p) throw Error("Missing seed");
    expect(canAddSize(p, "XS")).toBe(false);
    expect(canAddSize(p, "M")).toBe(true);
    expect(canAddSize(p, "3XL")).toBe(false);
  });
  it("merges same piece size and colour and computes subtotal", () => {
    const p = products[0];
    if (!p) throw Error("Missing seed");
    const cart = mergeCart(mergeCart([], p, "M", "Onyx"), p, "M", "Onyx");
    expect(cart).toHaveLength(1);
    expect(cart[0]?.qty).toBe(2);
    expect(cartTotal(cart)).toBe(2998);
  });
  it("keeps separate sizes and recipients apart", () => {
    const p = products[0];
    if (!p) throw Error("Missing seed");
    const cart = mergeCart(
      mergeCart([], p, "M", "Onyx", "a@example.com"),
      p,
      "L",
      "Onyx",
      "b@example.com",
    );
    expect(cart).toHaveLength(2);
  });
  it("preserves distinct personalised gift messages", () => {
    const p = products[0];
    if (!p) throw Error("Missing seed");
    const cart = mergeCart(
      mergeCart([], p, "Digital", "Digital", "a@example.com", "Happy birthday"),
      p,
      "Digital",
      "Digital",
      "a@example.com",
      "Thank you",
    );
    expect(cart).toHaveLength(2);
    expect(cart[1]?.message).toBe("Thank you");
  });
  it("matches collection audiences and exclusive drops", () => {
    expect(collectionProducts("shop-all")).toHaveLength(15);
    expect(collectionProducts("women").every((p) => p.audience === "Women")).toBe(true);
    expect(collectionProducts("limited-edition").map((p) => p.id)).toEqual([
      "piece-5",
      "piece-12",
      "piece-13",
      "piece-14",
    ]);
  });
});
