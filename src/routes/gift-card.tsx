import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import ArrowUpRight from "lucide-react/dist/esm/icons/arrow-up-right.js";
import Plus from "lucide-react/dist/esm/icons/plus.js";
import { Button } from "@/components/ui/button";
import { denominations, meta } from "@/lib/store/catalog";
import { useStore } from "@/lib/store/context";
import image from "@/assets/product-2.jpg";
export const Route = createFileRoute("/gift-card")({
  head: () =>
    meta(
      "Gift a card",
      "Give them their own kind of OFFGRID. Choose a gift card denomination and personalise your message.",
    ),
  component: GiftCard,
});
function GiftCard() {
  const [value, setValue] = useState(1000);
  const [custom, setCustom] = useState(false);
  const { money, add } = useStore();
  return (
    <main className="gift-page">
      <div className="gift-visual">
        <span className="brand-logo">OFFGRID®</span>
        <span className="gift-large">
          FOR THE
          <br />
          UNORDINARY.
        </span>
        <div>
          <span>THE GIFT CARD</span>
          <ArrowUpRight size={35} />
        </div>
      </div>
      <div>
        <span className="eyebrow">THE GIFT OF GOOD TASTE.</span>
        <h1>
          LET THEM
          <br />
          DO THEM.
        </h1>
        <p>
          Some things are better left to their own style.
          <br />
          An OFFGRID gift card always gets the fit right.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            add(
              {
                id: `gift-${value}`,
                name: "OFFGRID Gift Card",
                price: value,
                category: "Gift Card",
                audience: "All",
                image,
                alternate: image,
                colors: ["Digital"],
                soldOut: [],
                limited: false,
                few: false,
              },
              "Digital",
              "Digital",
              String(data.get("recipient")),
              String(data.get("message")),
            );
          }}
        >
          <label className="selector-label">CHOOSE AN AMOUNT</label>
          <div className="flex flex-wrap gap-2">
            {denominations.map((d) => (
              <Button
                key={d}
                type="button"
                variant={!custom && value === d ? "default" : "outline"}
                onClick={() => {
                  setValue(d);
                  setCustom(false);
                }}
              >
                {money(d)}
              </Button>
            ))}
            <Button
              type="button"
              variant={custom ? "default" : "outline"}
              onClick={() => {
                setCustom(true);
                setValue(1000);
              }}
            >
              Custom
            </Button>
          </div>
          {custom && (
            <input
              className="field mt-3"
              type="number"
              min={1}
              required
              aria-label="Custom gift amount"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
            />
          )}
          <label className="selector-label" htmlFor="recipient">
            RECIPIENT EMAIL
          </label>
          <input
            id="recipient"
            className="field"
            name="recipient"
            required
            type="email"
            placeholder="Their inbox, your good taste."
          />
          <label className="selector-label" htmlFor="message">
            YOUR MESSAGE
          </label>
          <textarea
            id="message"
            className="field"
            rows={3}
            name="message"
            placeholder="Make it personal."
          />
          <Button className="w-full mt-5" size="lg" type="submit" disabled={value <= 0}>
            Add To Cart — {money(value)}
            <Plus />
          </Button>
          <small className="block mt-3 text-muted-foreground">
            Digital gift card showcase. No email will be sent.
          </small>
        </form>
      </div>
    </main>
  );
}
