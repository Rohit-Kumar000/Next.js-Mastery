"use client";

import { useState } from "react";
import { inputClass, labelClass } from "@/components/styles";

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoComplete: "current-password" | "new-password";
  // Small help text shown under the field
  hint?: string;
}

// Password input with a Show / Hide button
export default function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  hint,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} pr-20`}
        />

        <button
          type="button"
          onClick={() => setVisible((previous) => !previous)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full px-2 py-1 text-xs font-semibold text-indigo-700 transition hover:text-indigo-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>

      {hint && <p className="mt-2 px-4 text-xs text-[#343A69]/75">{hint}</p>}
    </div>
  );
}

interface PasswordMatchHintProps {
  password: string;
  confirmPassword: string;
}

// Shows live feedback while the user types the confirmation password
export function PasswordMatchHint({
  password,
  confirmPassword,
}: PasswordMatchHintProps) {
  if (!confirmPassword) return null;

  const matches = password === confirmPassword;

  return (
    <p
      role="status"
      className={`px-4 text-xs font-semibold ${
        matches ? "text-green-800" : "text-red-700"
      }`}
    >
      {matches ? "✓ Passwords match" : "✕ Passwords do not match"}
    </p>
  );
}
