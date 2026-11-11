export const MIN_USERNAME_LENGTH = 2;
export const MAX_USERNAME_LENGTH = 60;
export const MIN_PASSWORD_LENGTH = 8;

// bcrypt only reads the first 72 bytes of a password
const MAX_PASSWORD_BYTES = 72;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const normalizeEmail = (email: string): string =>
    email.trim().toLowerCase();

export const isValidEmail = (email: string): boolean =>
    EMAIL_REGEX.test(email);

// Returns an error message, or null when the password is acceptable
export const getPasswordError = (password: string): string | null => {
    if (password.length < MIN_PASSWORD_LENGTH) {
        return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`;
    }

    if (new TextEncoder().encode(password).length > MAX_PASSWORD_BYTES) {
        return "Password is too long. Please use a shorter password.";
    }

    return null;
};
