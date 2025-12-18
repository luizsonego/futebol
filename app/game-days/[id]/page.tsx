import { notFound } from "next/navigation";
import { getGameDay } from "@/lib/actions/gameDays";
import { getTeams } from "@/lib/actions/teams";
import { getStandingsByGameDay } from "@/lib/actions/standings";
import { MatchCard } from "@/components/MatchCard";
import { MatchForm } from "@/components/MatchForm";
import { BracketingButton } from "@/components/BracketingButton";
import { StandingsTable } from "@/components/StandingsTable";
import { GameDayDeleteButton } from "@/components/GameDayDeleteButton";
import { type TeamStanding } from "@/lib/utils/standings";

export const dynamic = 'force-dynamic';

interface GameDayDetailPageProps {
  params: {
    id: string;
  };
}

export default async function GameDayDetailPage({ params }: GameDayDetailPageProps) {
  const id = params?.id || '';
  if (!id) {
    notFound();
  }
  
  const gameDayResult = await getGameDay(id);
  
  if (!gameDayResult.success || !gameDayResult.data) {
    notFound();
  }

  const gameDay = gameDayResult.data as { id: string; date: Date | string; description: string | null; isOpen: boolean; championId: string | null; closedAt: Date | null; finalStandings: string | null; matchDurationMinutes: number; createdAt: Date; updatedAt: Date; matches: any[]; champion: any };
  
  const teamsResult = await getTeams();
  const teams = (teamsResult.success ? teamsResult.data || [] : []) as Array<{ id: string; name: string; [key: string]: any }>;
  const standingsResult = await getStandingsByGameDay(gameDay.id);
  const standings = (standingsResult.success ? standingsResult.data || [] : []) as TeamStanding[];

  const date = new Date(gameDay.date);

  return (
    <div className="page-container">
      <div className="mb-4 sm:mb-6">
        <h1 className="page-title text-xl sm:text-2xl md:text-3xl">
          {date.toLocaleDateString("pt-BR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </h1>
        {gameDay.description && (
          <p className="body-text mt-2 text-sm sm:text-base">{gameDay.description}</p>
        )}
      </div>

      <div className="mb-4 sm:mb-6 flex justify-end">
        <GameDayDeleteButton
          gameDayId={gameDay.id}
          gameDayDate={date}
          matchesCount={gameDay.matches.length}
        />
      </div>

      {!gameDay.isOpen && (
        <div className="mb-6 space-y-4">
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 sm:p-6">
            <div className="flex items-start gap-2">
              <span className="text-yellow-600 text-xl">⚠️</span>
              <div className="flex-1">
                <p className="text-yellow-800 font-semibold text-sm sm:text-base">
                  Este dia de jogos está encerrado. Não é possível criar novas partidas.
                </p>
                {gameDay.closedAt && (
                  <p className="text-secondary mt-2">
                    Encerrado em: {new Date(gameDay.closedAt).toLocaleString("pt-BR")}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {gameDay.champion && (
            <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 border-2 border-yellow-400 rounded-lg p-5 sm:p-6 shadow-lg">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl mb-3">🏆</div>
                <h2 className="text-xl sm:text-2xl font-bold text-yellow-900 mb-3">
                  Campeão do Dia
                </h2>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-3">
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-md"
                    style={{
                      backgroundColor: gameDay.champion.primaryColor,
                      color: gameDay.champion.secondaryColor,
                    }}
                  >
                    {gameDay.champion.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-2xl sm:text-3xl font-bold text-yellow-900">
                    {gameDay.champion.name}
                  </span>
                </div>
                {standings.length > 0 && standings[0] && (
                  <div className="text-sm sm:text-base text-yellow-800 space-y-1">
                    <p>
                      <span className="font-bold">{standings[0].points}</span> pontos |{" "}
                      <span className="font-bold">{standings[0].wins}</span> vitórias |{" "}
                      Saldo: <span className="font-bold">{standings[0].goalDifference > 0 ? "+" : ""}{standings[0].goalDifference}</span>
                    </p>
                    <p>
                      {standings[0].goalsFor} gols marcados
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {gameDay.isOpen && (
        <div className="bg-green-50 border-2 border-green-400 rounded-lg p-4 sm:p-6 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            <p className="text-green-800 font-semibold text-sm sm:text-base">
              Dia de jogos aberto - Você pode criar novas partidas.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-1 space-y-4 sm:space-y-6">
          <div className="card lg:sticky lg:top-20">
            <h2 className="section-title">Criar Partida Manual</h2>
            {gameDay.isOpen ? (
              <MatchForm gameDayId={gameDay.id} teams={teams} />
            ) : (
              <div className="text-secondary text-sm sm:text-base">
                O dia de jogos está encerrado. Não é possível criar novas partidas.
              </div>
            )}
          </div>

          {/* {gameDay.isOpen && (
            <div className="card">
              <QueueManager gameDayId={gameDay.id} teams={teams} />
            </div>
          )} */}

          {teams.length >= 2 && gameDay.matches.length === 0 && gameDay.isOpen && (
            <div className="card">
              <h2 className="section-title">Chaveamento Automático</h2>
              <p className="body-text text-sm sm:text-base mb-4">
                Gera automaticamente partidas balanceadas (round-robin) respeitando o período de 2 horas. 
                Todos os times jogarão aproximadamente o mesmo número de partidas (8-10 minutos por jogo).
              </p>
              <BracketingButton gameDayId={gameDay.id} />
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="mb-6">
            <h2 className="section-title">
              Classificação do Dia
            </h2>
            {standings.length === 0 ? (
              <div className="card text-center py-8 sm:py-12">
                <p className="body-text font-medium text-base sm:text-lg">Nenhuma partida finalizada ainda neste dia.</p>
                <p className="text-secondary mt-2">
                  Finalize partidas para ver a classificação do dia.
                </p>
              </div>
            ) : (
              <div className="card p-0 sm:p-4 mb-6">
                <StandingsTable standings={standings} championId={gameDay.championId} />
              </div>
            )}
          </div>

          <h2 className="section-title">
            Partidas ({gameDay.matches.length})
          </h2>
          {gameDay.matches.length === 0 ? (
            <div className="card text-center py-8 sm:py-12">
              <p className="body-text font-medium text-base sm:text-lg">Nenhuma partida criada ainda.</p>
              <p className="text-secondary mt-2">
                Crie partidas manualmente ou use o chaveamento automático.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {gameDay.matches.map((match) => (
                <MatchCard
                  key={match.id}
                  id={match.id}
                  team1Id={match.team1Id}
                  team2Id={match.team2Id}
                  team1Name={match.team1.name}
                  team2Name={match.team2.name}
                  team1Color={match.team1.primaryColor}
                  team2Color={match.team2.primaryColor}
                  goalsTeam1={match.goalsTeam1}
                  goalsTeam2={match.goalsTeam2}
                  status={match.status}
                  gameDayId={gameDay.id}
                  gameDayIsOpen={gameDay.isOpen}
                  availableTeams={teams}
                  matchDurationMinutes={gameDay.matchDurationMinutes}
                  startedAt={match.startedAt}
                  endedAt={match.endedAt}
                  actualDurationMinutes={match.actualDurationMinutes}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

