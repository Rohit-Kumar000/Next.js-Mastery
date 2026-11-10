import { connect } from "@/database/config";
import User from "@/model/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helper/mailHelper";

export async function POST(request: NextRequest) {
    try {
        await connect();

        const reqBody = await request.json();
        const { username, email, password } = reqBody;

        // Validate input
        if (!username || !email || !password) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const user = await User.findOne({ email });

        if (user) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }

        // Hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();

        // Send verification email
        await sendEmail({
            email,
            emailType: "VERIFY",
            userId: savedUser._id.toString(),
        });

        return NextResponse.json(
            {
                message: "User created successfully. Please verify your email.",
                success: true,
            },
            { status: 201 }
        );

    } catch (error: unknown) {
        console.error("Signup Error:", error);

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