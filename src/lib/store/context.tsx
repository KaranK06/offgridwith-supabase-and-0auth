import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { countries, canAddSize, type Product } from "./catalog";
import { useAuth } from "./auth";
import { useCatalog } from "./products-db";
export type CartItem = {
  key: string;
  product: Product;
  size: string;
  color: string;
  qty: number;
  recipient?: string | undefined;
  message?: string | undefined;
};
export function cartTotal(items: CartItem[]) {
  return items.reduce((s, i) => s + i.product.price * i.qty, 0);
}
export function mergeCart(
  items: CartItem[],
  product: Product,
  size: string,
  color: string,
  recipient?: string,
  message?: string,
) {
  const key = `${product.id}-${size}-${color}-${recipient ?? ""}-${message ?? ""}`;
  const found = items.find((i) => i.key === key);
  return found
    ? items.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i))
    : [...items, { key, product, size, color, qty: 1, recipient, message }];
}
// Combine the saved (database) cart with the cart on this device.
// Same item in both -> keep the larger quantity (so merging twice never doubles anything).
export function mergeCartLists(a: CartItem[], b: CartItem[]) {
  const map = new Map<string, CartItem>();
  for (const item of [...a, ...b]) {
    const found = map.get(item.key);
    map.set(item.key, found ? { ...found, qty: Math.max(found.qty, item.qty) } : item);
  }
  return [...map.values()];
}
// Shape of one row in the Supabase "cart_items" table.
type CartRow = {
  item_key: string;
  product_id: string;
  size: string;
  color: string;
  qty: number;
  recipient: string | null;
  message: string | null;
};
type Store = {
  cart: CartItem[];
  add: (p: Product, s: string, c: string, r?: string, m?: string) => void;
  quantity: (k: string, q: number) => void;
  clear: () => void;
  overlay: string | null;
  open: (s: string | null) => void;
  quick: Product | null;
  setQuick: (p: Product | null) => void;
  country: string;
  setCountry: (s: string) => void;
  money: (n: number) => string;
  count: number;
  total: number;
};
const Context = createContext<Store | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [overlay, open] = useState<string | null>(null);
  const [quick, setQuick] = useState<Product | null>(null);
  const [country, setCountry] = useState("India");
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const { products: catalog } = useCatalog();
  const catalogRef = useRef(catalog);
  catalogRef.current = catalog;
  const [dbReady, setDbReady] = useState(false); // true once this user's saved cart has been loaded
  const syncedKeys = useRef<Set<string>>(new Set()); // item keys we know exist in the database
  const hadUser = useRef(false);
  useEffect(() => {
    try {
      const value = JSON.parse(localStorage.getItem("offgrid-cart") ?? "[]");
      if (Array.isArray(value))
        setCart(value.filter((i) => i?.product?.id && Number.isFinite(i.qty) && i.qty > 0));
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) localStorage.setItem("offgrid-cart", JSON.stringify(cart));
  }, [cart, ready]);
  // A) When someone logs in: load their saved cart from the database and merge it with this device's cart.
  //    When they log out: empty the on-screen cart so the next person on this device doesn't see it.
  useEffect(() => {
    if (!ready) return;
    if (!userId) {
      if (hadUser.current) setCart([]);
      hadUser.current = false;
      syncedKeys.current = new Set();
      setDbReady(false);
      return;
    }
    hadUser.current = true;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("cart_items")
        .select("item_key, product_id, size, color, qty, recipient, message");
      if (cancelled || error) return;
      const saved: CartItem[] = [];
      for (const row of (data ?? []) as CartRow[]) {
        const product = catalogRef.current.find((p) => p.id === row.product_id);
        if (!product) continue;
        saved.push({
          key: row.item_key,
          product,
          size: row.size,
          color: row.color,
          qty: row.qty,
          recipient: row.recipient ?? undefined,
          message: row.message ?? undefined,
        });
      }
      syncedKeys.current = new Set(saved.map((i) => i.key));
      setCart((local) => mergeCartLists(saved, local));
      setDbReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId, ready]);

  // B) While logged in: whenever the cart changes, save it to the database (after a short pause so
  //    rapid clicks on +/- become one request). Gift cards are not rows in "products", so they stay on this device only.
  useEffect(() => {
    if (!userId || !dbReady) return;
    const timer = setTimeout(async () => {
      const known = new Set(catalog.map((p) => p.id));
      const saveable = cart.filter((i) => known.has(i.product.id));
      if (saveable.length) {
        await supabase.from("cart_items").upsert(
          saveable.map((i) => ({
            user_id: userId,
            item_key: i.key,
            product_id: i.product.id,
            size: i.size,
            color: i.color,
            qty: i.qty,
            recipient: i.recipient ?? null,
            message: i.message ?? null,
          })),
          { onConflict: "user_id,item_key" },
        );
      }
      const keep = new Set(saveable.map((i) => i.key));
      const removed = [...syncedKeys.current].filter((k) => !keep.has(k));
      if (removed.length) {
        await supabase.from("cart_items").delete().eq("user_id", userId).in("item_key", removed);
      }
      syncedKeys.current = keep;
    }, 400);
    return () => clearTimeout(timer);
  }, [cart, userId, dbReady, catalog]);
  const add = (p: Product, s: string, c: string, r?: string, m?: string) => {
    if (!canAddSize(p, s)) return;
    setCart((old) => mergeCart(old, p, s, c, r, m));
    setQuick(null);
    open("cart");
  };
  const money = (n: number) =>
    (countries.find((c) => c.name === country)?.symbol ?? "₹") + n.toLocaleString("en-IN");
  return (
    <Context.Provider
      value={{
        cart,
        add,
        clear: () => setCart([]),
        quantity: (k, q) =>
          setCart((old) =>
            q <= 0
              ? old.filter((i) => i.key !== k)
              : old.map((i) => (i.key === k ? { ...i, qty: q } : i)),
          ),
        overlay,
        open,
        quick,
        setQuick,
        country,
        setCountry,
        money,
        count: cart.reduce((s, i) => s + i.qty, 0),
        total: cartTotal(cart),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useStore() {
  const c = useContext(Context);
  if (!c) throw new Error("Store context unavailable");
  return c;
}
