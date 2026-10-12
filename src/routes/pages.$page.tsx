import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import ArrowRight from "lucide-react/dist/esm/icons/arrow-right.js";
import Check from "lucide-react/dist/esm/icons/check.js";
import MapPin from "lucide-react/dist/esm/icons/map-pin.js";
import Plus from "lucide-react/dist/esm/icons/plus.js";
import { Button } from "@/components/ui/button";
import { pageTitles, meta } from "@/lib/store/catalog";
import { EditProfile, OrderHistory } from "@/components/store/account-pages";
import campaign from "@/assets/campaign.jpg";
const accountTitles: Record<string, string> = { "edit-profile": "Edit Profile", "order-history": "Order History" };
export const Route = createFileRoute("/pages/$page")({
  loader: ({ params }) => {
    if (!pageTitles[params.page] && !accountTitles[params.page]) throw notFound();
  },
  head: ({ params }) =>
    meta(
      accountTitles[params.page] ?? pageTitles[params.page] ?? "Not found",
      `Explore ${accountTitles[params.page] ?? pageTitles[params.page] ?? "the community"} at OFFGRID. Independent streetwear and thoughtful everyday clothing.`,
      ["about-us", "design-lab"].includes(params.page) ? campaign : undefined,
    ),
  component: InfoPage,
});
const faqs = [
  [
    "How do I choose my size?",
    "Our pieces have a relaxed, oversized silhouette. Check the size chart on each product or take Find Your Fit for a sample recommendation.",
  ],
  [
    "How long does delivery take?",
    "Our sample delivery window is 3–7 working days. This showcase does not ship real orders.",
  ],
  [
    "Can I return or exchange a piece?",
    "The demo return portal lets you enter an order number and preview an exchange request. No actual order is required.",
  ],
  [
    "How do limited drops work?",
    "Small collections, distinctive pieces. Look for the Only Few Left indicator on selected styles.",
  ],
  [
    "How should I wash my clothes?",
    "Wash cold and inside out with similar colours. Avoid bleach and tumble drying; dry in the shade.",
  ],
  [
    "Is this a real store?",
    "This is a showcase. All products, contacts, customer reviews and press quotes are placeholders. No payments, emails or orders are processed.",
  ],
];
function InfoPage() {
  const { page } = Route.useParams();
  const [done, setDone] = useState(false);
  const [order, setOrder] = useState("");
  const [fitStep, setFitStep] = useState(0);
  const [height, setHeight] = useState("170");
  const [build, setBuild] = useState("Regular");
  const [fit, setFit] = useState("Relaxed");
  const [email, setEmail] = useState("");
  const title = accountTitles[page] ?? pageTitles[page] ?? "Page";
  return (
    <main>
      {["about-us", "design-lab"].includes(page) && (
        <section className="story-banner">
          <img src={campaign} alt="OFFGRID design community" />
          <div>
            <span className="eyebrow">INDEPENDENT BY DESIGN.</span>
            <h1>{page === "about-us" ? "WE DON’T DO ORDINARY." : "IDEAS INTO EVERYDAY."}</h1>
          </div>
        </section>
      )}
      <div className="utility-page">
        <span className="eyebrow">THE OFFGRID COMMUNITY</span>
        <h1>{title.toUpperCase()}.</h1>
        {page === "edit-profile" ? <EditProfile /> : page === "order-history" ? <OrderHistory /> : page === "faq" ? (
          <div className="faq-list">
            {faqs.map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <Plus size={17} />
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        ) : page === "order-tracking" || page === "returns-and-exchanges" ? (
          <>
            <p>
              {page === "order-tracking"
                ? "Your next favourite is on its way. Enter an order number to preview its journey."
                : "Not quite your fit? Let’s make it right. Enter an order number to open a sample return request."}
            </p>
            <form
              className="utility-form"
              onSubmit={(e) => {
                e.preventDefault();
                setDone(true);
              }}
            >
              <label htmlFor="order">ORDER NUMBER</label>
              <input
                id="order"
                className="field"
                placeholder="e.g. OG1001"
                value={order}
                required
                onChange={(e) => setOrder(e.target.value)}
              />
              <Button type="submit">
                {page === "order-tracking" ? "Track Order" : "Find My Order"}
                <ArrowRight />
              </Button>
            </form>
            {done &&
              (page === "order-tracking" ? (
                <div className="timeline">
                  <h3>ORDER {order} — DEMO STATUS</h3>
                  {["Order confirmed", "Packed with care", "On the move", "Out for delivery"].map(
                    (s, i) => (
                      <div key={s}>
                        <span>{i < 3 ? <Check size={15} /> : 4}</span>
                        <p>
                          <strong>{s}</strong>
                          <small>
                            {i === 2
                              ? "Your package is in transit."
                              : i === 3
                                ? "Coming soon."
                                : "Completed"}
                          </small>
                        </p>
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <form
                  className="utility-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setDone(false);
                    setOrder("");
                    alert("Demo return request submitted. No real order was changed.");
                  }}
                >
                  <p>Sample order found: After Hours Oversized Tee / M</p>
                  <select className="field" aria-label="Return or exchange">
                    <option>Exchange size</option>
                    <option>Return item</option>
                  </select>
                  <textarea
                    className="field"
                    required
                    placeholder="Tell us what didn’t work"
                    aria-label="Return reason"
                  />
                  <Button type="submit">Submit Demo Request</Button>
                </form>
              ))}
          </>
        ) : page === "find-your-fit" ? (
          <div className="fit-quiz">
            <p>A few details. A better fit. Find your sample OFFGRID size.</p>
            {fitStep === 0 ? (
              <form
                className="utility-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  setFitStep(1);
                }}
              >
                <label htmlFor="height">YOUR HEIGHT (CM)</label>
                <input
                  id="height"
                  className="field"
                  type="number"
                  min={120}
                  max={220}
                  required
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
                <label htmlFor="build">YOUR BUILD</label>
                <select
                  id="build"
                  className="field"
                  value={build}
                  onChange={(e) => setBuild(e.target.value)}
                >
                  <option>Slim</option>
                  <option>Regular</option>
                  <option>Broad</option>
                </select>
                <label htmlFor="fit">PREFERRED FIT</label>
                <select
                  id="fit"
                  className="field"
                  value={fit}
                  onChange={(e) => setFit(e.target.value)}
                >
                  <option>Relaxed</option>
                  <option>True to size</option>
                  <option>Extra oversized</option>
                </select>
                <Button type="submit">
                  Find My Fit <ArrowRight />
                </Button>
              </form>
            ) : (
              <div className="fit-result">
                <span className="eyebrow">YOUR SAMPLE MATCH</span>
                <h2>
                  {Number(height) < 160
                    ? "S"
                    : Number(height) > 185 || build === "Broad" || fit === "Extra oversized"
                      ? "XL"
                      : Number(height) > 175
                        ? "L"
                        : "M"}
                </h2>
                <p>
                  A {fit.toLowerCase()} silhouette for your everyday rotation. Check the product
                  size chart before choosing.
                </p>
                <Button asChild>
                  <Link to="/collection/$slug" params={{ slug: "shop-all" }}>
                    Find Your Piece <ArrowRight />
                  </Link>
                </Button>
                <Button variant="link" onClick={() => setFitStep(0)}>
                  Start again
                </Button>
              </div>
            )}
          </div>
        ) : page === "store-locator" ? (
          <>
            <p>Come for the clothes. Stay for the community.</p>
            <div className="stores-list">
              {[
                ["BENGALURU", "Studio 01, Indiranagar, Bengaluru 560038"],
                ["MUMBAI", "Studio 02, Bandra West, Mumbai 400050"],
                ["DELHI", "Studio 03, Hauz Khas, New Delhi 110016"],
              ].map(([name, address]) => (
                <article key={name}>
                  <MapPin size={27} />
                  <div>
                    <h3>{name}</h3>
                    <p>{address}</p>
                    <small>Sample store · Mon–Sun, 11 am–8 pm</small>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/${encodeURIComponent(address ?? name ?? "India")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="underlined"
                  >
                    DIRECTIONS ↗
                  </a>
                </article>
              ))}
            </div>
          </>
        ) : page === "referral" ? (
          <>
            <h2>GOOD PEOPLE KNOW GOOD PEOPLE.</h2>
            <p>Bring your crew into the OFFGRID community. Share a little good taste.</p>
            <form
              className="utility-form"
              onSubmit={(e) => {
                e.preventDefault();
                setDone(true);
              }}
            >
              <label htmlFor="email">YOUR EMAIL</label>
              <input
                id="email"
                className="field"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
              <Button type="submit">
                Get My Referral Link <ArrowRight />
              </Button>
            </form>
            {done && (
              <div className="mock-success">
                <Check />
                <div>
                  Your demo referral code: <strong>OFFGRID-CREW</strong>
                  <p>Share this code with a friend. No rewards are issued in the showcase.</p>
                </div>
              </div>
            )}
          </>
        ) : page === "contact" || page === "careers" ? (
          <>
            <p>
              {page === "contact"
                ? "Questions, collaborations or just a hello. We’re all ears."
                : "Independent thinkers. Good energy. Join the OFFGRID conversation."}
            </p>
            <form
              className="utility-form"
              onSubmit={(e) => {
                e.preventDefault();
                setDone(true);
              }}
            >
              <input className="field" required placeholder="Your name" aria-label="Your name" />
              <input
                className="field"
                required
                type="email"
                placeholder="Email address"
                aria-label="Email address"
              />
              <textarea
                className="field"
                rows={5}
                required
                placeholder={page === "contact" ? "What’s on your mind?" : "Tell us about yourself"}
                aria-label="Message"
              />
              <Button type="submit">
                Send Message <ArrowRight />
              </Button>
              {done && (
                <div className="mock-success">
                  <Check /> Demo message received. No email has been sent.
                </div>
              )}
            </form>
          </>
        ) : page === "about-us" ? (
          <div className="prose-copy">
            <h2>FOR THE ONES WHO DO THEIR OWN THING.</h2>
            <p>
              OFFGRID is a fictional independent streetwear label built around a simple idea: good
              clothes should feel like you. No borrowed identity. No permission needed.
            </p>
            <p>
              We believe in considered fits, fabrics with substance, and pieces that move seamlessly
              from the everyday to the unexpected. A wardrobe without rules, for a community without
              a mould.
            </p>
            <Button asChild>
              <Link to="/collection/$slug" params={{ slug: "shop-all" }}>
                Meet Your New Rotation <ArrowRight />
              </Link>
            </Button>
          </div>
        ) : page === "design-lab" ? (
          <div className="prose-copy">
            <h2>THE PROCESS IS THE POINT.</h2>
            <p>
              Every piece starts with a silhouette. We explore shape, proportion and fabric to find
              the sweet spot between comfort and expression.
            </p>
            <p>
              From the first sketch to the final stitch, our sample design lab keeps things
              intentional. Small runs. Bold ideas. Clothes you can actually live in.
            </p>
            <Link
              className="underlined"
              to="/collection/$slug"
              params={{ slug: "limited-edition" }}
            >
              EXPLORE THE LATEST DROP ↗
            </Link>
          </div>
        ) : page === "care" ? (
          <div className="prose-copy">
            <h2>GOOD PIECES DESERVE GOOD CARE.</h2>
            <ol>
              <li>Wash cold, inside out, with similar colours.</li>
              <li>Use a gentle detergent. Skip the bleach.</li>
              <li>Dry naturally in the shade; avoid tumble drying.</li>
              <li>Iron inside out on low heat. Avoid printed areas.</li>
              <li>Always follow the care label on your individual garment.</li>
            </ol>
          </div>
        ) : (
          <div className="prose-copy">
            <h2>THE SMALL PRINT. NO SURPRISES.</h2>
            <p>
              This is a placeholder {title.toLowerCase()} page for the OFFGRID showcase. No real
              transactions, accounts or shipments are created.
            </p>
            <h3>
              {page === "privacy"
                ? "YOUR DATA"
                : page === "shipping-policy"
                  ? "DELIVERY"
                  : page === "return-and-refund-policy"
                    ? "RETURNS & REFUNDS"
                    : "USING THIS SHOWCASE"}
            </h3>
            <p>
              {page === "privacy"
                ? "Your shopping bag is saved only in your browser. Mock forms do not send information to a server. Clear your browser storage to remove your saved bag."
                : page === "shipping-policy"
                  ? "Sample delivery estimates are 3–7 working days. Shipping costs would be shown before payment in a real store. No clothing is shipped by this demo."
                  : page === "return-and-refund-policy"
                    ? "The sample return portal previews requests for unworn pieces. No actual refunds or exchanges are processed."
                    : "All names, products, store addresses, endorsements and contact details are fictional placeholders. Images are AI-generated. Content is provided for demonstration purposes only."}
            </p>
            <p>Questions? Visit our Contact page for the mock enquiry form.</p>
            <Link to="/pages/$page" params={{ page: "contact" }} className="underlined">
              CONTACT US ↗
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
