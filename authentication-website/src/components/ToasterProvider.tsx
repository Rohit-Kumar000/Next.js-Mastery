"use client";

import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: "9999px",
          background: "#08091E",
          color: "#ffffff",
          fontSize: "14px",
          padding: "12px 20px",
        },
      }}
    />
  );
}
