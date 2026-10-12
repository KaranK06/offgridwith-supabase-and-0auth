import { describe, expect, it } from "vitest";
import { menuCollageProducts, productPhoto, products } from "@/lib/store/catalog";

describe("Audience-specific garment photos", () => {
  it("keeps men's primary and alternate images within the men's garment set", () => {
    for (const product of products.filter((p) => p.audience === "Men")) {
      expect(product.image).toMatch(/men-(tshirt|hoodie|jacket|cargo)\.jpg/);
      expect(product.alternate).toBe(product.image);
    }
  });
  it("never uses a men's photo for women, including alternate styling", () => {
    for (const product of products.filter((p) => p.audience === "Women")) {
      expect(product.image).not.toMatch(/men-(tshirt|hoodie|jacket|cargo)\.jpg/);
      expect(product.image).not.toContain("product-3.jpg");
      expect(product.alternate).toBe(product.image);
    }
  });
  it("uses four distinct, category-correct collage images per audience", () => {
    for (const audience of ["Men", "Women"]) {
      const collage = menuCollageProducts(audience);
      expect(collage).toHaveLength(4);
      expect(new Set(collage.map((p) => p.image)).size).toBe(4);
      expect(collage.every((p) => p.audience === audience)).toBe(true);
    }
    expect(menuCollageProducts("Men").map((p) => p.category)).toEqual([
      "T-Shirts", "Hoodies", "Jackets", "Cargo Pants",
    ]);
    expect(menuCollageProducts("Women").map((p) => p.category)).toEqual([
      "Crop Tops", "Dresses", "Oversized Hoodies", "Co-ord Sets",
    ]);
  });
  it("refreshes only the displayed photo of an existing saved bag item", () => {
    const product = products[0];
    if (!product) throw new Error("Missing product");
    expect(productPhoto({ ...product, image: "outdated-photo.jpg" })).toBe(product.image);
    const gift = { ...product, id: "gift-1000", image: "gift-photo.jpg" };
    expect(productPhoto(gift)).toBe(gift.image);
  });
});