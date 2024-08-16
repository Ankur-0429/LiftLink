import authConfig from "./auth.config";
import NextAuth from "next-auth";
import { apiAuthPrefix, authRoutes, DEFAULT_LOGIN_REDIRECT, DEFAULT_LOGOUT_REDIRECT, publicRoutes } from "./routes";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);
export default auth((req) => {
    const {nextUrl, method, headers} = req;
    const isLoggedIn = !!req.auth;
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    const isCrawler = headers.get("user-agent")?.toLowerCase().includes("bot");

    if (method === 'HEAD' || isCrawler) {
        return NextResponse.next();
    }

    if (isApiAuthRoute) {
        return;
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
        return;
    }

    if (!isLoggedIn && !isPublicRoute) {
        return Response.redirect(new URL(DEFAULT_LOGOUT_REDIRECT, nextUrl));
    }

    return;
})

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ]
}