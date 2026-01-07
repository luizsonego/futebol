"use client";

import { useState } from "react";
import { TeamForm } from "./TeamForm";
import { TeamCard } from "./TeamCard";

interface Team {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
}

interface TeamsPageContentProps {
  teams: Team[];
}

/**
 * Componente cliente para gerenciar o estado de edição de times
 */
export function TeamsPageContent({ teams }: TeamsPageContentProps) {
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const handleEdit = (team: Team) => {
    setEditingTeam(team);
  };

  const handleCancelEdit = () => {
    setEditingTeam(null);
  };

  const handleSuccess = () => {
    setEditingTeam(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      {/* Formulário de Cadastro/Edição */}
      <div className="lg:col-span-1">
        <div className="card lg:sticky lg:top-20">
          <h2 className="section-title">
            {editingTeam ? "Editar Time" : "Cadastrar Novo Time"}
          </h2>
          <TeamForm
            teamToEdit={editingTeam}
            onCancel={editingTeam ? handleCancelEdit : undefined}
            onSuccess={handleSuccess}
          />
        </div>
      </div>

      {/* Listagem de Times */}
      <div className="lg:col-span-2">
        <div className="mb-4">
          <h2 className="section-title">
            Times Cadastrados
            <span className="ml-2 text-sm font-normal text-gray-600">
              ({teams.length} {teams.length === 1 ? "time" : "times"})
            </span>
          </h2>
        </div>
        
        {teams.length === 0 ? (
          <div className="card text-center py-8 sm:py-12">
            <div className="text-gray-400 mb-3">
              <svg
                className="mx-auto h-12 w-12 sm:h-16 sm:w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <p className="body-text font-semibold text-base sm:text-lg">Nenhum time cadastrado ainda</p>
            <p className="text-secondary mt-2">
              Cadastre o primeiro time usando o formulário acima
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {teams.map((team) => (
              <TeamCard
                key={team.id}
                id={team.id}
                name={team.name}
                primaryColor={team.primaryColor}
                secondaryColor={team.secondaryColor}
                onEdit={() => handleEdit(team)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

