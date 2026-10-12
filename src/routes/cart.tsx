import { createFileRoute } from "@tanstack/react-router";
import { CartContents } from "@/components/store/shell";
import { meta } from "@/lib/store/catalog";
export const Route = createFileRoute("/cart")({
  head: () =>
    meta(
      "Your bag",
      "Your OFFGRID pieces. Review your sizes, colours and quantities in your shopping bag.",
    ),
  component: CartPage,
});
function CartPage() {
  return (
    <main className="utility-page">
      <span className="eyebrow">GOOD CHOICES, RIGHT HERE.</span>
      <h1>YOUR BAG.</h1>
      <CartContents page />
    </main>
  );
}
