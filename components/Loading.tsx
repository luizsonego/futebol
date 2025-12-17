"use client";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  text?: string;
}

export function Loading({ size = "md", fullScreen = false, text }: LoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-4",
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3" role="status" aria-live="polite">
      <div
        className={`${sizeClasses[size]} border-gray-300 border-t-blue-600 rounded-full animate-spin`}
        aria-hidden="true"
      />
      {text && <p className="text-sm text-gray-700 font-medium">{text}</p>}
      {!text && <span className="sr-only">Carregando...</span>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-busy="true">
        {spinner}
      </div>
    );
  }

  return spinner;
}

