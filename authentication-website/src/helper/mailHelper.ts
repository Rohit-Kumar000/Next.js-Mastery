import nodemailer from "nodemailer";
import User from "@/model/userModel";
import crypto, { createHash } from "crypto";

type EmailType = "VERIFY" | "RESET";

interface SendEmailProps {
    email: string;
    emailType: EmailType;
    userId: string;
}

export const sendEmail = async ({
    email,
    emailType,
    userId,
}: SendEmailProps) => {
    try {
        // Generate random token
        const token = crypto.randomBytes(32).toString("hex");

        // Hash token before saving in database
        const hashedToken = createHash("sha256")
            .update(token)
            .digest("hex");

        const expiry = new Date(Date.now() + 3600000);

        // Save token in database
        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, {
                verifyToken: hashedToken,
                verifyTokenExpiry: expiry,
            });
        } else {
            await User.findByIdAndUpdate(userId, {
                forgotPasswordToken: hashedToken,
                forgotPasswordTokenExpiry: expiry,
            });
        }

        // Create Mailtrap transporter
        const transport = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // Email URL
        const isVerify = emailType === "VERIFY";

        const actionUrl = isVerify
            ? `${process.env.DOMAIN}/verifyemail?token=${token}`
            : `${process.env.DOMAIN}/resetpassword?token=${token}`;

        // Mail options
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: isVerify
                ? "Verify your email"
                : "Reset your password",
            html: `
                <p>
                    Click <a href="${actionUrl}">here</a>
                    to ${isVerify ? "verify your email" : "reset your password"}.
                </p>
                <p>Or copy this link:</p>
                <a href="${actionUrl}">${actionUrl}</a>
                <p>This link expires in 1 hour.</p>
            `,
        };

        // Send email
        const mailResponse = await transport.sendMail(mailOptions);

        return mailResponse;

    } catch (error) {
        console.error("Email Error:", error);

        throw new Error(
            error instanceof Error ? error.message : "Failed to send email"
        );
    }
};