import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/helper/authCookie";

export async function POST() {
    const response = NextResponse.json({
        message: "Logout successful",
        success: true,
    });

    clearAuthCookie(response);

    return response;
}
