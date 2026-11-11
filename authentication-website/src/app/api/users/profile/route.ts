import { NextRequest, NextResponse } from "next/server";
import { AuthError, getDataFromToken } from "@/helper/getDataFromToken";
import User from "@/model/userModel";
import { connect } from "@/database/config";
import { jsonError, serverError } from "@/helper/apiResponse";
import { clearAuthCookie } from "@/helper/authCookie";

// Builds a 401 response and removes the invalid cookie,
// so the user is not stuck between /login and /profile
const unauthorized = (message: string) => {
    const response = jsonError(message, 401);
    clearAuthCookie(response);

    return response;
};

export async function GET(request: NextRequest) {
    try {
        // Get user ID from JWT token
        const userId = getDataFromToken(request);

        await connect();

        // Send only the fields the profile page needs (no password or tokens)
        const user = await User.findById(userId).select(
            "username email isVerified isAdmin createdAt updatedAt"
        );

        if (!user) {
            return unauthorized("User not found. Please login again.");
        }

        return NextResponse.json({
            message: "User found",
            success: true,
            data: user,
        });
    } catch (error: unknown) {
        if (error instanceof AuthError) {
            return unauthorized(error.message);
        }

        return serverError("Get User Error", error);
    }
}
