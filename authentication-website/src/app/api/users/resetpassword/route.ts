import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { connect } from "@/database/config";
import User from "@/model/userModel";
import { jsonError, readJsonBody, serverError } from "@/helper/apiResponse";
import { hashToken } from "@/helper/token";
import { getPasswordError } from "@/helper/validation";

export async function POST(request: NextRequest) {
    try {
        const body = await readJsonBody(request);
        const token = typeof body.token === "string" ? body.token.trim() : "";
        const password = typeof body.password === "string" ? body.password : "";

        if (!token || !password) {
            return jsonError("Token and new password are required", 400);
        }

        const passwordError = getPasswordError(password);

        if (passwordError) {
            return jsonError(passwordError, 400);
        }

        await connect();

        // Find user using the hashed token that has not expired
        const user = await User.findOne({
            forgotPasswordToken: hashToken(token),
            forgotPasswordTokenExpiry: { $gt: new Date() },
        });

        if (!user) {
            return jsonError("Invalid or expired reset link", 400);
        }

        // Save the new password and make the link unusable
        user.password = await bcryptjs.hash(password, 10);
        user.forgotPasswordToken = undefined;
        user.forgotPasswordTokenExpiry = undefined;

        await user.save();

        return NextResponse.json({
            message: "Password reset successfully. You can now log in.",
            success: true,
        });
    } catch (error: unknown) {
        return serverError("Reset Password Error", error);
    }
}
