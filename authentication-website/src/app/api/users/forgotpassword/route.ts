import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database/config";
import User from "@/model/userModel";
import { sendEmail } from "@/helper/mailHelper";
import { getEmailCooldownSeconds } from "@/helper/token";
import { jsonError, readJsonBody, serverError } from "@/helper/apiResponse";
import { isValidEmail, normalizeEmail } from "@/helper/validation";

// The same message is returned whether the email exists or not,
// so nobody can find out which emails are registered
const GENERIC_MESSAGE =
    "If an account exists for this email, a password reset link has been sent.";

export async function POST(request: NextRequest) {
    try {
        const body = await readJsonBody(request);
        const email = typeof body.email === "string" ? normalizeEmail(body.email) : "";

        if (!email || !isValidEmail(email)) {
            return jsonError("Please enter a valid email address", 400);
        }

        await connect();

        const user = await User.findOne({ email });

        // Unknown email, or a reset email was sent a moment ago
        if (!user || getEmailCooldownSeconds(user.forgotPasswordTokenExpiry) > 0) {
            return NextResponse.json({ success: true, message: GENERIC_MESSAGE });
        }

        try {
            await sendEmail({
                email: user.email,
                emailType: "RESET",
                userId: user._id.toString(),
            });
        } catch (error) {
            console.error("Reset email error:", error);

            return jsonError(
                "We could not send the reset email. Please try again later.",
                502
            );
        }

        return NextResponse.json({ success: true, message: GENERIC_MESSAGE });
    } catch (error: unknown) {
        return serverError("Forgot Password Error", error);
    }
}
