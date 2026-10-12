import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import Menu from "lucide-react/dist/esm/icons/menu.js";
import Search from "lucide-react/dist/esm/icons/search.js";
import UserRound from "lucide-react/dist/esm/icons/user-round.js";
import ShoppingBag from "lucide-react/dist/esm/icons/shopping-bag.js";
import X from "lucide-react/dist/esm/icons/x.js";
import ArrowRight from "lucide-react/dist/esm/icons/arrow-right.js";
import Plus from "lucide-react/dist/esm/icons/plus.js";
import Minus from "lucide-react/dist/esm/icons/minus.js";
import Shirt from "lucide-react/dist/esm/icons/shirt.js";
import MapPin from "lucide-react/dist/esm/icons/map-pin.js";
import Globe from "lucide-react/dist/esm/icons/globe.js";
import Check from "lucide-react/dist/esm/icons/check.js";
import Instagram from "lucide-react/dist/esm/icons/instagram.js";
import ChevronDown from "lucide-react/dist/esm/icons/chevron-down.js";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useAuth } from "@/lib/store/auth";
import { placeOrder } from "@/lib/store/orders";
import { useCatalog } from "@/lib/store/products-db";
import { useStore } from "@/lib/store/context";
import { countries, pageLinks, menuCollageProducts, productPhoto, sizes, slugify, type Product } from "@/lib/store/catalog";
const tabs = ["Men", "Women", "Limited Edition", "About Us"];
const categories: Record<string, string[]> = {
  Men: ["Shop All", "T-Shirts", "Hoodies", "Jackets", "Cargo Pants"],
  Women: ["Shop All", "Crop Tops", "Dresses", "Oversized Hoodies", "Co-ord Sets"],
  "Limited Edition": [
    "Shop All",
    "Drop Tees",
    "Collab Hoodies",
    "Statement Jackets",
    "Collector Sets",
  ],
  "About Us": ["About Us", "Design Lab", "Referral", "Gift Card", "Store Locator"],
};
export function StoreHeader() {
  const { open, count } = useStore();
  const [splash, setSplash] = useState(false);
  const [mega, setMega] = useState<string | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const { user, signOut } = useAuth();
  const loggedIn = Boolean(user);
  const headerRef = useRef<HTMLElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  useEffect(() => { setMega(null); setAccountOpen(false); }, [pathname]);
  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (!(event.target instanceof Node)) return;
      if (!headerRef.current?.contains(event.target)) setMega(null);
      if (!accountRef.current?.contains(event.target)) setAccountOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setMega(null); setAccountOpen(false); }
    };
    const viewport = window.matchMedia("(min-width: 901px)");
    const resize = () => { if (!viewport.matches) setMega(null); };
    const scroll = (event: Event) => {
      if (event.target instanceof Node && headerRef.current?.contains(event.target)) return;
      setMega(null);
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    window.addEventListener("scroll", scroll, { passive: true, capture: true });
    viewport.addEventListener("change", resize);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
      window.removeEventListener("scroll", scroll, { capture: true });
      viewport.removeEventListener("change", resize);
    };
  }, []);
  const showOverlay = (name: string) => { setMega(null); setAccountOpen(false); open(name); };
  const showMega = (name: string) => { setAccountOpen(false); setMega((current) => current === name ? null : name); };
  useEffect(() => {
    if (!sessionStorage.getItem("offgrid-visited")) {
      setSplash(true);
      sessionStorage.setItem("offgrid-visited", "1");
      const t = setTimeout(() => setSplash(false), 850);
      return () => clearTimeout(t);
    }
    return undefined;
  }, []);
  return (
    <>
      {splash && (
        <div className="brand-splash">
          <span className="brand-logo">
            OFFGRID<span className="brand-dot">®</span>
          </span>
          <span className="eyebrow">NOT FOR THE ORDINARY.</span>
        </div>
      )}
      <div className="announcement">
        NOT FOR THE ORDINARY. <span>NEITHER ARE YOU.</span>
        <ArrowRight size={12} />
      </div>
      <header className="store-header" ref={headerRef}>
        <div className="header-main">
          <Button className="mobile-menu-trigger" size="icon" variant="ghost" aria-label="Open menu" onClick={() => showOverlay("menu")}>
            <Menu />
          </Button>
          <Link to="/" className="brand-logo" aria-label="OFFGRID home">
            OFFGRID<span className="brand-dot">®</span>
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {["Men", "Women"].map((name) => <div key={name} className={`mega-trigger ${mega === name ? "active" : ""}`}>
              <Link to="/collection/$slug" params={{ slug: slugify(name) }}>{name}</Link>
              <Button variant="ghost" size="icon" aria-label={`${name} menu`} aria-expanded={mega === name} aria-controls="store-mega-menu" onClick={() => showMega(name)}><ChevronDown aria-hidden="true" size={14} /></Button>
            </div>)}
            <Link to="/collection/$slug" params={{ slug: "limited-edition" }} onClick={() => { setMega(null); setAccountOpen(false); }}>Limited Edition</Link>
            <Link to="/pages/$page" params={{ page: "about-us" }} onClick={() => { setMega(null); setAccountOpen(false); }}>About Us</Link>
          </nav>
          <div className="header-icons">
            <Button size="icon" variant="ghost" aria-label="Search" onClick={() => showOverlay("search")}>
              <Search />
            </Button>
            <div className="account-anchor" ref={accountRef}>
              <Button size="icon" variant="ghost" aria-label={loggedIn ? "Account" : "Sign in"} aria-expanded={loggedIn ? accountOpen : undefined} aria-controls={loggedIn ? "store-account-menu" : undefined} onClick={() => {
                setMega(null);
                if (loggedIn) setAccountOpen((value) => !value);
                else showOverlay("login");
              }}><UserRound /></Button>
              {loggedIn && accountOpen && <nav className="account-menu" id="store-account-menu" aria-label="Account menu">
                {[
                  ["edit-profile", "EDIT PROFILE"],
                  ["order-history", "ORDER HISTORY"],
                  ["order-tracking", "TRACK YOUR ORDER"],
                  ["returns-and-exchanges", "RETURNS AND EXCHANGE"],
                ].map(([page, label]) => <Link key={page} to="/pages/$page" params={{ page: page ?? "edit-profile" }} onClick={() => setAccountOpen(false)}>{label}<span aria-hidden="true">&gt;</span></Link>)}
                <Button variant="ghost" onClick={() => { void signOut(); setAccountOpen(false); }}>LOGOUT<span aria-hidden="true">&gt;</span></Button>
              </nav>}
            </div>
            <Button
              size="icon"
              variant="ghost"
              aria-label={`Cart (${count})`}
              onClick={() => showOverlay("cart")}
            >
              <ShoppingBag />
              <span className="cart-count">{count}</span>
            </Button>
          </div>
        </div>
        <nav className="top-tabs">
          {tabs.map((t) =>
            t === "About Us" ? (
              <Link key={t} to="/pages/$page" params={{ page: "about-us" }}>
                {t}
              </Link>
            ) : (
              <Link
                key={t}
                to="/collection/$slug"
                params={{ slug: slugify(t) }}
                className={t === "Limited Edition" ? "limited-nav" : ""}
              >
                {t}
                {t === "Limited Edition" && <i />}
              </Link>
            ),
          )}
        </nav>
        {mega && <MegaMenu audience={mega} close={() => setMega(null)} />}
      </header>
    </>
  );
}
function SideMenuLinks({ close }: { close: () => void }) {
  return <>
    <Link to="/collection/$slug" params={{ slug: "new-in" }} onClick={close}>New In</Link>
    <Link to="/pages/$page" params={{ page: "find-your-fit" }} onClick={close}>Find your Silhouette</Link>
    <Link to="/pages/$page" params={{ page: "referral" }} onClick={close}>Refer A Friend</Link>
    <Link to="/gift-card" onClick={close}>Gift A Comet</Link>
    <Link to="/collection/$slug" params={{ slug: "only-few-left" }} onClick={close}>Only Few Left</Link>
    <Link to="/pages/$page" params={{ page: "design-lab" }} onClick={close}>The Garage</Link>
  </>;
}
function MegaMenu({ audience, close }: { audience: string; close: () => void }) {
  const items = categories[audience]?.slice(1) ?? [];
  const { products } = useCatalog();
  const collage = menuCollageProducts(audience, products);
  return <nav id="store-mega-menu" className="store-mega-menu" aria-label={`${audience} collections`}>
    <Link className="mega-shop-all" to="/collection/$slug" params={{ slug: slugify(audience) }} onClick={close}>
      <strong>SHOP ALL</strong>
      <div className="mega-collage">{collage.map((product) => <img key={product.id} src={product.image} alt={product.name} />)}</div>
    </Link>
    <div className="mega-category-grid">{items.map((category) => {
      const product = products.find((item) => item.category === category && item.audience === audience);
      return <Link key={category} className="mega-category-tile" to="/collection/$slug" params={{ slug: slugify(category) }} onClick={close}>
        {product && <img src={product.image} alt={category} />}<strong>{category.toUpperCase()}</strong>
      </Link>;
    })}</div>
    <div className="mega-text-links">
      <SideMenuLinks close={close} />
    </div>
  </nav>;
}
export function StoreFooter() {
  const { country, open } = useStore();
  return (
    <footer className="store-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <Link to="/" className="brand-logo">
            OFFGRID®
          </Link>
          <p>
            For the ones who don't fit the mould.
            <br />
            And never wanted to.
          </p>
          <div className="socials">
            <a href="https://instagram.com" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="https://youtube.com">YouTube ↗</a>
            <a href="https://pinterest.com">Pinterest ↗</a>
          </div>
        </div>
        <div>
          <h3>GET IN TOUCH</h3>
          <a href="https://wa.me/919000000000">WhatsApp: +91 90000 00000</a>
          <a href="mailto:hello@offgrid.example">hello@offgrid.example</a>
          <a href="mailto:gifting@offgrid.example">Gifting & corporate orders</a>
          <a href="mailto:partners@offgrid.example">Partnerships</a>
          <Link to="/pages/$page" params={{ page: "careers" }}>
            Careers ↗
          </Link>
          <p>
            Studio 01, Indiranagar,
            <br />
            Bengaluru, India 560038
          </p>
        </div>
        <div>
          <h3>THE BRAND</h3>
          {pageLinks
            .filter(([k]) => ["about-us", "design-lab", "referral", "store-locator"].includes(k))
            .map(([k, v]) => (
              <Link key={k} to="/pages/$page" params={{ page: k }}>
                {v}
              </Link>
            ))}
          <Link to="/gift-card">Gift a Card</Link>
        </div>
        <div>
          <h3>QUICK LINKS</h3>
          <Link to="/">Home</Link>
          {pageLinks
            .filter(
              ([k]) =>
                !["about-us", "design-lab", "referral", "careers", "store-locator"].includes(k),
            )
            .map(([k, v]) => (
              <Link key={k} to="/pages/$page" params={{ page: k }}>
                {v}
              </Link>
            ))}
        </div>
      </div>
      <div className="footer-bottom">
        <div>
          © 2026 OFFGRID. All rights reserved.<p>Above is the only official website of OFFGRID.</p>
        </div>
        <Button variant="ghost" onClick={() => open("country")}>
          <Globe size={16} />
          {country} <ChevronDown size={14} />
        </Button>
      </div>
      <p className="demo-note">
        Showcase store · Sample contacts, reviews and press quotes · No real payments or orders.
      </p>
      <div className="footer-wordmark">STAY OFFGRID.</div>
    </footer>
  );
}
export function Selectors({
  product: p,
  size,
  setSize,
  color,
  setColor,
}: {
  product: Product;
  size: string;
  setSize: (s: string) => void;
  color: string;
  setColor: (s: string) => void;
}) {
  return (
    <>
      <div className="selector-label">COLOUR — {color.toUpperCase()}</div>
      <div className="swatch-row">
        {p.colors.map((c) => (
          <Button
            key={c}
            variant="outline"
            size="icon"
            aria-label={c}
            aria-pressed={color === c}
            className={`color-swatch swatch-${c.toLowerCase()} ${color === c ? "selected" : ""}`}
            onClick={() => setColor(c)}
          />
        ))}
      </div>
      <div className="selector-label">
        SELECT SIZE <span>{p.soldOut.includes(size) ? "SOLD OUT" : ""}</span>
      </div>
      <div className="size-row">
        {sizes.map((s) => (
          <Button
            key={s}
            variant={size === s ? "default" : "outline"}
            className={p.soldOut.includes(s) ? "sold-out" : ""}
            onClick={() => setSize(s)}
          >
            {s}
          </Button>
        ))}
      </div>
    </>
  );
}
export function CartContents({ page = false }: { page?: boolean }) {
  const { cart, quantity, money, total, open, setQuick, clear } = useStore();
  const { products } = useCatalog();
  const { user } = useAuth();
  const [placing, setPlacing] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState("");
  const checkout = async () => {
    // Orders belong to a user, so a visitor must sign in first.
    if (!user) {
      open("login");
      return;
    }
    setPlacing(true);
    setCheckoutError("");
    try {
      const number = await placeOrder(cart); // saves the order in the Supabase "orders" table
      clear();
      setOrderNumber(number);
    } catch {
      setCheckoutError("We couldn't place your order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };
  if (orderNumber && !cart.length)
    return (
      <div className="empty-cart">
        <Check size={46} strokeWidth={1} />
        <h2>Order {orderNumber} is in</h2>
        <p className="mock-success" role="status">
          You're all set. This is a showcase checkout; no payment has been taken.
        </p>
        <Button asChild>
          <Link to="/pages/$page" params={{ page: "order-history" }} onClick={() => open(null)}>
            View order history <ArrowRight />
          </Link>
        </Button>
      </div>
    );
  if (!cart.length)
    return (
      <div className="empty-cart">
        <ShoppingBag size={46} strokeWidth={1} />
        <h2>No pieces yet, let's fix that</h2>
        <Button onClick={() => open(null)} asChild>
          <Link to="/collection/$slug" params={{ slug: "bestsellers" }}>
            Get Started <ArrowRight />
          </Link>
        </Button>
        <h3>OUR BESTSELLERS</h3>
        {products.slice(0, 3).map((p) => (
          <div className="mini-product" key={p.id}>
            <img src={p.image} alt={p.name} />
            <div>
              <Link to="/product/$id" params={{ id: p.id }} onClick={() => open(null)}>
                {p.name}
              </Link>
              <p>{money(p.price)}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Add ${p.name}`}
              onClick={() => {
                setQuick(p);
              }}
            >
              <Plus />
            </Button>
          </div>
        ))}
      </div>
    );
  return (
    <div className={page ? "cart-page-content" : "cart-contents"}>
      {cart.map((i) => (
        <div className="cart-item" key={i.key}>
          <img src={productPhoto(i.product, products)} alt={i.product.name} />
          <div className="min-w-0">
            <h3>{i.product.name}</h3>
            <p>
              {i.color} / {i.size}
            </p>
            {i.recipient && <p>To: {i.recipient}</p>}
            <strong>{money(i.product.price)}</strong>
            <div className="qty-controls">
              <Button
                size="icon"
                variant="ghost"
                aria-label={`Decrease ${i.product.name}`}
                onClick={() => quantity(i.key, i.qty - 1)}
              >
                <Minus />
              </Button>
              <span>{i.qty}</span>
              <Button
                size="icon"
                variant="ghost"
                aria-label={`Increase ${i.product.name}`}
                onClick={() => quantity(i.key, i.qty + 1)}
              >
                <Plus />
              </Button>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            aria-label={`Remove ${i.product.name}`}
            onClick={() => quantity(i.key, 0)}
          >
            <X />
          </Button>
        </div>
      ))}
      <div className="cart-summary">
        <div>
          <span>Subtotal</span>
          <strong>{money(total)}</strong>
        </div>
        <p>Inclusive of taxes. Shipping calculated at checkout.</p>
        <Button className="w-full" size="lg" disabled={placing} onClick={checkout}>
          {placing ? "Placing order…" : "Checkout"} <ArrowRight />
        </Button>
        {!page && (
          <Link to="/cart" onClick={() => open(null)} className="underlined mt-4">
            VIEW CART
          </Link>
        )}
        {checkoutError && (
          <div className="mock-success" role="alert">
            {checkoutError}
          </div>
        )}
      </div>
    </div>
  );
}
export function StoreOverlays() {
  const { overlay, open, quick, setQuick, add, money, country, setCountry } = useStore();
  const { products } = useCatalog();
  const { signInWithGoogle } = useAuth();
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState("Men");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("Onyx");
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  useEffect(() => {
    setSize("");
    setColor("Onyx");
  }, [quick]);
  useEffect(() => {
    if (overlay === "login") setLoginError("");
  }, [overlay]);
  const close = () => open(null);
  const saveSearch = (q: string) => setRecent((v) => [q, ...v.filter((s) => s !== q)].slice(0, 5));
  return (
    <>
      <Sheet open={overlay === "menu"} onOpenChange={(v) => !v && close()}>
        <SheetContent side="left" className="store-drawer">
          <SheetTitle className="brand-logo">OFFGRID®</SheetTitle>
          <div className="drawer-tabs">
            {tabs.map((t) => (
              <Button
                variant="ghost"
                key={t}
                className={tab === t ? "active" : ""}
                onClick={() => setTab(t)}
              >
                {t}
              </Button>
            ))}
          </div>
          <div className="drawer-categories">
            {(categories[tab] ?? categories['Men'] ?? []).map((c, i) =>
              tab === "About Us" ? (
                <Link
                  key={c}
                  to={c === "Gift Card" ? "/gift-card" : "/pages/$page"}
                  params={{ page: slugify(c) }}
                  onClick={close}
                >
                  <Shirt size={20} />
                  {c}
                  <ArrowRight size={18} />
                </Link>
              ) : (
                <Link
                  key={c}
                  to="/collection/$slug"
                  params={{ slug: i === 0 ? slugify(tab) : slugify(c) }}
                  onClick={close}
                >
                  <Shirt size={20} />
                  {c}
                  <ArrowRight size={18} />
                </Link>
              ),
            )}
          </div>
          <div className="drawer-extras">
            <SideMenuLinks close={close} />
          </div>
        </SheetContent>
      </Sheet>
      <Sheet open={overlay === "cart"} onOpenChange={(v) => !v && close()}>
        <SheetContent className="store-drawer">
          <SheetTitle className="drawer-title">YOUR BAG</SheetTitle>
          <CartContents />
        </SheetContent>
      </Sheet>
      <Dialog open={Boolean(quick)} onOpenChange={(v) => !v && setQuick(null)}>
        <DialogContent className="quick-modal">
          {quick && (
            <>
              <img className="quick-photo" src={quick.image} alt={quick.name} />
              <div>
                <span className="eyebrow">THE EVERYDAY EDIT</span>
                <DialogTitle className="quick-title">{quick.name}</DialogTitle>
                <p className="mt-3">
                  {money(quick.price)} <small>incl. of taxes</small>
                </p>
                <Selectors
                  product={quick}
                  size={size}
                  setSize={setSize}
                  color={color}
                  setColor={setColor}
                />
                <Button
                  className="w-full mt-6"
                  disabled={!size || quick.soldOut.includes(size)}
                  onClick={() => add(quick, size, color)}
                >
                  {quick.soldOut.includes(size)
                    ? "Size sold out"
                    : size
                      ? "Add To Cart"
                      : "Select a size"}{" "}
                  <Plus />
                </Button>
                <Link
                  to="/product/$id"
                  params={{ id: quick.id }}
                  onClick={() => setQuick(null)}
                  className="underlined mt-4"
                >
                  VIEW ALL DETAILS <ArrowRight size={14} />
                </Link>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={overlay === "search"} onOpenChange={(v) => !v && close()}>
        <DialogContent className="search-modal">
          <DialogTitle className="drawer-title">FIND YOUR NEXT PIECE.</DialogTitle>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveSearch(query);
            }}
            className="search-input"
          >
            <Search />
            <input
              autoFocus
              placeholder="Search tees, hoodies, more..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
          {query ? (
            <div className="search-results">
              {products
                .filter(
                  (p) =>
                    p.name.toLowerCase().includes(query.toLowerCase()) ||
                    p.category.toLowerCase().includes(query.toLowerCase()),
                )
                .map((p) => (
                  <Link
                    key={p.id}
                    to="/product/$id"
                    params={{ id: p.id }}
                    onClick={() => {
                      saveSearch(query);
                      close();
                    }}
                  >
                    <img src={p.image} alt="" />
                    {p.name}
                    <span>{money(p.price)}</span>
                  </Link>
                ))}
              {!products.some((p) =>
                (p.name + " " + p.category).toLowerCase().includes(query.toLowerCase()),
              ) && <p>No pieces found. Try “tee” or “hoodie”.</p>}
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mt-4">
                <h3>Recent Searches</h3>
                <Button variant="link" onClick={() => setRecent([])}>
                  Clear All
                </Button>
              </div>
              {recent.length ? (
                recent.map((r) => (
                  <Button key={r} variant="ghost" onClick={() => setQuery(r)}>
                    {r}
                  </Button>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">Your next obsession starts here.</p>
              )}
              <h3 className="mt-8 mb-3">Trending Searches</h3>
              {["Oversized Tees", "Hoodies", "Limited Edition", "Cargo Pants"].map((s, i) => (
                <Link
                  key={s}
                  to="/collection/$slug"
                  params={{
                    slug:
                      ["t-shirts", "hoodies", "limited-edition", "cargo-pants"][i] ?? "shop-all",
                  }}
                  onClick={() => {
                    saveSearch(s);
                    close();
                  }}
                  className="trending-link"
                >
                  {s}
                  <ArrowRight size={16} />
                </Link>
              ))}
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={overlay === "login"} onOpenChange={(v) => !v && close()}>
        <DialogContent className="login-modal">
          <span className="brand-logo">OFFGRID®</span>
          <DialogTitle className="drawer-title mt-5">WELCOME TO THE INSIDE.</DialogTitle>
          <p className="my-5 text-muted-foreground">Good fits. Fresh drops. Your kind of people.</p>
          {/* OAuth: we never see or store a password. Google confirms who the visitor is, Supabase creates the session. */}
          <Button
            className="w-full"
            onClick={async () => {
              setLoginError("");
              const error = await signInWithGoogle(); // on success the browser leaves for Google
              if (error) setLoginError(error);
            }}
          >
            Continue with Google <ArrowRight />
          </Button>
          {loginError && (
            <p className="mt-3 text-sm" role="alert">
              {loginError}
            </p>
          )}
          <small className="text-muted-foreground mt-3">
            Secure sign-in with your Google account. We never see your password.
          </small>
        </DialogContent>
      </Dialog>
      <Dialog open={overlay === "country"} onOpenChange={(v) => !v && close()}>
        <DialogContent>
          <DialogTitle className="drawer-title">WHERE ARE YOU?</DialogTitle>
          <p className="text-muted-foreground">Choose your country and currency.</p>
          {countries.map((c) => (
            <Button
              key={c.name}
              variant="outline"
              className="justify-between w-full"
              onClick={() => {
                setCountry(c.name);
                close();
              }}
            >
              <span>
                {c.name} — {c.symbol}
              </span>
              {country === c.name && <Check />}
            </Button>
          ))}
        </DialogContent>
      </Dialog>
    </>
  );
}
