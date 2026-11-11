import { connect } from "@/database/config";
import User from "@/model/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helper/mailHelper";
import {
    isDuplicateKeyError,
    jsonError,
    readJsonBody,
    serverError,
} from "@/helper/apiResponse";
import {
    MAX_USERNAME_LENGTH,
    MIN_USERNAME_LENGTH,
    getPasswordError,
    isValidEmail,
    normalizeEmail,
} from "@/helper/validation";

export async function POST(request: NextRequest) {
    try {
        const body = await readJsonBody(request);

        // Only accept strings so objects like { $ne: "" } can never reach the database
        const username = typeof body.username === "string" ? body.username.trim() : "";
        const email = typeof body.email === "string" ? normalizeEmail(body.email) : "";
        const password = typeof body.password === "string" ? body.password : "";

        // Validate input
        if (!username || !email || !password) {
            return jsonError("All fields are required", 400);
        }

        if (
            username.length < MIN_USERNAME_LENGTH ||
            username.length > MAX_USERNAME_LENGTH
        ) {
            return jsonError(
                `Username must be between ${MIN_USERNAME_LENGTH} and ${MAX_USERNAME_LENGTH} characters`,
                400
            );
        }

        if (!isValidEmail(email)) {
            return jsonError("Please enter a valid email address", 400);
        }

        const passwordError = getPasswordError(password);

        if (passwordError) {
            return jsonError(passwordError, 400);
        }

        await connect();

        // Check if the email or username is already used
        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        }).select("email");

        if (existingUser) {
            return jsonError(
                existingUser.email === email
                    ? "An account with this email already exists"
                    : "This username is already taken",
                409
            );
        }

        // Hash password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Create new user
        const savedUser = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        // The account exists even if the email fails. The user can resend it from the profile.
        let emailSent = true;

        try {
            await sendEmail({
                email,
                emailType: "VERIFY",
                userId: savedUser._id.toString(),
            });
        } catch (error) {
            emailSent = false;
            console.error("Verification email error:", error);
        }

        return NextResponse.json(
            {
                success: true,
                emailSent,
                message: emailSent
                    ? "Account created! Please check your email to verify your account."
                    : "Account created, but we could not send the verification email. Log in and resend it from your profile.",
            },
            { status: 201 }
        );
    } catch (error: unknown) {
        // Two requests created the same user at the same time
        if (isDuplicateKeyError(error)) {
            return jsonError("An account with these details already exists", 409);
        }

        return serverError("Signup Error", error);
    }
}
