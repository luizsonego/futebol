"use client";

import { useGameContext } from "./GameContext";
import Link from "next/link";
import { Button } from "./Button";

interface GameBlockedProps {
  children: React.ReactNode;
}

export function GameBlocked({ children }: GameBlockedProps) {
  const { isInGame } = useGameContext();

  if (isInGame) {
    return (
      <div className="page-container">
        <div className="card text-center py-12">
          <div className="text-6xl mb-4" aria-hidden="true">⚽</div>
          <h1 className="page-title">Partida em Andamento</h1>
          <p className="body-text text-base sm:text-lg mb-6 max-w-md mx-auto">
            As configurações administrativas não estão disponíveis durante uma partida em andamento.
            Encerre a partida para acessar as configurações.
          </p>
          <Link href="/matches">
            <Button variant="primary" size="lg">
              Voltar para Partidas
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

