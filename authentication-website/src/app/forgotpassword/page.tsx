"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import AuthShell from "@/components/AuthShell";
import Spinner from "@/components/Spinner";
import {
  inputClass,
  labelClass,
  linkClass,
  primaryButtonClass,
} from "@/components/styles";
import { getErrorMessage } from "@/helper/getErrorMessage";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading || !email.trim()) return;

    try {
      setLoading(true);

      const response = await axios.post("/api/users/forgotpassword", {
        email: email.trim().toLowerCase(),
      });

      setMessage(
        response.data?.message ||
          "If an account exists for this email, a password reset link has been sent."
      );
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Unable to send the reset link."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <div className="mb-8 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-indigo-950/60">
          Account Recovery
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-[#10132F] sm:text-4xl">
          Forgot Password
        </h1>

        <p className="mt-3 text-sm text-[#343A69]/75">
          Enter your email and we will send you a link to reset your password.
        </p>
      </div>

      {message ? (
        <div className="space-y-6 text-center">
          <div
            role="status"
            className="rounded-2xl border border-green-200 bg-green-50/80 p-5 text-sm leading-6 text-green-800"
          >
            {message}
            <p className="mt-2 text-xs text-green-800/80">
              The link is valid for 1 hour. Check your spam folder if you do not
              see it.
            </p>
          </div>

          <Link href="/login" className={`${primaryButtonClass} no-underline`}>
            Back to Login
          </Link>
        </div>
      ) : (
        <>
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label htmlFor="forgot-email" className={labelClass}>
                Email Address
              </label>

              <input
                id="forgot-email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={!email.trim() || loading}
              className={primaryButtonClass}
            >
              {loading ? (
                <>
                  <Spinner />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#171A3B]">
            Remembered your password?{" "}
            <Link href="/login" className={linkClass}>
              Log In
            </Link>
          </p>
        </>
      )}
    </AuthShell>
  );
}
