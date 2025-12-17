"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGameContext } from "./GameContext";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  matchPattern?: (pathname: string, href: string) => boolean;
}

export function MobileFooter() {
  const pathname = usePathname();
  const { isInGame } = useGameContext();

  const navItems: NavItem[] = [
    { 
      href: "/", 
      label: "Início", 
      icon: "🏠",
      matchPattern: (pathname, href) => pathname === href || pathname.startsWith(href + "/")
    },
    // { 
    //   href: "/matches", 
    //   label: "Jogo", 
    //   icon: "⚽",
    //   matchPattern: (pathname, href) => pathname === href || pathname.startsWith(href + "/")
    // },
    { 
      href: "/resultados", 
      label: "Resultados", 
      icon: "📊",
      matchPattern: (pathname, href) => pathname === href || pathname.startsWith(href + "/")
    },
    { 
      href: "/game-days", 
      label: "Dia", 
      icon: "📅",
      matchPattern: (pathname, href) => pathname === href || pathname.startsWith(href + "/")
    },
    { 
      href: "/teams", 
      label: "Times", 
      icon: "👥",
      matchPattern: (pathname, href) => pathname === href || pathname.startsWith(href + "/")
    },
  ];

  // Ocultar footer durante o jogo
  if (isInGame) {
    return null;
  }

  return (
    <footer 
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-2px_8px_rgba(0,0,0,0.1)] z-40 md:hidden" 
      role="contentinfo"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <nav 
        className="flex items-stretch justify-around h-16 px-1" 
        role="navigation" 
        aria-label="Navegação principal"
      >
        {navItems.map((item) => {
          const isActive = item.matchPattern 
            ? item.matchPattern(pathname, item.href)
            : pathname === item.href || pathname.startsWith(item.href + "/");
          
          return (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              aria-current={isActive ? "page" : undefined}
              aria-label={item.label}
              className={`
                relative
                flex flex-col items-center justify-center gap-0.5 
                flex-1 min-h-[64px] min-w-0
                transition-all duration-200 ease-in-out
                touch-manipulation
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white
                ${isActive
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-50 active:bg-gray-100 active:scale-[0.96]"
                }
              `}
            >
              {/* Ícone */}
              <span 
                className={`
                  text-2xl leading-none
                  transition-all duration-200 ease-in-out
                  ${isActive 
                    ? "scale-110 text-blue-600" 
                    : "scale-100 active:scale-95"
                  }
                `}
                aria-hidden="true"
              >
                {item.icon}
              </span>
              
              {/* Texto */}
              <span 
                className={`
                  text-[10px] leading-tight
                  transition-all duration-200 ease-in-out
                  ${isActive 
                    ? "font-semibold text-blue-600" 
                    : "font-medium text-gray-600"
                  }
                `}
              >
                {item.label}
              </span>
              
              {/* Indicador de item ativo */}
              {isActive && (
                <span 
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-blue-600 rounded-t-full transition-all duration-200"
                  aria-hidden="true"
                />
              )}
              
              {/* Badge de dia aberto (apenas no item "Dia") */}
              {item.href === "/game-days" && pathname.startsWith("/game-days/") && (
                <span 
                  className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full border border-white animate-pulse"
                  aria-label="Dia de jogos aberto"
                  title="Dia de jogos aberto"
                />
              )}
            </Link>
          );
        })}
      </nav>
    </footer>
  );
}

