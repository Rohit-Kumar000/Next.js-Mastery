"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Spinner from "@/components/Spinner";
import { getErrorMessage } from "@/helper/getErrorMessage";

interface UserData {
  _id: string;
  username: string;
  email: string;
  isVerified: boolean;
  isAdmin: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Date formatter
const formatDate = (date?: string) => {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

interface DetailItemProps {
  label: string;
  children: ReactNode;
  className?: string;
}

// One card in the account information grid
function DetailItem({ label, children, className = "" }: DetailItemProps) {
  return (
    <div
      className={`rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm ${className}`}
    >
      <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
        {label}
      </p>

      <div className="mt-2">{children}</div>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch authenticated user details
  useEffect(() => {
    let active = true;

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("/api/users/profile");

        // Expected API response: { data: UserData }
        const userData = response.data?.data as UserData | undefined;

        if (!userData?._id) {
          throw new Error("User details not found.");
        }

        if (active) {
          setUser(userData);
          setError("");
        }
      } catch (err: unknown) {
        if (!active) return;

        // Session is not valid anymore. The API already removed the cookie.
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          router.replace("/login");
          return;
        }

        setError(getErrorMessage(err, "Unable to fetch your profile."));
        setUser(null);
      }

      if (active) {
        setLoading(false);
      }
    };

    fetchUserDetails();

    return () => {
      active = false;
    };
  }, [refreshKey, router]);

  // Refresh profile
  const handleRefresh = () => {
    if (loading || logoutLoading) return;

    setLoading(true);
    setError("");
    setRefreshKey((previous) => previous + 1);
  };

  // Copy user ID
  const handleCopyId = async () => {
    if (!user?._id) return;

    try {
      await navigator.clipboard.writeText(user._id);
      toast.success("User ID copied!");
    } catch {
      toast.error("Unable to copy User ID.");
    }
  };

  // Send a new verification email
  const handleResendVerification = async () => {
    if (resendLoading) return;

    try {
      setResendLoading(true);

      const response = await axios.post("/api/users/resendverification");

      toast.success(response.data?.message || "Verification email sent.");
    } catch (err: unknown) {
      toast.error(
        getErrorMessage(err, "Unable to send the verification email.")
      );
    } finally {
      setResendLoading(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    if (logoutLoading) return;

    try {
      setLogoutLoading(true);

      await axios.post("/api/users/logout");

      toast.success("Logout successful!");

      router.replace("/login");
      router.refresh();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Unable to log out."));
      setLogoutLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-linear-to-br from-indigo-100 via-purple-100 to-blue-200 px-4 py-8 sm:px-6">
      {/* Background */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-purple-400/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-blue-400/30 blur-3xl" />

      <div className="relative z-10 w-full max-w-3xl rounded-[28px] border border-white/60 bg-white/60 p-5 shadow-2xl backdrop-blur-xl sm:p-10">
        {/* Header */}
        <header className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
            Account Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Manage your personal account information.
          </p>
        </header>

        {loading ? (
          /* Loading */
          <div
            className="flex flex-col items-center justify-center py-20"
            role="status"
          >
            <Spinner className="h-12 w-12 border-4 border-purple-200 border-t-indigo-600" />

            <p className="mt-5 text-sm font-medium text-gray-600">
              Loading your profile...
            </p>
          </div>
        ) : error ? (
          /* Error */
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-7 text-center"
          >
            <h2 className="text-xl font-bold text-red-700">
              Unable to Load Profile
            </h2>

            <p className="mt-3 wrap-break-word text-sm text-red-600">{error}</p>

            <button
              type="button"
              onClick={handleRefresh}
              className="mt-6 rounded-full bg-red-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-300"
            >
              Try Again
            </button>
          </div>
        ) : user ? (
          <div className="space-y-6">
            {/* Profile Overview */}
            <section className="rounded-3xl bg-linear-to-br from-indigo-500 to-purple-600 p-6 text-center shadow-lg sm:p-9">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/50 bg-white text-4xl font-extrabold text-indigo-600 shadow-xl">
                {user.username.charAt(0).toUpperCase() || "U"}
              </div>

              <h2 className="mt-5 wrap-break-word text-2xl font-bold text-white">
                {user.username}
              </h2>

              <p className="mt-2 break-all text-sm text-indigo-100">
                {user.email}
              </p>

              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <span className="rounded-full bg-white/20 px-4 py-2 text-xs font-bold text-white">
                  {user.isAdmin ? "Administrator" : "Regular User"}
                </span>

                <span
                  className={`rounded-full px-4 py-2 text-xs font-bold text-white ${
                    user.isVerified ? "bg-green-500/40" : "bg-amber-500/50"
                  }`}
                >
                  {user.isVerified ? "✓ Verified" : "⚠ Unverified"}
                </span>
              </div>
            </section>

            {/* Email verification reminder */}
            {!user.isVerified && (
              <section
                role="alert"
                className="flex flex-col gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="text-sm font-bold text-amber-900">
                    Verify your email address
                  </h3>

                  <p className="mt-1 text-sm text-amber-800">
                    We sent a verification link to your email. Did not get it?
                    Send a new one.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resendLoading}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {resendLoading && <Spinner />}
                  {resendLoading ? "Sending..." : "Resend verification email"}
                </button>
              </section>
            )}

            {/* Account Information */}
            <section>
              <h3 className="mb-4 text-lg font-bold text-gray-900">
                Account Information
              </h3>

              <div className="grid gap-3 sm:grid-cols-2">
                <DetailItem label="User ID" className="sm:col-span-2">
                  <div className="flex items-center justify-between gap-3">
                    <p className="min-w-0 flex-1 break-all font-mono text-sm font-semibold text-gray-800">
                      {user._id}
                    </p>

                    <button
                      type="button"
                      onClick={handleCopyId}
                      className="shrink-0 rounded-xl bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    >
                      Copy ID
                    </button>
                  </div>
                </DetailItem>

                <DetailItem label="Username">
                  <p className="wrap-break-word font-semibold text-gray-900">
                    {user.username}
                  </p>
                </DetailItem>

                <DetailItem label="Email Address">
                  <p className="break-all font-semibold text-gray-900">
                    {user.email}
                  </p>
                </DetailItem>

                <DetailItem label="Account Role">
                  <p className="font-semibold text-gray-900">
                    {user.isAdmin ? "Administrator" : "Regular User"}
                  </p>
                </DetailItem>

                <DetailItem label="Email Verification">
                  <p
                    className={`font-bold ${
                      user.isVerified ? "text-green-700" : "text-amber-700"
                    }`}
                  >
                    {user.isVerified ? "Verified Account" : "Unverified Account"}
                  </p>
                </DetailItem>

                <DetailItem label="Member Since">
                  <p className="font-semibold text-gray-900">
                    {formatDate(user.createdAt)}
                  </p>
                </DetailItem>

                <DetailItem label="Last Updated">
                  <p className="font-semibold text-gray-900">
                    {formatDate(user.updatedAt)}
                  </p>
                </DetailItem>
              </div>
            </section>
          </div>
        ) : null}

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading || logoutLoading}
            className="flex-1 rounded-full border border-gray-300 bg-white px-5 py-3 text-sm font-bold text-gray-800 transition hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ↻ Refresh Profile
          </button>

          <button
            type="button"
            onClick={handleLogout}
            disabled={logoutLoading}
            className="flex-1 rounded-full bg-[#08091E] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#20234C] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {logoutLoading ? "Logging out..." : "Log Out"}
          </button>
        </div>
      </div>
    </main>
  );
}
