/** Roles allowed to manage portfolio content. Safe to import on the client. */
const ADMIN_ROLES = new Set(["admin", "owner"]);

export const isAdminRole = (role: string | null | undefined): boolean =>
  !!role && ADMIN_ROLES.has(role);
