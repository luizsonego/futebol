"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { finishMatch } from "@/lib/actions/matches";
import { Button } from "./Button";
import { useToast } from "./ToastProvider";
import { Loading } from "./Loading";
import { useGameContext } from "./GameContext";
import { GameMoreMenu } from "./GameMoreMenu";
import { ConfirmDialog } from "./ConfirmDialog";
import { useMatchTimer } from "./useMatchTimer";
import { playWhistleSound } from "@/lib/utils/sound";

interface GameInterfaceProps {
  matchId: string;
  team1Name: string;
  team2Name: string;
  team1Color: string;
  team2Color: string;
  initialGoalsTeam1: number;
  initialGoalsTeam2: number;
  gameDayId?: string;
  matchDurationMinutes: number;
  startedAt: Date | string | null;
  endedAt?: Date | string | null;
  onFinished?: () => void;
}

export function GameInterface({
  matchId,
  team1Name,
  team2Name,
  team1Color,
  team2Color,
  initialGoalsTeam1,
  initialGoalsTeam2,
  gameDayId,
  matchDurationMinutes,
  startedAt,
  endedAt,
  onFinished,
}: GameInterfaceProps) {
  const router = useRouter();
  const toast = useToast();
  const { setIsInGame } = useGameContext();
  const [goalsTeam1, setGoalsTeam1] = useState(initialGoalsTeam1);
  const [goalsTeam2, setGoalsTeam2] = useState(initialGoalsTeam2);
  const [isFinishing, setIsFinishing] = useState(false);
  const [animatingGoal, setAnimatingGoal] = useState<"team1" | "team2" | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Hook do cronômetro
  const { timeDisplay, isTimeUp } = useMatchTimer({
    startedAt,
    durationMinutes: matchDurationMinutes,
    endedAt,
  });

  // Ativar modo de jogo quando o componente é montado
  useEffect(() => {
    setIsInGame(true);
    return () => {
      setIsInGame(false);
    };
  }, [setIsInGame]);

  const handleIncrementTeam1 = () => {
    setAnimatingGoal("team1");
    setGoalsTeam1((prev) => prev + 1);
    setTimeout(() => setAnimatingGoal(null), 600);
  };

  const handleDecrementTeam1 = () => {
    setGoalsTeam1((prev) => Math.max(0, prev - 1));
  };

  const handleIncrementTeam2 = () => {
    setAnimatingGoal("team2");
    setGoalsTeam2((prev) => prev + 1);
    setTimeout(() => setAnimatingGoal(null), 600);
  };

  const handleDecrementTeam2 = () => {
    setGoalsTeam2((prev) => Math.max(0, prev - 1));
  };

  const handleFinishMatchClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmFinishMatch = async () => {
    setShowConfirmDialog(false);
    setIsFinishing(true);
    
    // Toca o som de apito ao encerrar a partida
    playWhistleSound();
    
    const result = await finishMatch(matchId, goalsTeam1, goalsTeam2);
    
    if (result.success) {
      setShowSuccess(true);
      toast.showToast("Partida encerrada com sucesso! 🎉", "success");
      
      // Aguarda um pouco para mostrar a confirmação visual antes de atualizar
      setTimeout(() => {
        router.refresh();
        onFinished?.();
      }, 1500);
    } else {
      setIsFinishing(false);
      toast.showToast(result.error || "Erro ao encerrar partida", "error");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-6">
      {/* Botão de navegação rápida - Voltar ao dia de jogos */}
      {gameDayId && (
        <div className="mb-4 flex justify-between items-center">
          <Link
            href={`/game-days/${gameDayId}`}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-all duration-200 active:scale-[0.98] touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Voltar ao dia de jogos"
          >
            <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path d="M15 19l-7-7 7-7" />
            </svg>
            <span>Voltar ao Dia</span>
          </Link>
          
          {/* Cronômetro */}
          {startedAt && (
            <div className={`flex flex-col items-center px-4 py-2 rounded-lg border-2 transition-all duration-300 ${
              isTimeUp 
                ? "bg-red-50 border-red-500 text-red-900" 
                : "bg-blue-50 border-blue-500 text-blue-900"
            }`}>
              <div className={`text-3xl sm:text-4xl font-black ${isTimeUp ? "animate-pulse" : ""}`}>
                {timeDisplay}
              </div>
              {isTimeUp && (
                <div className="text-xs sm:text-sm font-semibold mt-1">
                  Tempo encerrado
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {isFinishing && showSuccess && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="success-title"
          aria-describedby="success-description"
        >
          <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 max-w-sm mx-4 text-center animate-bounce-in border-2 border-green-500">
            <div className="text-6xl mb-4 animate-pulse-scale" aria-hidden="true">🎉</div>
            <h3 id="success-title" className="text-2xl font-bold text-gray-900 mb-3">Partida Encerrada!</h3>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p id="success-description" className="text-lg font-semibold text-gray-800">
                <span style={{ color: team1Color }} className="font-black">{team1Name}</span>
                <span className="mx-2 text-gray-500">×</span>
                <span style={{ color: team2Color }} className="font-black">{team2Name}</span>
              </p>
              <p className="text-3xl font-black text-gray-900 mt-2">
                {goalsTeam1} <span className="text-gray-400 mx-2">×</span> {goalsTeam2}
              </p>
            </div>
            <p className="text-sm text-gray-600">Atualizando...</p>
          </div>
        </div>
      )}

      {isFinishing && !showSuccess && <Loading fullScreen text="Encerrando partida..." />}

      {/* Placar centralizado - Mobile First */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-3 sm:gap-4 bg-white border-2 border-gray-300 px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-md" role="region" aria-label="Placar da partida">
          <span
            className={`text-2xl sm:text-3xl font-black transition-all duration-200 ${
              animatingGoal === "team1" ? "animate-pulse-scale" : ""
            }`}
            style={{ color: team1Color }}
            aria-label={`${team1Name}: ${goalsTeam1} gols`}
          >
            {goalsTeam1}
          </span>
          <span className="text-xl sm:text-2xl text-gray-600 font-bold" aria-hidden="true">×</span>
          <span
            className={`text-2xl sm:text-3xl font-black transition-all duration-200 ${
              animatingGoal === "team2" ? "animate-pulse-scale" : ""
            }`}
            style={{ color: team2Color }}
            aria-label={`${team2Name}: ${goalsTeam2} gols`}
          >
            {goalsTeam2}
          </span>
        </div>
      </div>

      {/* Botões de gol - Mobile First, otimizado para uma mão */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
        {/* Time 1 */}
        <div className="flex flex-col">
          <button
            onClick={handleIncrementTeam1}
            disabled={isFinishing}
            aria-label={`Adicionar gol para ${team1Name}`}
            aria-disabled={isFinishing}
            className={`w-full min-h-[200px] sm:min-h-[240px] rounded-lg text-white font-bold shadow-lg hover:shadow-xl active:shadow-2xl transition-all duration-200 active:scale-[0.98] flex flex-col items-center justify-center touch-manipulation focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 ${
              animatingGoal === "team1" ? "animate-pulse-scale" : ""
            } ${isFinishing ? "opacity-50 cursor-not-allowed" : ""}`}
            style={{ backgroundColor: team1Color }}
          >
            <span className="text-5xl sm:text-6xl md:text-7xl font-black mb-2" aria-hidden="true">
              {goalsTeam1}
            </span>
            <span className="text-lg sm:text-xl md:text-2xl font-semibold">{team1Name}</span>
            <span className="text-xs sm:text-sm mt-2 opacity-90">Toque para adicionar gol</span>
          </button>
          <Button
            onClick={handleDecrementTeam1}
            disabled={goalsTeam1 === 0}
            variant="secondary"
            size="md"
            fullWidth
            className="mt-3"
            aria-label={`Remover gol de ${team1Name}`}
          >
            − Decrementar
          </Button>
        </div>

        {/* Time 2 */}
        <div className="flex flex-col">
          <button
            onClick={handleIncrementTeam2}
            disabled={isFinishing}
            aria-label={`Adicionar gol para ${team2Name}`}
            aria-disabled={isFinishing}
            className={`w-full min-h-[200px] sm:min-h-[240px] rounded-lg text-white font-bold shadow-lg hover:shadow-xl active:shadow-2xl transition-all duration-200 active:scale-[0.98] flex flex-col items-center justify-center touch-manipulation focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 ${
              animatingGoal === "team2" ? "animate-pulse-scale" : ""
            } ${isFinishing ? "opacity-50 cursor-not-allowed" : ""}`}
            style={{ backgroundColor: team2Color }}
          >
            <span className="text-5xl sm:text-6xl md:text-7xl font-black mb-2" aria-hidden="true">
              {goalsTeam2}
            </span>
            <span className="text-lg sm:text-xl md:text-2xl font-semibold">{team2Name}</span>
            <span className="text-xs sm:text-sm mt-2 opacity-90">Toque para adicionar gol</span>
          </button>
          <Button
            onClick={handleDecrementTeam2}
            disabled={goalsTeam2 === 0}
            variant="secondary"
            size="md"
            fullWidth
            className="mt-3"
            aria-label={`Remover gol de ${team2Name}`}
          >
            − Decrementar
          </Button>
        </div>
      </div>

      {/* Botão Encerrar Partida - Grande e acessível */}
      <div className="flex justify-center mb-4">
        <Button
          onClick={handleFinishMatchClick}
          disabled={isFinishing}
          variant="danger"
          size="lg"
          fullWidth
          className="sm:w-auto"
        >
          Encerrar Partida
        </Button>
      </div>

      {/* Menu flutuante "Mais opções" */}
      <GameMoreMenu matchId={matchId} />

      {/* Dialog de confirmação */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmFinishMatch}
        title="Encerrar Partida"
        message={`Você está prestes a encerrar esta partida com o placar ${goalsTeam1} × ${goalsTeam2}. Esta ação não pode ser desfeita. Deseja continuar?`}
        confirmLabel="Sim, Encerrar"
        cancelLabel="Cancelar"
        isLoading={isFinishing}
        variant="warning"
      />
    </div>
  );
}

