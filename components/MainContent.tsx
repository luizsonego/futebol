"use client";

import { useGameContext } from "./GameContext";

export function MainContent({ children }: { children: React.ReactNode }) {
  const { isInGame } = useGameContext();

  return (
    <main 
      className={`flex-1 container mx-auto px-4 py-4 sm:py-6 md:py-8 ${
        isInGame ? "pb-4 md:pb-6" : "pb-20 md:pb-6"
      }`} 
      role="main"
    >
      {children}
    </main>
  );
}

