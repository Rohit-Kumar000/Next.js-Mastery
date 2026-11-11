import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/helper/authCookie";

// Pages that logged-in users do not need. They are sent to the profile instead.
const GUEST_ONLY_PAGES = ["/login", "/signup", "/forgotpassword"];

// Pages that can be opened without logging in.
// Email links (verify / reset) also work for logged-in users.
const PUBLIC_PAGES = [...GUEST_ONLY_PAGES, "/verify", "/resetpassword"];

export function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const hasToken = Boolean(request.cookies.get(AUTH_COOKIE_NAME)?.value);

    if (hasToken && GUEST_ONLY_PAGES.includes(path)) {
        return NextResponse.redirect(new URL("/profile", request.url));
    }

    if (!hasToken && !PUBLIC_PAGES.includes(path)) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/profile",
        "/login",
        "/signup",
        "/forgotpassword",
        "/resetpassword",
        "/verify",
    ],
};
