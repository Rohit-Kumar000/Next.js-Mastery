import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

interface TokenData extends JwtPayload {
    id: string;
    username: string;
    email: string;
}

export const getDataFromToken = (request: NextRequest): string => {
    try {
        // Get token from cookies
        const token = request.cookies.get("token")?.value;

        if (!token) {
            throw new Error("Token not found");
        }

        // Verify JWT token
        const decodedToken = jwt.verify(
            token,
            process.env.TOKEN_SECRET!
        ) as TokenData;

        if (typeof decodedToken.id !== "string") {
            throw new Error("Invalid token payload");
        }

        // Return user ID
        return decodedToken.id;

    } catch (error: unknown) {
        throw new Error(
            error instanceof Error ? error.message : "Invalid token"
        );
    }
};