import { getStandings } from "@/lib/actions/standings";
import { StandingsTable } from "@/components/StandingsTable";
import { type TeamStanding } from "@/lib/utils/standings";

export default async function StandingsPage() {
  const standingsResult = await getStandings();
  const standings = (standingsResult.success ? standingsResult.data || [] : []) as TeamStanding[];

  return (
    <div className="page-container">
      <h1 className="page-title">Tabela de Classificação Geral</h1>

      {standings.length === 0 ? (
        <div className="card text-center py-8 sm:py-12">
          <p className="body-text font-medium text-base sm:text-lg">Nenhum time cadastrado ainda.</p>
          <p className="text-secondary mt-2">Cadastre times e crie partidas para ver a tabela.</p>
        </div>
      ) : (
        <div className="card p-0 sm:p-4">
          <StandingsTable standings={standings} />
        </div>
      )}

      <div className="mt-6 p-4 sm:p-6 bg-blue-50 border-2 border-blue-200 rounded-lg shadow-sm">
        <h3 className="section-title mb-3">Critérios de Desempate:</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm sm:text-base text-gray-800">
          <li>Maior número de pontos</li>
          <li>Maior saldo de gols</li>
          <li>Maior número de gols marcados</li>
        </ol>
      </div>
    </div>
  );
}

