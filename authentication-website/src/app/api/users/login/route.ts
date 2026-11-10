
import { connect } from "@/database/config";
import User from "@/model/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
    try {
        await connect();

        const reqBody = await request.json();
        const { email, password } = reqBody;

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        // Check if user exists
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { error: "User does not exist" },
                { status: 400 }
            );
        }

        // Check if email is verified
        if (!user.isVerified) {
            return NextResponse.json(
                { error: "Please verify your email before login" },
                { status: 400 }
            );
        }

        // Check password
        const validPassword = await bcryptjs.compare(
            password,
            user.password
        );

        if (!validPassword) {
            return NextResponse.json(
                { error: "Invalid password" },
                { status: 400 }
            );
        }

        // Create token data
        const tokenData = {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
        };

        // Generate JWT
        const token = jwt.sign(
            tokenData,
            process.env.TOKEN_SECRET!,
            { expiresIn: "1d" }
        );

        // Create response
        const response = NextResponse.json({
            message: "Login successful",
            success: true,
        });

        // Set cookie
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24,
        });

        return response;

    } catch (error: unknown) {
        console.error("Login Error:", error);

        return NextResponse.json(
            {
                error: error instanceof Error
                    ? error.message
                    : "Something went wrong",
            },
            { status: 500 }
        );
    }
}
