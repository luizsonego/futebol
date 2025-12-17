"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

export type ButtonVariant = "primary" | "secondary" | "danger" | "success" | "custom";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  customColor?: string;
}

/**
 * Componente de botão mobile-first reutilizável
 * 
 * Características:
 * - Mínimo 48px de altura para área de toque confortável
 * - Estados visuais: hover, active, disabled
 * - Animação leve de feedback ao clique
 * - Suporte a múltiplas variantes e tamanhos
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      customColor,
      className = "",
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    // Classes base para mobile-first
    const baseClasses = [
      "inline-flex",
      "items-center",
      "justify-center",
      "font-semibold",
      "rounded-lg",
      "transition-all",
      "duration-200",
      "touch-manipulation",
      "focus:outline-none",
      "focus:ring-2",
      "focus:ring-offset-2",
      "focus-visible:ring-2",
      "focus-visible:ring-offset-2",
      "disabled:opacity-50",
      "disabled:cursor-not-allowed",
      "disabled:pointer-events-none",
      "active:scale-[0.97]",
      "disabled:active:scale-100",
      "min-w-[44px]",
      "min-h-[44px]",
    ];

    // Classes de tamanho (mobile-first: mínimo 44px conforme WCAG)
    const sizeClasses = {
      sm: "min-h-[44px] px-4 py-2.5 text-sm",
      md: "min-h-[44px] px-6 py-3 text-base",
      lg: "min-h-[48px] px-8 py-4 text-lg",
    };

    // Classes de variante
    const variantClasses = {
      primary: [
        "bg-blue-600",
        "text-white",
        "shadow-md",
        "hover:bg-blue-700",
        "hover:shadow-lg",
        "active:bg-blue-800",
        "focus:ring-blue-500",
      ],
      secondary: [
        "bg-gray-200",
        "text-gray-800",
        "shadow-sm",
        "hover:bg-gray-300",
        "hover:shadow-md",
        "active:bg-gray-400",
        "focus:ring-gray-500",
      ],
      danger: [
        "bg-red-600",
        "text-white",
        "shadow-md",
        "hover:bg-red-700",
        "hover:shadow-lg",
        "active:bg-red-800",
        "focus:ring-red-500",
      ],
      success: [
        "bg-green-600",
        "text-white",
        "shadow-md",
        "hover:bg-green-700",
        "hover:shadow-lg",
        "active:bg-green-800",
        "focus:ring-green-500",
      ],
      custom: [],
    };

    // Classes de largura
    const widthClasses = fullWidth ? "w-full" : "";

    // Montar classes finais
    const classes = [
      ...baseClasses,
      sizeClasses[size],
      ...(variant === "custom" ? [] : variantClasses[variant]),
      widthClasses,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    // Estilo customizado para variante custom
    const customStyle =
      variant === "custom" && customColor
        ? {
            backgroundColor: customColor,
            color: "#FFFFFF",
          }
        : undefined;

    // Adicionar classes de hover/active para variante custom se necessário
    const customClasses = variant === "custom" 
      ? "shadow-md hover:shadow-lg focus:ring-purple-500"
      : "";

    const finalClasses = customClasses 
      ? `${classes} ${customClasses}`.trim()
      : classes;

    return (
      <button
        ref={ref}
        className={finalClasses}
        style={customStyle}
        disabled={disabled}
        aria-disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

