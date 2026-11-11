import axios from "axios";

// Reads the error message sent by our API, or falls back to a default
export function getErrorMessage(error: unknown, fallback: string): string {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data as
            | { error?: string; message?: string }
            | undefined;

        return data?.error || data?.message || fallback;
    }

    return fallback;
}
