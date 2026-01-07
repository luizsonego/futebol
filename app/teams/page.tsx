import { TeamsPageContent } from "@/components/TeamsPageContent";
import { getTeams } from "@/lib/actions/teams";

/**
 * Página de gerenciamento de times
 * Exibe formulário de cadastro e listagem de times cadastrados
 */
export default async function TeamsPage() {
  const teamsResult = await getTeams();
  const teams = (teamsResult.success ? teamsResult.data || [] : []) as Array<{ id: string; name: string; primaryColor: string; secondaryColor: string;[key: string]: any }>;

  return (
    <div className="page-container">
      <div className="mb-4 sm:mb-6">
        <h1 className="page-title">Times</h1>
        <p className="body-text mt-2 text-sm sm:text-base">Gerencie os times do campeonato</p>
      </div>

      <TeamsPageContent teams={teams} />
    </div>
  );
}

