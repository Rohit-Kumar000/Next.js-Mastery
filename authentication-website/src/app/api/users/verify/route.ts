import { connect } from "@/database/config";
import { NextRequest, NextResponse } from "next/server";
import User from "@/model/userModel";
import { createHash } from "crypto";

export async function POST(request: NextRequest) {
    try {
        await connect();

        const reqBody = await request.json();
        const { token } = reqBody;

        if (!token) {
            return NextResponse.json(
                { error: "Token is required" },
                { status: 400 }
            );
        }

        // Hash the received token
        const hashedToken = createHash("sha256")
            .update(token)
            .digest("hex");

        // Find user using hashed token
        const user = await User.findOne({
            verifyToken: hashedToken,
            verifyTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid or expired token" },
                { status: 400 }
            );
        }

        // Verify user
        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;

        await user.save();

        return NextResponse.json({
            message: "Email verified successfully",
            success: true
        });

    } catch (error: unknown) {
        console.error("Verification Error:", error);

        return NextResponse.json(
            {
                error: error instanceof Error
                    ? error.message
                    : "Something went wrong"
            },
            { status: 500 }
        );
    }
}