"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import AuthShell from "@/components/AuthShell";
import PasswordField, { PasswordMatchHint } from "@/components/PasswordField";
import Spinner from "@/components/Spinner";
import { linkClass, primaryButtonClass } from "@/components/styles";
import { getErrorMessage } from "@/helper/getErrorMessage";
import { MIN_PASSWORD_LENGTH, getPasswordError } from "@/helper/validation";

interface ResetPasswordFormProps {
  token?: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const cleanToken = token?.trim();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading || !cleanToken) return;

    const passwordError = getPasswordError(password);

    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await axios.post("/api/users/resetpassword", {
        token: cleanToken,
        password,
      });

      toast.success("Password reset successfully. Please log in.");

      router.replace("/login");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Unable to reset your password."));
      setLoading(false);
    }
  };

  // The link in the email is missing its token
  if (!cleanToken) {
    return (
      <AuthShell>
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#10132F] sm:text-4xl">
            Invalid Reset Link
          </h1>

          <p className="mt-4 text-sm leading-7 text-[#343A69]/80">
            This password reset link is missing or incorrect. Please request a
            new one.
          </p>

          <Link
            href="/forgotpassword"
            className={`${primaryButtonClass} mt-8 no-underline`}
          >
            Request New Link
          </Link>
        </div>
      </AuthShell>
    );
  }

  const buttonDisabled = !password || !confirmPassword;

  return (
    <AuthShell>
      <div className="mb-8 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-indigo-950/60">
          Account Recovery
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-[#10132F] sm:text-4xl">
          Reset Password
        </h1>

        <p className="mt-3 text-sm text-[#343A69]/75">
          Choose a new password for your account.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <PasswordField
          id="new-password"
          label="New Password"
          value={password}
          onChange={setPassword}
          placeholder="Enter a new password"
          autoComplete="new-password"
          hint={`Use at least ${MIN_PASSWORD_LENGTH} characters.`}
        />

        <PasswordField
          id="confirm-new-password"
          label="Confirm New Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Confirm your new password"
          autoComplete="new-password"
        />

        <PasswordMatchHint
          password={password}
          confirmPassword={confirmPassword}
        />

        <button
          type="submit"
          disabled={buttonDisabled || loading}
          className={primaryButtonClass}
        >
          {loading ? (
            <>
              <Spinner />
              Resetting...
            </>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#171A3B]">
        Link expired?{" "}
        <Link href="/forgotpassword" className={linkClass}>
          Request a new one
        </Link>
      </p>
    </AuthShell>
  );
}
