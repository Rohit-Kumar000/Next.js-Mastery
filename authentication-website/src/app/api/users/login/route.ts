import { connect } from "@/database/config";
import User from "@/model/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { jsonError, readJsonBody, serverError } from "@/helper/apiResponse";
import { normalizeEmail } from "@/helper/validation";
import { AUTH_TOKEN_TTL_SECONDS, setAuthCookie } from "@/helper/authCookie";

export async function POST(request: NextRequest) {
    try {
        const body = await readJsonBody(request);

        // Only accept strings so objects can never reach the database query
        const email = typeof body.email === "string" ? normalizeEmail(body.email) : "";
        const password = typeof body.password === "string" ? body.password : "";

        // Validate input
        if (!email || !password) {
            return jsonError("Email and password are required", 400);
        }

        // Check JWT secret
        const tokenSecret = process.env.TOKEN_SECRET;

        if (!tokenSecret) {
            throw new Error("TOKEN_SECRET is not configured");
        }

        await connect();

        const user = await User.findOne({ email });

        // Same message for a wrong email and a wrong password,
        // so nobody can find out which emails are registered
        const validPassword = user
            ? await bcryptjs.compare(password, user.password)
            : false;

        if (!user || !validPassword) {
            return jsonError("Invalid email or password", 401);
        }

        // Generate JWT
        const token = jwt.sign(
            {
                id: user._id.toString(),
                username: user.username,
                email: user.email,
            },
            tokenSecret,
            { expiresIn: AUTH_TOKEN_TTL_SECONDS }
        );

        const response = NextResponse.json({
            message: "Login successful",
            success: true,
            isVerified: user.isVerified,
        });

        setAuthCookie(response, token);

        return response;
    } catch (error: unknown) {
        return serverError("Login Error", error);
    }
}
