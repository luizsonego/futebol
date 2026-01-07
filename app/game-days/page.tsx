import { getGameDays, getOpenGameDay } from "@/lib/actions/gameDays";
import { GameDayControls } from "@/components/GameDayControls";
import { GameDaysPageContent } from "@/components/GameDaysPageContent";

export default async function GameDaysPage() {
  const gameDaysResult = await getGameDays();
  const gameDays = (gameDaysResult.success ? gameDaysResult.data : []) as Array<{
    id: string;
    date: Date;
    description: string | null;
    isOpen: boolean;
    matchDurationMinutes: number;
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

      <GameDaysPageContent gameDays={gameDays} />
    </div>
  );
}

