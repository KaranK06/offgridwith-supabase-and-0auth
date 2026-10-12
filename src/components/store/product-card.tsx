import { Link } from "@tanstack/react-router";
import Plus from "lucide-react/dist/esm/icons/plus.js";
import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left.js";
import ArrowRight from "lucide-react/dist/esm/icons/arrow-right.js";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { type Product } from "@/lib/store/catalog";
import { useCatalog } from "@/lib/store/products-db";
import { useStore } from "@/lib/store/context";
export function ProductCard({ product: p }: { product: Product }) {
  const { money, setQuick } = useStore();
  return (
    <article className="product-card min-w-0">
      <div className="product-image">
        <Link to="/product/$id" params={{ id: p.id }}>
          <img src={p.image} alt={p.name} loading="lazy" width={512} height={768} />
          <img
            className="alternate"
            src={p.alternate}
            alt={`${p.name} alternate styling`}
            loading="lazy"
            width={512}
            height={768}
          />
        </Link>
        {p.tag && <span className="product-tag">{p.tag}</span>}
        {p.few && <span className="few-tag">ONLY FEW LEFT</span>}
        <Button variant="outline" className="quick-add" onClick={() => setQuick(p)}>
          Quick Add <Plus size={15} />
        </Button>
      </div>
      <div className="product-info">
        <span className="eyebrow text-muted-foreground">
          {p.limited ? "LIMITED EDITION" : "THE EVERYDAY EDIT"}
        </span>
        <Link to="/product/$id" params={{ id: p.id }} className="product-name">
          {p.name}
        </Link>
        <span className="price">
          {money(p.price)} <small>incl. of taxes</small>
        </span>
        <div className="color-dots">
          <i className="swatch-onyx" />
          <i className="swatch-chalk" />
          <i className="swatch-olive" />
        </div>
      </div>
    </article>
  );
}
export function ProductSlider({
  title = "THE CURRENT ROTATION",
  subtitle = "Good pieces. On repeat.",
  items,
}: {
  title?: string;
  subtitle?: string;
  items?: Product[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { products } = useCatalog();
  const list = items ?? products.slice(0, 6);
  return (
    <section className="product-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">YOUR NEXT EVERYDAY FAVOURITES</span>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <div className="slider-actions">
          <Link to="/collection/$slug" params={{ slug: "new-in" }} className="underlined">
            VIEW ALL <ArrowRight size={14} />
          </Link>
          <Button
            variant="outline"
            size="icon"
            aria-label="Previous products"
            onClick={() => ref.current?.scrollBy({ left: -340, behavior: "smooth" })}
          >
            <ArrowLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Next products"
            onClick={() => ref.current?.scrollBy({ left: 340, behavior: "smooth" })}
          >
            <ArrowRight />
          </Button>
        </div>
      </div>
      <div className="product-slider" ref={ref}>
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
