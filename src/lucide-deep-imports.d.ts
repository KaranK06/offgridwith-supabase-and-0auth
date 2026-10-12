// Types for per-icon imports (keeps the dev server from loading all ~1,500 lucide icons).
declare module "lucide-react/dist/esm/icons/*.js" {
  import type { LucideIcon } from "lucide-react";
  const icon: LucideIcon;
  export default icon;
}
