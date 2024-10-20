import { auth } from "./auth";
import { API_ROUTE_PREFIX, AUTH_ROUTES, DEFAULT_LOGIN_REDIRECT, PUBLIC_ROUTES } from "./routes";

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isApiRoute = nextUrl.pathname.startsWith(API_ROUTE_PREFIX);
    const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);
    const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname);

    if (isApiRoute) {
        return;
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        } else {
            return;
        }
    }

    if (!isLoggedIn && !isPublicRoute) {
        const url = new URL("/sign-in", nextUrl);
        
        if (nextUrl.pathname !== DEFAULT_LOGIN_REDIRECT && !isAuthRoute) {
            url.searchParams.set("callbackUrl", nextUrl.pathname);
        }
            
        return Response.redirect(url);
    }
});

// Config from Clerk
export const config = {
    matcher: [
      // Skip Next.js internals and all static files, unless found in search params
      '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
      // Always run for API routes
      '/(api|trpc)(.*)',
    ],
  }