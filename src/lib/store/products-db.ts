import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { imageByKey, products as sampleProducts, type Product } from "./catalog";

// One row of the Supabase "products" table (column names use snake_case).
type ProductRow = {
  id: string;
  name: string;
  category: string;
  audience: string;
  price: number;
  image_key: string;
  colors: string[];
  sold_out: string[];
  limited: boolean;
  few: boolean;
  tag: string | null;
};

// Convert a database row into the Product shape the UI already understands.
export function rowToProduct(row: ProductRow): Product {
  const image = imageByKey[row.image_key] ?? sampleProducts[0]?.image ?? "";
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    audience: row.audience,
    price: row.price,
    image,
    alternate: image,
    colors: row.colors,
    soldOut: row.sold_out,
    limited: row.limited,
    few: row.few,
    tag: row.tag ?? undefined,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*").order("sort_order");
  if (error) throw error;
  if (!data?.length) throw new Error("No products returned");
  return (data as ProductRow[]).map(rowToProduct);
}

// One product by id (used by the product page loader). Returns null when it truly doesn't exist.
// If the database can't be reached we fall back to the sample catalog so the page still works.
export async function fetchProduct(id: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data ? rowToProduct(data as ProductRow) : null;
  } catch {
    return sampleProducts.find((p) => p.id === id) ?? null;
  }
}

// Used by every component that needs the product list.
// - First render uses the built-in sample catalog (no loading flicker, works on the server).
// - Then React Query fetches the real list from Supabase and the UI updates by itself.
// - If Supabase is unreachable the sample catalog simply stays on screen.
export function useCatalog() {
  const query = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    initialData: sampleProducts,
    initialDataUpdatedAt: 0, // "this sample data is ancient" -> forces a real fetch on first load
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
  return { products: query.data, error: query.error };
}
