import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AUTH_COOKIE_NAME } from "@/helper/authCookie";

// Thrown when the user is not logged in or the token is not valid.
// Routes turn this into a 401 response.
export class AuthError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AuthError";
    }
}

// Returns the user id stored inside the login token
export const getDataFromToken = (request: NextRequest): string => {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
        throw new AuthError("Authentication token not found. Please login again.");
    }

    const secret = process.env.TOKEN_SECRET;

    if (!secret) {
        throw new Error("TOKEN_SECRET is not configured");
    }

    let decoded: string | JwtPayload;

    try {
        decoded = jwt.verify(token, secret);
    } catch {
        throw new AuthError("Invalid or expired authentication token. Please login again.");
    }

    if (typeof decoded === "string" || typeof decoded.id !== "string") {
        throw new AuthError("Invalid authentication token.");
    }

    return decoded.id;
};
