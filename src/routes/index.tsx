import { createFileRoute, Link } from "@tanstack/react-router";
import ArrowRight from "lucide-react/dist/esm/icons/arrow-right.js";
import ArrowUpRight from "lucide-react/dist/esm/icons/arrow-up-right.js";
import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left.js";
import Star from "lucide-react/dist/esm/icons/star.js";
import Check from "lucide-react/dist/esm/icons/check.js";
import Plus from "lucide-react/dist/esm/icons/plus.js";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ProductSlider } from "@/components/store/product-card";
import { meta } from "@/lib/store/catalog";
import campaign from "@/assets/campaign.jpg";
import promo from "@/assets/promo.jpg";
import tee from "@/assets/product-1.jpg";
import hoodie from "@/assets/product-3.jpg";
import jacket from "@/assets/product-4.jpg";
import ivory from "@/assets/product-2.jpg";
import p1 from "@/assets/person-1.jpg";
import p2 from "@/assets/person-2.jpg";
import p3 from "@/assets/person-3.jpg";
import p4 from "@/assets/person-4.jpg";
import p5 from "@/assets/person-5.jpg";
import p6 from "@/assets/person-6.jpg";
export const Route = createFileRoute("/")({
  head: () =>
    meta(
      "Not for the ordinary",
      "OFFGRID streetwear. Oversized essentials, expressive layers and limited drops. Made to live in. Designed to stand apart.",
      campaign,
    ),
  component: Home,
});
const reviews = [
  {
    image: p1,
    name: "Ananya",
    title: "My wardrobe has a new favourite.",
    review:
      "The weight of this tee is unreal. It holds its shape, the fit is just right, and I have genuinely worn it three times this week.",
  },
  {
    image: p2,
    name: "Arjun",
    title: "Finally, oversized done right.",
    review:
      "Relaxed without looking sloppy. The hoodie feels so good that my girlfriend keeps stealing it. Guess I am ordering another.",
  },
  {
    image: p3,
    name: "Riya",
    title: "Worth every single rupee.",
    review:
      "The little details make all the difference. Beautiful fabric and a cut that works with everything I own.",
  },
  {
    image: p4,
    name: "Kabir",
    title: "Straight into the daily rotation.",
    review:
      "These pieces just get it. Good fabric, no fuss, and that perfect lived-in feeling from day one.",
  },
  {
    image: p5,
    name: "Meera",
    title: "Feels like it was made for me.",
    review:
      "I was unsure about sizing, but the fit quiz got it spot on. The co-ord is my new weekend uniform.",
  },
  {
    image: p6,
    name: "Dev",
    title: "A little different. A lot better.",
    review:
      "Picked up a limited drop and the compliments have not stopped. The quality easily beats anything else at this price.",
  },
];
const press = [
  ["VOGUE", "“A fresh perspective on everyday dressing, with fabric that speaks for itself.”"],
  ["GQ", "“Considered fits and substantial fabrics. An independent label worth watching.”"],
  ["ELLE", "“The perfect balance of relaxed silhouettes and unmistakable attitude.”"],
  ["Cosmopolitan", "“Your everyday wardrobe, with a whole new point of view.”"],
  ["Rolling Stone", "“Streetwear with substance. Built for the ones who set their own rhythm.”"],
];
function Home() {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <main>
      <section className="campaign">
        <img
          className="campaign-image"
          src={campaign}
          alt="OFFGRID Edition 001, three models in oversized streetwear"
          width={1536}
          height={1024}
          fetchPriority="high"
        />
        <div className="campaign-content">
          <span className="eyebrow campaign-eyebrow">
            <i /> DROP 001 / THE NEW WAVE
          </span>
          <h1>
            OFFGRID.
            <br />
            <span>ON YOUR</span>
            <br />
            OWN TERMS.
          </h1>
          <p>
            Built for the everyday.
            <br />
            Made for anything but ordinary.
          </p>
          <Button asChild size="lg" className="campaign-cta">
            <Link to="/collection/$slug" params={{ slug: "limited-edition" }}>
              EXPLORE THE DROP <ArrowUpRight size={19} />
            </Link>
          </Button>
        </div>
        <span className="campaign-caption">INDEPENDENT EXPRESSION. NO PERMISSION NEEDED.</span>
        <div className="campaign-bottom">
          <span>
            01 <span className="text-overlay/50">/ 03</span>
            <i />
          </span>
          <Link to="/collection/$slug" params={{ slug: "limited-edition" }}>
            LIMITED EDITION <ArrowRight size={15} />
          </Link>
        </div>
        <div className="vertical-caption">OFFGRID STUDIO — EST. 2026</div>
      </section>
      <div className="manifesto-strip">
        <span>LESS ORDINARY. MORE YOU.</span>
        <Plus />
        <span>HEAVYWEIGHT FABRICS</span>
        <Plus />
        <span>UNCOMPROMISING FITS</span>
        <Plus />
        <span>INDEPENDENT BY DESIGN</span>
        <Plus />
      </div>
      <ProductSlider />
      <section className="promo-banner">
        <img
          src={promo}
          alt="OFFGRID models in crop tee and oversized hoodie against a blue wall"
          width={1536}
          height={1024}
          loading="lazy"
        />
        <div>
          <span className="eyebrow">NOT JUST CLOTHES. A POINT OF VIEW.</span>
          <h2>
            DESIGNED TO
            <br />
            STAND APART.
          </h2>
          <p>Different by instinct. OFFGRID by choice.</p>
          <div className="flex gap-3 mt-6">
            <Button asChild>
              <Link to="/collection/$slug" params={{ slug: "men" }}>
                SHOP MEN <ArrowUpRight />
              </Link>
            </Button>
            <Button variant="outline" className="overlay-button" asChild>
              <Link to="/collection/$slug" params={{ slug: "women" }}>
                SHOP WOMEN <ArrowUpRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="category-grid">
        {[
          { name: "HOODIES", slug: "hoodies", image: hoodie },
          { name: "T-SHIRTS", slug: "t-shirts", image: tee },
          { name: "JACKETS", slug: "jackets", image: jacket },
          { name: "SHOP ALL", slug: "shop-all", image: ivory },
        ].map((t, i) => (
          <Link
            key={t.name}
            className={`category-tile category-${i}`}
            to="/collection/$slug"
            params={{ slug: t.slug }}
          >
            <img src={t.image} alt={t.name} width={512} height={768} loading="lazy" />
            <h2>{t.name}</h2>
            <span className="category-number">0{i + 1} / THE OFFGRID EDIT</span>
            <span className="category-shop">
              SHOP NOW <ArrowUpRight size={19} />
            </span>
          </Link>
        ))}
      </section>
      <section className="reviews-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">REAL PEOPLE. REAL ROTATION.</span>
            <h2>WHAT ARE THEY SAYING?</h2>
            <p>The community has good taste. Just saying.</p>
          </div>
          <div className="slider-actions">
            <Button
              variant="outline"
              size="icon"
              aria-label="Previous reviews"
              onClick={() => ref.current?.scrollBy({ left: -360, behavior: "smooth" })}
            >
              <ArrowLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Next reviews"
              onClick={() => ref.current?.scrollBy({ left: 360, behavior: "smooth" })}
            >
              <ArrowRight />
            </Button>
          </div>
        </div>
        <div className="review-slider" ref={ref}>
          {reviews.map((r) => (
            <article className="review-card" key={r.name}>
              <img
                src={r.image}
                alt={`${r.name} wearing OFFGRID`}
                loading="lazy"
                width={512}
                height={512}
              />
              <div className="review-copy">
                <div className="stars">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star size={14} fill="currentColor" key={i} />
                  ))}
                </div>
                <h3>{r.title}</h3>
                <p>{r.review}</p>
                <div className="review-person">
                  <strong>{r.name}</strong>
                  <span>
                    <Check size={13} /> Verified Buyer
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="press-section">
        <span className="eyebrow">WORD ON THE STREET</span>
        <h2>AS APPRECIATED ON</h2>
        <div className="press-row">
          {press.map(([name, quote]) => (
            <div className="press-item" key={name} tabIndex={0}>
              <p>{quote}</p>
              <span className={name === "GQ" ? "press-sans" : "press-serif"}>{name}</span>
            </div>
          ))}
        </div>
        <small>Editorial quotes are fictional showcase content.</small>
      </section>
      <section className="referral-banner">
        <span className="eyebrow">GOOD STYLE IS BETTER SHARED.</span>
        <h2>
          YOUR PEOPLE.
          <br />
          OUR KIND OF PEOPLE.
        </h2>
        <Link to="/pages/$page" params={{ page: "referral" }} className="referral-link">
          REFER A FRIEND <ArrowUpRight size={23} />
        </Link>
        <span className="referral-decor">↗</span>
      </section>
      <section className="gift-section">
        <div>
          <span className="eyebrow">CAN’T PICK? DON’T.</span>
          <h2>
            GOOD TASTE.
            <br />
            GREAT GIFT.
          </h2>
          <p>Let them find their own kind of OFFGRID.</p>
          <Button asChild className="mt-6">
            <Link to="/gift-card">
              GIFT A CARD <ArrowUpRight />
            </Link>
          </Button>
        </div>
        <Link to="/gift-card" className="gift-visual">
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
        </Link>
      </section>
    </main>
  );
}
