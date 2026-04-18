import { pb } from "src/Utility/pocketbase";

export const ROLE_SUPER = "super";
export const ROLE_EDITOR = "editor";

export const EDITOR_ALLOWED_PREFIXES = [
  "/general/site-settings",
  "/news",
  "/vehicles",
  "/leads",
  "/sub",
];

export const EDITOR_ALLOWED_MENU_KEYS = [
  "Dashboard",
  "General",
  "News",
  "Vehicles",
  "Leads",
  "Magazine",
];

export const EDITOR_ALLOWED_GENERAL_CHILDREN = ["Site Settings"];

export function getCurrentRole() {
  if (!pb.authStore.isValid) return null;
  if (pb.authStore.isAdmin) return ROLE_SUPER;
  return pb.authStore.model?.role || null;
}

export function canAccess(pathname, role) {
  if (role === ROLE_SUPER) return true;
  if (role === ROLE_EDITOR) {
    if (pathname === "/" || pathname === "") return true;
    return EDITOR_ALLOWED_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
    );
  }
  return false;
}
