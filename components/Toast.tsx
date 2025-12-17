"use client";

import { useEffect } from "react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles = {
    success: "bg-green-50 border-green-500 text-green-800",
    error: "bg-red-50 border-red-500 text-red-800",
    info: "bg-blue-50 border-blue-500 text-blue-800",
  };

  const icons = {
    success: "✓",
    error: "✕",
    info: "ℹ",
  };

  return (
    <div
      role="alert"
      aria-live={type === "error" ? "assertive" : "polite"}
      aria-atomic="true"
      className={`px-6 py-4 rounded-lg shadow-lg border-2 font-semibold min-w-[280px] max-w-[90vw] animate-slide-down flex items-center gap-3 ${
        typeStyles[type]
      }`}
    >
      <span className="text-xl flex-shrink-0" aria-hidden="true">{icons[type]}</span>
      <span className="flex-1 text-sm sm:text-base">{message}</span>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-lg opacity-70 hover:opacity-100 transition-opacity min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
        aria-label="Fechar notificação"
      >
        ×
      </button>
    </div>
  );
}

