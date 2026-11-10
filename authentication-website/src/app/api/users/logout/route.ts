import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = NextResponse.json({
            message: "Logout successful",
            success: true,
        });

        response.cookies.set("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            expires: new Date(0),
        });

        return response;

    } catch (error: unknown) {
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