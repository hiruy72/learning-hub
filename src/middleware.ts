import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth";

const publicRoutes = ["/", "/sign-in", "/sign-up", "/blogs", "/api/auth/register", "/api/auth/login", "/api/auth/me"];
const authRoutes = ["/sign-in", "/sign-up"];

export default async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Check if the route is public or an auth route
    const isPublicRoute = publicRoutes.some(route => path === route || path.startsWith(route + "/"));
    const isAuthRoute = authRoutes.some(route => path === route);

    const session = request.cookies.get("session")?.value;

    let decryptedSession = null;
    if (session) {
        try {
            decryptedSession = await decrypt(session);
        } catch (error) {
            // Invalid session
        }
    }

    // Redirect to login if accessing a protected route without a session
    if (!isPublicRoute && !decryptedSession) {
        return NextResponse.redirect(new URL("/sign-in", request.nextUrl));
    }

    // Redirect to dashboard if accessing login/signup with an active session
    if (isAuthRoute && decryptedSession) {
        return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
};
