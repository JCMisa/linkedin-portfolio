import { clerkMiddleware } from "@clerk/nextjs/server";

/**
 * Clerk session handling only (it makes auth() work in pages, route handlers
 * and actions). Authorization is resource-based, as Clerk recommends: every
 * page, route handler and server action that needs a user checks the session
 * itself (getSessionUser / requireUser / requireAdmin / auth()), so nothing
 * depends on path matching here. The site is public by default.
 */
export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
