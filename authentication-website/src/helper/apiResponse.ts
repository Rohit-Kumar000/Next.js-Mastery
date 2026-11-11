import { NextRequest, NextResponse } from "next/server";

export const jsonError = (message: string, status: number) =>
    NextResponse.json({ error: message }, { status });

// Logs the real error on the server and sends a safe message to the client
export const serverError = (label: string, error: unknown) => {
    console.error(`${label}:`, error);

    return jsonError("Something went wrong. Please try again later.", 500);
};

// Reads a JSON body safely. Invalid or non-object bodies become {}
export async function readJsonBody(
    request: NextRequest
): Promise<Record<string, unknown>> {
    try {
        const body: unknown = await request.json();

        if (typeof body === "object" && body !== null && !Array.isArray(body)) {
            return body as Record<string, unknown>;
        }

        return {};
    } catch {
        return {};
    }
}

// MongoDB duplicate key error (unique index violation)
export const isDuplicateKeyError = (error: unknown): boolean =>
    typeof error === "object" &&
    error !== null &&
    (error as { code?: number }).code === 11000;
