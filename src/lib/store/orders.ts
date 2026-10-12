import { supabase } from "@/lib/supabase";
import { cartTotal, type CartItem } from "./context";

// What we store inside the "items" JSON column of an order. We copy name and price into the order
// on purpose: if a product is renamed or repriced later, past orders must still show what was bought.
export type OrderItem = {
  product_id: string;
  name: string;
  size: string;
  color: string;
  qty: number;
  price: number;
  recipient?: string | undefined;
  message?: string | undefined;
};
export type Order = {
  number: string;
  date: string;
  items: string;
  status: string;
  total: number;
};

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// Explicit format ("18 Sep 2026") so it looks the same in every browser and language setting.
function formatDate(iso: string) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export async function placeOrder(cart: CartItem[]): Promise<string> {
  const items: OrderItem[] = cart.map((i) => ({
    product_id: i.product.id,
    name: i.product.name,
    size: i.size,
    color: i.color,
    qty: i.qty,
    price: i.product.price,
    recipient: i.recipient,
    message: i.message,
  }));
  // We do NOT send user_id: the column defaults to auth.uid() (the logged-in user) inside the database,
  // and the RLS policy rejects the insert if it were anyone else's id.
  const { data, error } = await supabase
    .from("orders")
    .insert({ items, total: cartTotal(cart) })
    .select("number")
    .single();
  if (error) throw error;
  return data.number as string;
}

export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("number, items, total, status, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    number: row.number as string,
    date: formatDate(row.created_at as string),
    items: ((row.items ?? []) as OrderItem[]).map((i) => `${i.name} × ${i.qty}`).join(", "),
    status: row.status as string,
    total: row.total as number,
  }));
}
