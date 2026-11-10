import { getDataFromToken } from "@/helper/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/model/userModel";
import { connect } from "@/database/config";

export async function GET(request: NextRequest) {
    try {
        await connect();

        // Get user ID from JWT token
        const userId = await getDataFromToken(request);

        // Find user without password
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "User found",
            success: true,
            data: user,
        });

    } catch (error: unknown) {
        console.error("Get User Error:", error);

        return NextResponse.json(
            {
                error: error instanceof Error
                    ? error.message
                    : "Something went wrong",
            },
            { status: 401 }
        );
    }
}