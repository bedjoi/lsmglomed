// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

// export default clerkMiddleware(async (auth, req) => {
//     if (!isPublicRoute(req)) {
//         await auth.protect();
//     }
// });

// export const config = {
//     matcher: [
//         // Skip Next.js internals and all static files, unless found in search params
//         "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//         // Always run for API routes
//         "/(api|trpc)(.*)",
//     ],
// };

// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";

// Define public and protected routes for Clerk
const isPublicRoute = createRouteMatcher([
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api/webhook",
]);
// Add any other routes that should be publicly accessible,
// including your Stripe webhook endpoint

export default clerkMiddleware(async (auth, req) => {
    // Apply Clerk authentication
    if (!isPublicRoute(req)) {
        await auth.protect();
    }
});

export const config = {
    matcher: [
        // Include all routes where middleware should run,
        // including API routes for Stripe webhooks
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
    ],
};
