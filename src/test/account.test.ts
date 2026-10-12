import { beforeEach, describe, expect, it, vi } from "vitest";

// Replace the real Supabase client with a fake so tests never touch the real database.
const calls: { table: string; op: string; payload?: unknown; filter?: unknown }[] = [];
let nextResult: { data: unknown; error: unknown } = { data: null, error: null };
function chain(table: string, op: string, payload?: unknown) {
  const result = () => Promise.resolve(nextResult);
  const builder: Record<string, unknown> = {
    eq: (col: string, val: unknown) => {
      calls.push({ table, op, payload, filter: { col, val } });
      return builder;
    },
    select: () => builder,
    order: () => result(),
    single: () => result(),
    maybeSingle: () => result(),
    then: (resolve: (v: unknown) => unknown) => {
      if (!calls.some((c) => c.table === table && c.op === op)) calls.push({ table, op, payload });
      return result().then(resolve);
    },
  };
  return builder;
}
vi.mock("@/lib/supabase", () => ({
  isSupabaseConfigured: true,
  supabase: {
    from: (table: string) => ({
      select: () => chain(table, "select"),
      insert: (payload: unknown) => {
        calls.push({ table, op: "insert", payload });
        return chain(table, "insert", payload);
      },
      update: (payload: unknown) => chain(table, "update", payload),
    }),
  },
}));

import { fetchProfile, saveProfile } from "@/lib/store/account";
import { fetchOrders, placeOrder } from "@/lib/store/orders";
import { mergeCart, mergeCartLists } from "@/lib/store/context";
import { products, imageByKey } from "@/lib/store/catalog";
import { rowToProduct } from "@/lib/store/products-db";

beforeEach(() => {
  calls.length = 0;
  nextResult = { data: null, error: null };
});

describe("Database products", () => {
  it("turns a database row into a Product with the bundled image", () => {
    const product = rowToProduct({
      id: "piece-1",
      name: "After Hours Oversized Tee",
      category: "T-Shirts",
      audience: "Men",
      price: 1499,
      image_key: "men-tshirt",
      colors: ["Onyx"],
      sold_out: ["XS"],
      limited: false,
      few: false,
      tag: null,
    });
    expect(product.image).toBe(imageByKey["men-tshirt"]);
    expect(product.soldOut).toEqual(["XS"]);
    expect(product.tag).toBeUndefined();
  });
  it("has an image for every sample product key", () => {
    expect(Object.keys(imageByKey).length).toBeGreaterThanOrEqual(10);
    expect(products.every((p) => Boolean(p.image))).toBe(true);
  });
});

describe("Cart merging after login", () => {
  const p = products[0]!;
  it("keeps the larger quantity and is safe to run repeatedly", () => {
    const saved = mergeCart([], p, "M", "Onyx");
    const local = mergeCart(mergeCart([], p, "M", "Onyx"), p, "M", "Onyx"); // qty 2
    const once = mergeCartLists(saved, local);
    expect(once).toHaveLength(1);
    expect(once[0]?.qty).toBe(2);
    expect(mergeCartLists(once, once)[0]?.qty).toBe(2);
  });
  it("combines different items from both carts", () => {
    const a = mergeCart([], p, "M", "Onyx");
    const b = mergeCart([], p, "L", "Onyx");
    expect(mergeCartLists(a, b)).toHaveLength(2);
  });
});

describe("Profile", () => {
  it("returns empty strings for missing values", async () => {
    nextResult = { data: { name: "Alex", email: "a@x.com", mobile: null, address: null }, error: null };
    expect(await fetchProfile("u1")).toEqual({ name: "Alex", email: "a@x.com", mobile: "", address: "" });
  });
  it("saves only name, mobile and address (never the email)", async () => {
    await saveProfile("u1", { name: "Alex", email: "a@x.com", mobile: "999", address: "Street" });
    const update = calls.find((c) => c.op === "update");
    expect(update?.payload).toEqual({ name: "Alex", mobile: "999", address: "Street" });
  });
});

describe("Orders", () => {
  it("formats order rows for the history page", async () => {
    nextResult = {
      data: [
        {
          number: "OG1",
          created_at: "2026-09-18T12:00:00Z",
          items: [{ name: "Tee", qty: 2 }, { name: "Hoodie", qty: 1 }],
          status: "Placed",
          total: 4000,
        },
      ],
      error: null,
    };
    const [order] = await fetchOrders();
    expect(order?.number).toBe("OG1");
    expect(order?.items).toBe("Tee × 2, Hoodie × 1");
    expect(order?.date).toBe("18 Sep 2026");
  });
  it("places an order without sending a user_id (the database fills it in)", async () => {
    nextResult = { data: { number: "OG1050" }, error: null };
    const cart = mergeCart(mergeCart([], products[0]!, "M", "Onyx"), products[0]!, "M", "Onyx");
    expect(await placeOrder(cart)).toBe("OG1050");
    const insert = calls.find((c) => c.op === "insert")?.payload as Record<string, unknown>;
    expect(insert["total"]).toBe(2998);
    expect(insert).not.toHaveProperty("user_id");
  });
});
