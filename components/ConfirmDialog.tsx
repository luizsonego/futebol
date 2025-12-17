"use client";

import { useEffect } from "react";
import { Button } from "./Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  variant?: "danger" | "warning" | "neutral";
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  isLoading = false,
  variant = "neutral",
}: ConfirmDialogProps) {
  // Fechar ao pressionar ESC
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, isLoading, onClose]);

  // Prevenir scroll do body quando o dialog está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: "⚠️",
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
      borderColor: "border-red-200",
      titleColor: "text-red-900",
    },
    warning: {
      icon: "⚠️",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      borderColor: "border-amber-200",
      titleColor: "text-amber-900",
    },
    neutral: {
      icon: "ℹ️",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200",
      titleColor: "text-gray-900",
    },
  };

  const styles = variantStyles[variant];

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-50 animate-slide-up"
        onClick={!isLoading ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        className={`
          fixed inset-0 z-50 flex items-center justify-center p-4
          pointer-events-none
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
      >
        <div
          className={`
            bg-white rounded-lg shadow-2xl
            max-w-md w-full
            border-2 ${styles.borderColor}
            animate-bounce-in
            pointer-events-auto
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`${styles.iconBg} px-6 py-4 border-b ${styles.borderColor}`}>
            <div className="flex items-start gap-4">
              <div
                className={`
                  w-12 h-12 rounded-full ${styles.iconBg}
                  flex items-center justify-center
                  flex-shrink-0
                `}
                aria-hidden="true"
              >
                <span className="text-2xl">{styles.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  id="confirm-dialog-title"
                  className={`text-lg font-bold ${styles.titleColor} mb-1`}
                >
                  {title}
                </h3>
                <p
                  id="confirm-dialog-message"
                  className="text-sm text-gray-700 leading-relaxed"
                >
                  {message}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 flex flex-col sm:flex-row gap-3 sm:gap-3 sm:justify-end">
            <Button
              onClick={onClose}
              disabled={isLoading}
              variant="secondary"
              size="md"
              fullWidth
              className="sm:flex-none sm:min-w-[120px]"
            >
              {cancelLabel}
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              variant={variant === "danger" ? "danger" : variant === "warning" ? "primary" : "primary"}
              size="md"
              fullWidth
              className="sm:flex-none sm:min-w-[120px]"
            >
              {isLoading ? "Processando..." : confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

