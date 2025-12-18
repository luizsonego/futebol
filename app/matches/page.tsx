'use client';
import { getMatches } from "@/lib/actions/matches";
import { MatchCard } from "@/components/MatchCard";

export default async function MatchesPage() {
  const matchesResult = await getMatches();
  const matches = (matchesResult.success ? matchesResult.data || [] : []) as Array<{
    id: string;
    team1Id: string;
    team2Id: string;
    goalsTeam1: number | null;
    goalsTeam2: number | null;
    status: string;
    gameDayId: string;
    startedAt: Date | null;
    endedAt: Date | null;
    actualDurationMinutes: number | null;
    team1: { name: string; primaryColor: string };
    team2: { name: string; primaryColor: string };
    gameDay: { isOpen: boolean; matchDurationMinutes: number };
  }>;

  const scheduledMatches = matches.filter(m => m.status === "scheduled");
  const inProgressMatches = matches.filter(m => m.status === "in_progress");
  const finishedMatches = matches.filter(m => m.status === "finished");

  return (
    <div className="page-container">
      <h1 className="page-title">Todas as Partidas</h1>

      {matches.length === 0 ? (
        <div className="card text-center py-8 sm:py-12">
          <p className="body-text font-medium text-base sm:text-lg">Nenhuma partida criada ainda.</p>
          <p className="text-secondary mt-2">Crie partidas através dos dias de jogos.</p>
        </div>
      ) : (
        <div className="space-section">
          {inProgressMatches.length > 0 && (
            <div>
              <h2 className="section-title text-yellow-700 flex items-center gap-2">
                <span className="text-2xl">⚽</span>
                Em Andamento ({inProgressMatches.length})
              </h2>
              <div className="grid-standard">
                {inProgressMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    id={match.id}
                    team1Id={match.team1Id}
                    team2Id={match.team2Id}
                    team1Name={match.team1.name}
                    team2Name={match.team2.name}
                    team1Color={match.team1.primaryColor}
                    team2Color={match.team2.primaryColor}
                    goalsTeam1={match.goalsTeam1 ?? 0}
                    goalsTeam2={match.goalsTeam2 ?? 0}
                    status={match.status}
                    gameDayId={match.gameDayId}
                    gameDayIsOpen={match.gameDay.isOpen}
                    matchDurationMinutes={match.gameDay.matchDurationMinutes}
                    startedAt={match.startedAt}
                    endedAt={match.endedAt}
                    actualDurationMinutes={match.actualDurationMinutes}
                  />
                ))}
              </div>
            </div>
          )}

          {scheduledMatches.length > 0 && (
            <div>
              <h2 className="section-title text-gray-700 flex items-center gap-2">
                <span className="text-2xl">📅</span>
                Agendadas ({scheduledMatches.length})
              </h2>
              <div className="grid-standard">
                {scheduledMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    id={match.id}
                    team1Id={match.team1Id}
                    team2Id={match.team2Id}
                    team1Name={match.team1.name}
                    team2Name={match.team2.name}
                    team1Color={match.team1.primaryColor}
                    team2Color={match.team2.primaryColor}
                    goalsTeam1={match.goalsTeam1 ?? 0}
                    goalsTeam2={match.goalsTeam2 ?? 0}
                    status={match.status}
                    gameDayId={match.gameDayId}
                    gameDayIsOpen={match.gameDay.isOpen}
                    matchDurationMinutes={match.gameDay.matchDurationMinutes}
                    startedAt={match.startedAt}
                    endedAt={match.endedAt}
                    actualDurationMinutes={match.actualDurationMinutes}
                  />
                ))}
              </div>
            </div>
          )}

          {finishedMatches.length > 0 && (
            <div>
              <h2 className="section-title text-green-700 flex items-center gap-2">
                <span className="text-2xl">✓</span>
                Finalizadas ({finishedMatches.length})
              </h2>
              <div className="grid-standard">
                {finishedMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    id={match.id}
                    team1Id={match.team1Id}
                    team2Id={match.team2Id}
                    team1Name={match.team1.name}
                    team2Name={match.team2.name}
                    team1Color={match.team1.primaryColor}
                    team2Color={match.team2.primaryColor}
                    goalsTeam1={match.goalsTeam1 ?? 0}
                    goalsTeam2={match.goalsTeam2 ?? 0}
                    status={match.status}
                    gameDayId={match.gameDayId}
                    gameDayIsOpen={match.gameDay.isOpen}
                    matchDurationMinutes={match.gameDay.matchDurationMinutes}
                    startedAt={match.startedAt}
                    endedAt={match.endedAt}
                    actualDurationMinutes={match.actualDurationMinutes}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

