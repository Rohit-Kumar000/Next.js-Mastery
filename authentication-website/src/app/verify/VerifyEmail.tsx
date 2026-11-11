"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import AuthShell from "@/components/AuthShell";
import { primaryButtonClass } from "@/components/styles";
import { getErrorMessage } from "@/helper/getErrorMessage";

type VerificationStatus = "loading" | "success" | "error";

interface VerifyEmailProps {
  token?: string;
}

export default function VerifyEmail({ token }: VerifyEmailProps) {
  const cleanToken = token?.trim();

  // A missing token is an error right away, no request is needed
  const [status, setStatus] = useState<VerificationStatus>(
    cleanToken ? "loading" : "error"
  );
  const [message, setMessage] = useState(
    cleanToken
      ? "Please wait while we verify your email address."
      : "Verification link is missing or invalid."
  );

  // A token can be used only once, so make sure the request is sent only once
  const requestStarted = useRef(false);

  useEffect(() => {
    if (!cleanToken || requestStarted.current) return;

    requestStarted.current = true;

    axios
      .post("/api/users/verify", { token: cleanToken })
      .then((response) => {
        setStatus("success");
        setMessage(
          response.data?.message || "Your email has been verified successfully."
        );
        toast.success("Email verified successfully!");
      })
      .catch((error: unknown) => {
        const errorMessage = getErrorMessage(
          error,
          "Email verification failed. Your link may have expired."
        );

        setStatus("error");
        setMessage(errorMessage);
        toast.error(errorMessage);
      });
  }, [cleanToken]);

  return (
    <AuthShell>
      <div className="text-center" aria-live="polite">
        {/* Status icon */}
        <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full bg-white/70 shadow-lg">
          {status === "loading" && (
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-700" />
          )}

          {status === "success" && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-10 w-10 text-green-600"
              aria-hidden="true"
            >
              <path d="m5 12 4 4L19 6" />
            </svg>
          )}

          {status === "error" && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-10 w-10 text-red-600"
              aria-hidden="true"
            >
              <path d="M12 9v4m0 4h.01M10.3 3.9 2.5 17.4A2 2 0 0 0 4.2 20h15.6a2 2 0 0 0 1.7-2.6L13.7 3.9a2 2 0 0 0-3.4 0Z" />
            </svg>
          )}
        </div>

        <h1 className="text-3xl font-extrabold text-[#10132F] sm:text-4xl">
          {status === "loading" && "Verifying Email"}
          {status === "success" && "Email Verified!"}
          {status === "error" && "Verification Failed"}
        </h1>

        <p className="mt-5 text-sm leading-7 text-[#343A69]/80">{message}</p>

        {status === "loading" && (
          <p className="mt-6 text-xs font-medium text-indigo-800">
            Please do not close this page.
          </p>
        )}

        {status === "success" && (
          <Link
            href="/login"
            className={`${primaryButtonClass} mt-8 no-underline`}
          >
            Continue to Login
          </Link>
        )}

        {status === "error" && (
          <div className="mt-8 space-y-4">
            <div className="rounded-2xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-700">
              Log in and use &ldquo;Resend verification email&rdquo; on your
              profile to get a new link.
            </div>

            <Link href="/login" className={`${primaryButtonClass} no-underline`}>
              Go to Login
            </Link>
          </div>
        )}
      </div>
    </AuthShell>
  );
}
