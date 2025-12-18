'use client';
import { GameBlocked } from "@/components/GameBlocked";
import { getTeams } from "@/lib/actions/teams";
import { getOpenGameDay } from "@/lib/actions/gameDays";
import { TeamForm } from "@/components/TeamForm";
import { TeamCard } from "@/components/TeamCard";
import { GameDayControls } from "@/components/GameDayControls";
import { Button } from "@/components/Button";
import Link from "next/link";

export default async function SettingsPage() {
  const teamsResult = await getTeams();
  const teams = (teamsResult.success ? teamsResult.data || [] : []) as Array<{ id: string; name: string; primaryColor: string; secondaryColor: string; [key: string]: any }>;
  
  const openGameDayResult = await getOpenGameDay();
  const openGameDay = (openGameDayResult.success ? openGameDayResult.data : null) as { id: string; date: Date; description: string | null; matches: unknown[] } | null;

  return (
    <GameBlocked>
      <div className="page-container">
        <div className="mb-4 sm:mb-6">
          <h1 className="page-title">⚙️ Configurações</h1>
          <p className="body-text mt-2 text-sm sm:text-base">
            Gerencie as configurações administrativas do sistema
          </p>
        </div>

        {/* Lista de configurações */}
        <div className="space-y-4 sm:space-y-6">
          {/* Controle de Dia de Jogos */}
          <div className="card">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">📅</span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="section-title mb-1">Dia de Jogos</h2>
                <p className="text-secondary text-sm">
                  Inicie ou encerre um dia de jogos para organizar as partidas
                </p>
              </div>
            </div>
            <GameDayControls openGameDay={openGameDay} />
          </div>

          {/* Gerenciar Times */}
          <div className="card">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">👥</span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="section-title mb-1">Gerenciar Times</h2>
                <p className="text-secondary text-sm mb-4">
                  Cadastre e gerencie os times participantes do campeonato
                </p>
              </div>
            </div>

            {/* Formulário de cadastro */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                Cadastrar Novo Time
              </h3>
              <TeamForm />
            </div>

            {/* Lista de times */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                Times Cadastrados
                <span className="ml-2 text-sm font-normal text-gray-600">
                  ({teams.length} {teams.length === 1 ? "time" : "times"})
                </span>
              </h3>
              
              {teams.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-gray-400 mb-2">
                    <svg
                      className="mx-auto h-12 w-12"
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
                  <p className="text-sm text-gray-600 font-medium">
                    Nenhum time cadastrado ainda
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Use o formulário acima para cadastrar o primeiro time
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {teams.map((team) => (
                    <TeamCard
                      key={team.id}
                      id={team.id}
                      name={team.name}
                      primaryColor={team.primaryColor}
                      secondaryColor={team.secondaryColor}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Link para página completa de times */}
          <div className="card bg-blue-50 border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">
                  Ver Todos os Times
                </h3>
                <p className="text-sm text-gray-600">
                  Acesse a página completa de gerenciamento de times
                </p>
              </div>
              <Link href="/teams">
                <Button variant="secondary" size="md">
                  Abrir →
                </Button>
              </Link>
            </div>
          </div>

          {/* Link para página completa de dias de jogos */}
          <div className="card bg-green-50 border-2 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">
                  Ver Todos os Dias de Jogos
                </h3>
                <p className="text-sm text-gray-600">
                  Acesse a página completa de gerenciamento de dias de jogos
                </p>
              </div>
              <Link href="/game-days">
                <Button variant="secondary" size="md">
                  Abrir →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </GameBlocked>
  );
}

