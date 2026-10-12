> [!IMPORTANT]
> Avoid rewriting published git history — force pushing, or rebasing/amending/
> squashing commits that are already pushed — as it can destroy committed work.
> Keep the connected branch in a working state at all times.

- Preserve the imported OFFGRID TanStack storefront and shared StoreProvider; keep requested header interactions in the store shell to avoid changing shopping flows.
- Accounts use Supabase Google OAuth (src/lib/store/auth.tsx); account pages stay inside the existing dynamic information route. Authorization is enforced by Row Level Security in the database, never by client-side flags.
- Serve bundled original website images directly without changing their content.
- Share supplementary menu links within the store shell between desktop panels and the mobile drawer so their destinations stay consistent; reuse existing pages for renamed links.
- Standalone exports use standard TanStack/Vite plugins and bundled original image files instead of editor plugins and asset pointers so the store runs independently on localhost; keep the managed preview configuration separate.

- Keep product and alternate photos audience/category-specific in the shared catalog; menu collages select their four category photos so every presentation stays consistent without changing shopping data.
