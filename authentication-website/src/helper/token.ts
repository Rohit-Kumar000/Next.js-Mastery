import { createHash } from "crypto";

// Email links (verify / reset) stay valid for one hour
export const TOKEN_EXPIRY_MS = 60 * 60 * 1000;

// Minimum wait between two emails sent to the same user
const EMAIL_COOLDOWN_MS = 60 * 1000;

// Only the hash of a token is stored in the database
export const hashToken = (token: string): string =>
    createHash("sha256").update(token).digest("hex");

// Returns how many seconds are left before another email may be sent.
// The send time is derived from the stored expiry date.
export const getEmailCooldownSeconds = (
    tokenExpiry?: Date | null
): number => {
    if (!tokenExpiry) return 0;

    const sentAt = tokenExpiry.getTime() - TOKEN_EXPIRY_MS;
    const remainingMs = sentAt + EMAIL_COOLDOWN_MS - Date.now();

    return remainingMs > 0 ? Math.ceil(remainingMs / 1000) : 0;
};
