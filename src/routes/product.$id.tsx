import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import Plus from "lucide-react/dist/esm/icons/plus.js";
import Truck from "lucide-react/dist/esm/icons/truck.js";
import RefreshCw from "lucide-react/dist/esm/icons/refresh-cw.js";
import Check from "lucide-react/dist/esm/icons/check.js";
import ArrowRight from "lucide-react/dist/esm/icons/arrow-right.js";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Selectors } from "@/components/store/shell";
import { ProductSlider } from "@/components/store/product-card";
import { meta } from "@/lib/store/catalog";
import { fetchProduct, useCatalog } from "@/lib/store/products-db";
import { useStore } from "@/lib/store/context";
export const Route = createFileRoute("/product/$id")({
  // The loader runs before the page shows: it fetches this product from Supabase (404 if it doesn't exist).
  loader: async ({ params }) => {
    const product = await fetchProduct(params.id);
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) =>
    meta(
      loaderData?.name ?? "Piece not found",
      "Discover your next everyday favourite from OFFGRID. Thoughtful fit, heavyweight fabric and independent streetwear design.",
    ),
  component: ProductPage,
});
function ProductPage() {
  const { id } = Route.useParams();
  const p = Route.useLoaderData();
  const { products } = useCatalog();
  const [size, setSize] = useState("");
  const [color, setColor] = useState("Onyx");
  const [chart, setChart] = useState(false);
  const [notified, setNotified] = useState(false);
  const [view, setView] = useState(0);
  const { add, money } = useStore();
  if (!p) return null;
  const sold = p.soldOut.includes(size);
  return (
    <main>
      <div className="product-detail">
        <div className="gallery">
          <img src={view ? p.alternate : p.image} alt={p.name} width={512} height={768} />
          <div className="gallery-thumbs">
            {[p.image, p.alternate].map((src, i) => (
              <Button
                key={i}
                variant="outline"
                className={view === i ? "active" : ""}
                onClick={() => setView(i)}
                aria-label={`Product image ${i + 1}`}
              >
                <img src={src} alt="" />
              </Button>
            ))}
          </div>
        </div>
        <div className="product-detail-copy">
          <Link to="/collection/$slug" params={{ slug: "new-in" }} className="eyebrow">
            THE EVERYDAY EDIT / {p.category.toUpperCase()}
          </Link>
          {p.few && <p className="limited-note">ONLY FEW LEFT — MAKE IT YOURS.</p>}
          <h1>{p.name.toUpperCase()}</h1>
          <p className="detail-price">
            {money(p.price)} <small>Inclusive of all taxes</small>
          </p>
          <p className="detail-description">
            Your everyday uniform, reimagined. A considered silhouette, substantial fabric and the
            kind of comfort you keep coming back to. Designed to do your own thing.
          </p>
          <Selectors
            product={p}
            size={size}
            setSize={(s) => {
              setSize(s);
              setNotified(false);
            }}
            color={color}
            setColor={setColor}
          />
          <Button variant="link" className="px-0 mt-2" onClick={() => setChart(true)}>
            Size chart ↗
          </Button>
          {sold ? (
            <div className="notify-form">
              <h3>YOUR SIZE IS TAKING A BREAK.</h3>
              <p>Leave your details for a mock restock notification.</p>
              {notified ? (
                <div className="mock-success">
                  <Check /> You’re on the list for size {size}.
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setNotified(true);
                  }}
                >
                  <input className="field" required placeholder="Name" aria-label="Name" />
                  <input className="field" value={size} aria-label="Requested size" readOnly />
                  <input
                    className="field"
                    type="tel"
                    required
                    placeholder="Phone"
                    aria-label="Phone"
                  />
                  <input
                    className="field"
                    type="email"
                    required
                    placeholder="Email"
                    aria-label="Email"
                  />
                  <input className="field" placeholder="City (optional)" aria-label="City" />
                  <Button type="submit" className="w-full">
                    Notify Me
                  </Button>
                </form>
              )}
            </div>
          ) : (
            <Button
              className="w-full mt-6"
              size="lg"
              disabled={!size}
              onClick={() => add(p, size, color)}
            >
              {size ? "Add To Cart" : "Select a size"}
              <Plus />
            </Button>
          )}
          <div className="delivery-info">
            <p>
              <Truck size={19} /> Sample delivery: 3–7 working days.
            </p>
            <p>
              <RefreshCw size={19} /> Easy returns on unworn pieces.
            </p>
          </div>
          <details open>
            <summary>THE DETAILS</summary>
            <p>
              Premium cotton-rich fabric. Relaxed silhouette. Soft-touch finish. Model wears size M.
              Clothing only.
            </p>
          </details>
          <details>
            <summary>CARE & RETURNS</summary>
            <p>
              Cold wash inside out. Dry in the shade. See our Care and Returns pages for sample
              policies.
            </p>
          </details>
        </div>
      </div>
      <ProductSlider
        title="KEEP GOOD COMPANY"
        subtitle="Pieces that work better together."
        items={products.filter((item) => item.id !== id).slice(0, 6)}
      />
      <Dialog open={chart} onOpenChange={setChart}>
        <DialogContent>
          <DialogTitle className="drawer-title">FIND YOUR FIT</DialogTitle>
          <p>Sample unisex measurements in inches.</p>
          <table className="size-table">
            <thead>
              <tr>
                <th>Size</th>
                <th>Chest</th>
                <th>Length</th>
              </tr>
            </thead>
            <tbody>
              {["XS", "S", "M", "L", "XL", "XXL"].map((s, i) => (
                <tr key={s}>
                  <td>{s}</td>
                  <td>{38 + i * 2}</td>
                  <td>{25 + i}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link
            to="/pages/$page"
            params={{ page: "find-your-fit" }}
            onClick={() => setChart(false)}
            className="underlined"
          >
            TAKE THE FIT QUIZ <ArrowRight size={14} />
          </Link>
        </DialogContent>
      </Dialog>
    </main>
  );
}
