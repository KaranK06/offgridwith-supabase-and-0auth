import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import SlidersHorizontal from "lucide-react/dist/esm/icons/sliders-horizontal.js";
import X from "lucide-react/dist/esm/icons/x.js";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/store/product-card";
import { collectionProducts, meta, sizes } from "@/lib/store/catalog";
import { useCatalog } from "@/lib/store/products-db";
import campaign from "@/assets/campaign.jpg";
export const Route = createFileRoute("/collection/$slug")({
  head: ({ params }) =>
    meta(
      params.slug.replaceAll("-", " "),
      `Discover the OFFGRID ${params.slug.replaceAll("-", " ")} collection. Oversized essentials, thoughtful fabrics and independent design.`,
      campaign,
    ),
  component: Collection,
});
function Collection() {
  const { slug } = Route.useParams();
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [sort, setSort] = useState("featured");
  const [filters, setFilters] = useState(false);
  const { products } = useCatalog();
  const all = collectionProducts(slug, products);
  const title = slug.replaceAll("-", " ").toUpperCase();
  let filtered = all.filter(
    (p) =>
      (!size || !p.soldOut.includes(size)) &&
      (!color || p.colors.includes(color)) &&
      (!category || p.category === category) &&
      (!price || p.price <= Number(price)),
  );
  if (sort === "low") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === "high") filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sort === "name") filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  return (
    <main>
      <section className="collection-banner">
        <img src={campaign} alt="OFFGRID clothing collection" />
        <div>
          <span className="eyebrow">THE OFFGRID EDIT</span>
          <h1>{title}</h1>
          <p>
            {slug === "limited-edition"
              ? "Small runs. Big expression. Once they’re gone, they’re gone."
              : "Good pieces. No rules. Make them your own."}
          </p>
        </div>
      </section>
      <div className="collection-content">
        <div className="collection-toolbar">
          <Button variant="ghost" onClick={() => setFilters(!filters)}>
            <SlidersHorizontal /> FILTERS
          </Button>
          <span>{filtered.length} PIECES</span>
          <select aria-label="Sort products" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="featured">Featured</option>
            <option value="low">Price: Low to high</option>
            <option value="high">Price: High to low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
        {filters && (
          <div className="filter-row">
            <select
              aria-label="Filter by size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            >
              <option value="">All sizes</option>
              {sizes.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <select
              aria-label="Filter by colour"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            >
              <option value="">All colours</option>
              {["Onyx", "Chalk", "Olive"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select
              aria-label="Filter by category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All categories</option>
              {[...new Set(all.map((p) => p.category))].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select
              aria-label="Filter by price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            >
              <option value="">All prices</option>
              <option value="1500">Under 1,500</option>
              <option value="3000">Under 3,000</option>
              <option value="5000">Under 5,000</option>
            </select>
            <Button
              variant="ghost"
              onClick={() => {
                setSize("");
                setColor("");
                setCategory("");
                setPrice("");
              }}
            >
              <X /> Clear filters
            </Button>
          </div>
        )}
        <div className="collection-grid">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        {!filtered.length && (
          <div className="py-20 text-center">
            <h2>NO PIECES HERE. YET.</h2>
            <p>Try another filter combination.</p>
          </div>
        )}
      </div>
    </main>
  );
}
