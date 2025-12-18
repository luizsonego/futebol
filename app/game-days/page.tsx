import { getGameDays, getOpenGameDay } from "@/lib/actions/gameDays";
import { GameDayForm } from "@/components/GameDayForm";
import { GameDayControls } from "@/components/GameDayControls";
import { GameDayCard } from "@/components/GameDayCard";

export default async function GameDaysPage() {
  const gameDaysResult = await getGameDays();
  const gameDays = (gameDaysResult.success ? gameDaysResult.data : []) as Array<{
    id: string;
    date: Date;
    description: string | null;
    isOpen: boolean;
    matches: Array<{ status: string }>;
  }>;
  
  const openGameDayResult = await getOpenGameDay();
  const openGameDay = (openGameDayResult.success ? openGameDayResult.data : null) as {
    id: string;
    date: Date;
    description: string | null;
    matches: Array<unknown>;
  } | null;

  return (
    <div className="page-container">
      <h1 className="page-title">Dias de Jogos</h1>

      <div className="mb-4 sm:mb-6">
        <GameDayControls openGameDay={openGameDay} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* <div className="lg:col-span-1">
          <div className="card lg:sticky lg:top-20">
            <h2 className="section-title">Criar Novo Dia de Jogos</h2>
            <GameDayForm />
          </div>
        </div> */}

        <div className="lg:col-span-2">
          <h2 className="section-title">
            Dias de Jogos ({gameDays.length})
          </h2>
          {gameDays.length === 0 ? (
            <div className="card text-center py-8 sm:py-12">
              <p className="body-text font-medium text-base sm:text-lg">Nenhum dia de jogos criado ainda.</p>
              <p className="text-secondary mt-2">Crie o primeiro dia de jogos usando o formulário acima.</p>
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
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

