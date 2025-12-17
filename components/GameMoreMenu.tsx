"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface GameMoreMenuProps {
  matchId: string;
  onClose?: () => void;
}

export function GameMoreMenu({ matchId, onClose }: GameMoreMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Fechar menu ao pressionar ESC
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const menuItems = [
    {
      label: "Ver Tabela",
      icon: "🏆",
      href: "/standings",
      onClick: () => {
        setIsOpen(false);
        onClose?.();
      },
    },
    {
      label: "Ver Resultados",
      icon: "📊",
      href: "/resultados",
      onClick: () => {
        setIsOpen(false);
        onClose?.();
      },
    },
    {
      label: "Ver Todas as Partidas",
      icon: "⚽",
      href: "/matches",
      onClick: () => {
        setIsOpen(false);
        onClose?.();
      },
    },
    {
      label: "Dias de Jogos",
      icon: "📅",
      href: "/game-days",
      onClick: () => {
        setIsOpen(false);
        onClose?.();
      },
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      {/* Botão "Mais opções" - Menor e menos intrusivo durante jogo */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Mais opções"
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`
          fixed right-3 z-50
          w-12 h-12 rounded-full
          text-white
          shadow-md
          transition-all duration-200 ease-in-out
          flex items-center justify-center
          touch-manipulation
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${isOpen 
            ? "bg-blue-700 shadow-lg scale-95" 
            : "bg-blue-600/90 hover:bg-blue-700 hover:shadow-lg active:scale-[0.95] backdrop-blur-sm"
          }
        `}
        style={{ 
          bottom: 'calc(1rem + env(safe-area-inset-bottom))'
        }}
      >
        <svg
          className={`w-5 h-5 transition-transform duration-200 ease-in-out ${isOpen ? "rotate-45" : "rotate-0"}`}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Menu flutuante */}
      {isOpen && (
        <>
          {/* Overlay escuro */}
          <div
            className="fixed inset-0 bg-black/20 z-40 opacity-0 animate-fade-in"
            onClick={() => {
              setIsOpen(false);
              onClose?.();
            }}
            aria-hidden="true"
          />

          {/* Menu */}
          <div
            className={`
              fixed right-4 z-50
              bg-white rounded-lg shadow-2xl
              min-w-[200px] max-w-[280px]
              border border-gray-200
              overflow-hidden
              animate-slide-up
            `}
            role="menu"
            aria-label="Menu de opções"
            style={{ 
              bottom: 'calc(4.5rem + env(safe-area-inset-bottom))'
            }}
          >
            <div className="py-2">
              {menuItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={item.onClick}
                  role="menuitem"
                  className={`
                    relative flex items-center gap-3 px-4 py-3
                    transition-all duration-200 ease-in-out
                    touch-manipulation
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset
                    animate-fade-in-up
                    ${index === 0 ? "border-b border-gray-100" : ""}
                    text-gray-700 
                    hover:bg-blue-50 hover:text-blue-700
                    active:bg-blue-100 active:scale-[0.98]
                  `}
                  style={{
                    animationDelay: `${index * 40}ms`
                  }}
                >
                  <span 
                    className="text-xl transition-transform duration-200 active:scale-110" 
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

