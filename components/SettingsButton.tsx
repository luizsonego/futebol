"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGameContext } from "./GameContext";

export function SettingsButton() {
  const pathname = usePathname();
  const { isInGame } = useGameContext();
  const isSettingsPage = pathname === "/settings";

  // Não mostrar durante o jogo
  if (isInGame) {
    return null;
  }

  return (
    <Link
      href="/settings"
      className={`
        fixed top-2 right-2 z-50
        w-10 h-10 rounded-full
        flex items-center justify-center
        transition-all duration-200
        touch-manipulation
        focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600
        active:scale-95
        ${isSettingsPage
          ? "bg-blue-700 text-white shadow-lg"
          : "bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
        }
      `}
      aria-label="Configurações"
      title="Configurações"
    >
      <span className="text-lg" aria-hidden="true">⚙️</span>
    </Link>
  );
}

