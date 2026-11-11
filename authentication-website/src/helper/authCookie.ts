import type { NextResponse } from "next/server";

export const AUTH_COOKIE_NAME = "token";
export const AUTH_TOKEN_TTL_SECONDS = 60 * 60 * 24; // 1 day

const baseOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
};

export function setAuthCookie(response: NextResponse, token: string) {
    response.cookies.set(AUTH_COOKIE_NAME, token, {
        ...baseOptions,
        maxAge: AUTH_TOKEN_TTL_SECONDS,
    });
}

export function clearAuthCookie(response: NextResponse) {
    response.cookies.set(AUTH_COOKIE_NAME, "", {
        ...baseOptions,
        maxAge: 0,
    });
}
