import { connect } from "@/database/config";
import { NextRequest, NextResponse } from "next/server";
import User from "@/model/userModel";
import { jsonError, readJsonBody, serverError } from "@/helper/apiResponse";
import { hashToken } from "@/helper/token";

export async function POST(request: NextRequest) {
    try {
        const body = await readJsonBody(request);
        const token = typeof body.token === "string" ? body.token.trim() : "";

        if (!token) {
            return jsonError("Token is required", 400);
        }

        await connect();

        // Find user using the hashed token that has not expired
        const user = await User.findOne({
            verifyToken: hashToken(token),
            verifyTokenExpiry: { $gt: new Date() },
        });

        if (!user) {
            return jsonError("Invalid or expired verification link", 400);
        }

        // Verify user
        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;

        await user.save();

        return NextResponse.json({
            message: "Email verified successfully",
            success: true,
        });
    } catch (error: unknown) {
        return serverError("Verification Error", error);
    }
}
