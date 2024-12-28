import { auth } from "./auth";
import { API_ROUTE_PREFIX, AUTH_ROUTES, CHOOSE_PROFILE_ROUTE, DEFAULT_LOGIN_REDIRECT, PREMIUM_ROUTES, PUBLIC_ROUTES } from "./routes";
import { getProfiles } from "./features/profiles/actions";

export default auth(async(req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth && req.auth.user;

    const isApiRoute = nextUrl.pathname.startsWith(API_ROUTE_PREFIX);
    const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);
    const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname);
    const isPremiumRoute = PREMIUM_ROUTES.includes(nextUrl.pathname) || nextUrl.pathname.includes("/watch");

    if (isApiRoute) {
        return;
    }

    if (nextUrl.pathname === "/email-verification") {
        if (!req.auth?.user.emailVerified) {
            return;
        }
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

    if ((!isPublicRoute || (nextUrl.pathname === "/" && !!req.auth)) && req.auth) {
        const profiles = await getProfiles();
            
        if (!profiles[0] && nextUrl.pathname !== "/profiles/create") {
            return Response.redirect(new URL("/profiles/create", nextUrl));
        }

        if (nextUrl.pathname !== CHOOSE_PROFILE_ROUTE && nextUrl.pathname !== "/profiles/create" && !req.auth.user.profileId) {
            return Response.redirect(new URL(CHOOSE_PROFILE_ROUTE, nextUrl));
        }

        if (isPremiumRoute && !req.auth.user.isSubscribed && nextUrl.pathname !== "/choose-plan") {
            return Response.redirect(new URL("/choose-plan", nextUrl));
        }
        
        if (nextUrl.pathname === "/choose-plan" && req.auth.user.isSubscribed) {
            return Response.redirect(new URL("/", nextUrl));
        }
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