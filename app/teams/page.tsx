'use client';
import { TeamForm } from "@/components/TeamForm";
import { TeamCard } from "@/components/TeamCard";
import { getTeams } from "@/lib/actions/teams";

/**
 * Página de gerenciamento de times
 * Exibe formulário de cadastro e listagem de times cadastrados
 */
export default async function TeamsPage() {
  const teamsResult = await getTeams();
  const teams = (teamsResult.success ? teamsResult.data || [] : []) as Array<{ id: string; name: string; primaryColor: string; secondaryColor: string; [key: string]: any }>;

  return (
    <div className="page-container">
      <div className="mb-4 sm:mb-6">
        <h1 className="page-title">Times</h1>
        <p className="body-text mt-2 text-sm sm:text-base">Gerencie os times do campeonato</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Formulário de Cadastro */}
        <div className="lg:col-span-1">
          <div className="card lg:sticky lg:top-20">
            <h2 className="section-title">Cadastrar Novo Time</h2>
            <TeamForm />
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
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

