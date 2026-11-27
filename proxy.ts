import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * The site is public by default; only these need a signed-in user.
 * (Protecting "everything else" turned unknown URLs into sign-in redirects
 * instead of 404s.) Each route below also checks the session itself, and
 * every server action calls requireUser/requireAdmin, so this is defense in
 * depth rather than the only gate.
 */
const isProtectedRoute = createRouteMatcher([
  "/contact/assistant(.*)",
  "/api/chat(.*)",
  "/api/process-inquiry(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
