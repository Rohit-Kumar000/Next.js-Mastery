import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "@/model/userModel";
import { TOKEN_EXPIRY_MS, hashToken } from "@/helper/token";

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
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM, DOMAIN } =
        process.env;

    // Check the configuration first so no token is saved when email cannot be sent
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !EMAIL_FROM || !DOMAIN) {
        throw new Error("Email service is not configured");
    }

    const isVerify = emailType === "VERIFY";

    // Random token for the link, only its hash is saved in the database
    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = hashToken(token);
    const expiry = new Date(Date.now() + TOKEN_EXPIRY_MS);

    await User.findByIdAndUpdate(
        userId,
        isVerify
            ? { verifyToken: hashedToken, verifyTokenExpiry: expiry }
            : { forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: expiry }
    );

    const actionUrl = `${DOMAIN.replace(/\/$/, "")}/${
        isVerify ? "verify" : "resetpassword"
    }?token=${token}`;

    const actionText = isVerify ? "verify your email" : "reset your password";
    const buttonText = isVerify ? "Verify Email" : "Reset Password";

    const transport = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    try {
        return await transport.sendMail({
            from: EMAIL_FROM,
            to: email,
            subject: isVerify ? "Verify your email" : "Reset your password",
            text: `Open this link to ${actionText}: ${actionUrl}\n\nThis link expires in 1 hour.`,
            html: `
                <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px;color:#10132F">
                    <h2 style="margin:0 0 16px">${buttonText}</h2>
                    <p>Click the button below to ${actionText}.</p>
                    <p style="margin:24px 0">
                        <a href="${actionUrl}" style="background:#08091E;color:#ffffff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:600">
                            ${buttonText}
                        </a>
                    </p>
                    <p style="font-size:13px;color:#555">Or copy this link into your browser:</p>
                    <p style="font-size:13px;word-break:break-all"><a href="${actionUrl}">${actionUrl}</a></p>
                    <p style="font-size:13px;color:#555">This link expires in 1 hour. If you did not request this, you can ignore this email.</p>
                </div>
            `,
        });
    } catch (error) {
        // Remove the unused token so the user can request a new email right away
        await User.findByIdAndUpdate(
            userId,
            isVerify
                ? { $unset: { verifyToken: 1, verifyTokenExpiry: 1 } }
                : { $unset: { forgotPasswordToken: 1, forgotPasswordTokenExpiry: 1 } }
        );

        throw error;
    }
};
