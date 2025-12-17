"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { href: "/", label: "Início" },
    { href: "/teams", label: "Times" },
    { href: "/game-days", label: "Dias de Jogos" },
    { href: "/matches", label: "Partidas" },
    { href: "/resultados", label: "Resultados" },
    { href: "/standings", label: "Tabela" },
  ];

  return (
    <nav className="bg-blue-600 text-white shadow-lg sticky top-0 z-50" role="navigation" aria-label="Navegação principal">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-lg sm:text-xl font-bold">⚽ Gerenciamento</h1>
          
          {/* Menu Desktop */}
          <div className="hidden md:flex gap-2" role="menubar">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  role="menuitem"
                  aria-current={isActive ? "page" : undefined}
                  className={`
                    relative px-4 py-2 rounded-md 
                    min-h-[44px] flex items-center
                    transition-all duration-200 ease-in-out
                    focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600
                    touch-manipulation
                    ${isActive
                      ? "bg-blue-700 text-white font-semibold shadow-md"
                      : "text-blue-50 hover:bg-blue-700/60 hover:text-white active:bg-blue-700 active:scale-[0.98]"
                    }
                  `}
                >
                  {link.label}
                  {/* Indicador de item ativo */}
                  {isActive && (
                    <span 
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white rounded-full"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Botão Hambúrguer Mobile */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`
              md:hidden p-2 rounded-md 
              min-w-[44px] min-h-[44px] flex items-center justify-center 
              transition-all duration-200 ease-in-out
              touch-manipulation
              focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600
              ${isMenuOpen 
                ? "bg-blue-700 active:bg-blue-800" 
                : "hover:bg-blue-700 active:bg-blue-800 active:scale-[0.95]"
              }
            `}
            aria-label="Menu de navegação"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <svg
              className={`w-6 h-6 transition-transform duration-200 ease-in-out ${isMenuOpen ? "rotate-90" : ""}`}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div 
            id="mobile-menu" 
            className="md:hidden border-t border-blue-500/30 py-2" 
            role="menu"
          >
            {links.map((link, index) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  role="menuitem"
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setIsMenuOpen(false)}
                  className={`
                    relative block px-4 py-3 rounded-md mx-2
                    min-h-[44px] flex items-center
                    transition-all duration-200 ease-in-out
                    touch-manipulation
                    focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600
                    animate-fade-in-up
                    ${isActive
                      ? "bg-blue-700 text-white font-semibold shadow-sm"
                      : "text-blue-50 hover:bg-blue-700/60 hover:text-white active:bg-blue-700 active:scale-[0.98]"
                    }
                  `}
                  style={{
                    animationDelay: `${index * 30}ms`
                  }}
                >
                  {link.label}
                  {/* Indicador de item ativo */}
                  {isActive && (
                    <span 
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full transition-all duration-200"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}

