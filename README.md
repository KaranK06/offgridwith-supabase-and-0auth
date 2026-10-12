# OFFGRID — Complete local storefront

## Run locally

1. Install Node.js 22.12 or newer (Node.js 24 LTS recommended).
2. Extract this ZIP and open a terminal in the `offgrid` folder containing `package.json`.
3. Run:

```sh
npm install
npm run dev
```

Open **http://localhost:3000**. Stop the server with Ctrl+C.

## Supabase database + Google login

The store now reads products from a Supabase database and lets customers sign in with Google (OAuth).

1. Copy `.env.example` to `.env` and fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
   (Supabase Dashboard -> Project Settings -> API). Restart `npm run dev` after editing `.env`.
2. In Google Cloud Console create an OAuth client (type "Web application") with
   - Authorized JavaScript origin: `http://localhost:3000`
   - Authorized redirect URI: `https://<your-project-ref>.supabase.co/auth/v1/callback`
3. In Supabase -> Authentication -> Sign In / Providers -> Google: enable it and paste the Client ID and Client Secret.
4. In Supabase -> Authentication -> URL Configuration: set Site URL to `http://localhost:3000` and add
   `http://localhost:3000/**` to Redirect URLs (add your deployed URL too when you publish).

How it fits together:

- `src/lib/supabase.ts` - the single Supabase client.
- `src/lib/store/auth.tsx` - login state (`useAuth`) and `signInWithGoogle` / `signOut`.
- `src/lib/store/products-db.ts` - loads products from the `products` table (falls back to the built-in sample list).
- `src/lib/store/context.tsx` - cart stays in the browser for guests; for logged-in users it is also saved in `cart_items`.
- `src/lib/store/orders.ts` and `account.ts` - orders and profile (`orders`, `profiles` tables).
- Security lives in the database: Row Level Security policies make sure each user can only read and write their own rows.

## Production

```sh
npm run build
npm start
```

Open **http://localhost:3000**. To change the production port, set the `PORT` environment variable.

## Tests

```sh
npm test
```

## Included

All storefront pages, original campaign/product/portrait images (14 JPEGs), OFFGRID favicon, design styles, shared shopping bag and wishlist, account demo, header menus, and tests. The standard TanStack Start, React, Tailwind CSS, Vite, and Nitro setup runs independently.

Guests keep a browser-local cart. Signed-in users (Google OAuth via Supabase) get their cart, profile and orders stored in the database. Checkout does not charge cards; no real payment service or order fulfillment is connected. Contact/social details and catalog entries remain the supplied sample content.

Internet is needed for the first dependency installation and Google Fonts. All original store photos are bundled locally; product photos are bundled locally; the Supabase URL and publishable key in `.env` are needed for the database and login.

## Structure

- `src/routes`: all storefront pages and metadata
- `src/components/store`: header, footer, menus, product controls, account views
- `src/lib/store`: catalog and shared cart/account state
- `src/assets`: original photo files
- `src/components/ui`: reusable controls
- `src/styles.css`: design tokens and styles
- `src/test`: tests
- `public/favicon.svg`: OFFGRID icon

Dependencies and generated build output are intentionally excluded; the installation and build commands create them on your computer.
