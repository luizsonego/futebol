"use client";

import { useState } from "react";
import { GameDayForm } from "./GameDayForm";
import { GameDayCard } from "./GameDayCard";

interface GameDay {
  id: string;
  date: Date;
  description: string | null;
  isOpen: boolean;
  matchDurationMinutes: number;
  matches: Array<{ status: string }>;
}

interface GameDaysPageContentProps {
  gameDays: GameDay[];
}

/**
 * Componente cliente para gerenciar o estado de edição de dias de jogos
 */
export function GameDaysPageContent({ gameDays }: GameDaysPageContentProps) {
  const [editingGameDay, setEditingGameDay] = useState<GameDay | null>(null);

  const handleEdit = (gameDay: GameDay) => {
    setEditingGameDay(gameDay);
  };

  const handleCancelEdit = () => {
    setEditingGameDay(null);
  };

  const handleSuccess = () => {
    setEditingGameDay(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      {/* Formulário de Cadastro/Edição */}
      {editingGameDay && (
        <div className="lg:col-span-1">
          <div className="card lg:sticky lg:top-20">
            <h2 className="section-title">Editar Dia de Jogos</h2>
            <GameDayForm
              gameDayToEdit={editingGameDay}
              onCancel={handleCancelEdit}
              onSuccess={handleSuccess}
            />
          </div>
        </div>
      )}

      {/* Listagem de Dias de Jogos */}
      <div className={editingGameDay ? "lg:col-span-2" : "lg:col-span-3"}>
        <h2 className="section-title">
          Dias de Jogos ({gameDays.length})
        </h2>
        {gameDays.length === 0 ? (
          <div className="card text-center py-8 sm:py-12">
            <p className="body-text font-medium text-base sm:text-lg">Nenhum dia de jogos criado ainda.</p>
            <p className="text-secondary mt-2">Crie o primeiro dia de jogos usando os controles acima.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {gameDays.map((gameDay) => {
              const date = new Date(gameDay.date);
              const matchesCount = gameDay.matches.length;
              const finishedMatches = gameDay.matches.filter(m => m.status === "finished").length;
              
              return (
                <GameDayCard
                  key={gameDay.id}
                  id={gameDay.id}
                  date={date}
                  description={gameDay.description}
                  isOpen={gameDay.isOpen}
                  matchesCount={matchesCount}
                  finishedMatches={finishedMatches}
                  matchDurationMinutes={gameDay.matchDurationMinutes}
                  onEdit={() => handleEdit(gameDay)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

