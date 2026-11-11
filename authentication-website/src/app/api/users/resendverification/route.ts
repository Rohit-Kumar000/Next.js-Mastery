import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database/config";
import User from "@/model/userModel";
import { AuthError, getDataFromToken } from "@/helper/getDataFromToken";
import { sendEmail } from "@/helper/mailHelper";
import { getEmailCooldownSeconds } from "@/helper/token";
import { jsonError, serverError } from "@/helper/apiResponse";

export async function POST(request: NextRequest) {
    try {
        const userId = getDataFromToken(request);

        await connect();

        const user = await User.findById(userId);

        if (!user) {
            return jsonError("User not found. Please login again.", 401);
        }

        if (user.isVerified) {
            return jsonError("Your email is already verified", 400);
        }

        // Stop users from sending many emails in a short time
        const waitSeconds = getEmailCooldownSeconds(user.verifyTokenExpiry);

        if (waitSeconds > 0) {
            return jsonError(
                `Please wait ${waitSeconds} seconds before requesting another email.`,
                429
            );
        }

        try {
            await sendEmail({
                email: user.email,
                emailType: "VERIFY",
                userId: user._id.toString(),
            });
        } catch (error) {
            console.error("Resend verification email error:", error);

            return jsonError(
                "We could not send the verification email. Please try again later.",
                502
            );
        }

        return NextResponse.json({
            success: true,
            message: "Verification email sent. Please check your inbox.",
        });
    } catch (error: unknown) {
        if (error instanceof AuthError) {
            return jsonError(error.message, 401);
        }

        return serverError("Resend Verification Error", error);
    }
}
