"use client";

import { useState } from "react";
import { startGameDay, closeGameDay } from "@/lib/actions/gameDays";
import { useRouter } from "next/navigation";
import { Button } from "./Button";
import { useToast } from "./ToastProvider";
import { Loading } from "./Loading";
import { ConfirmDialog } from "./ConfirmDialog";

interface GameDayControlsProps {
  openGameDay: {
    id: string;
    date: Date;
    description: string | null;
    matches: Array<unknown>;
  } | null;
}

export function GameDayControls({ openGameDay }: GameDayControlsProps) {
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [matchDurationMinutes, setMatchDurationMinutes] = useState(10);

  const handleStart = async () => {
    setIsLoading(true);
    
    const result = await startGameDay(matchDurationMinutes);
    
    if (result.success) {
      toast.showToast("Dia de jogos iniciado com sucesso! 🎉", "success");
      router.refresh();
    } else {
      toast.showToast(result.error || "Erro ao iniciar dia de jogos", "error");
    }
    
    setIsLoading(false);
  };

  const handleCloseClick = () => {
    if (!openGameDay) return;
    setShowConfirmDialog(true);
  };

  const handleConfirmClose = async () => {
    if (!openGameDay) return;
    
    setShowConfirmDialog(false);
    setIsLoading(true);
    
    const result = await closeGameDay(openGameDay.id);
    
    if (result.success) {
      toast.showToast("Dia de jogos encerrado com sucesso! ✅", "success");
      router.refresh();
    } else {
      toast.showToast(result.error || "Erro ao encerrar dia de jogos", "error");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="card">
      <h2 className="section-title">Controle de Dia de Jogos</h2>

      {openGameDay ? (
        <div className="space-y-4">
          <div className="bg-green-50 border-2 border-green-400 rounded-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                  <p className="font-bold text-green-800 text-base sm:text-lg">Dia de Jogos Aberto</p>
                </div>
                <p className="text-sm sm:text-base text-green-700 font-medium">
                  {new Date(openGameDay.date).toLocaleDateString("pt-BR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                {openGameDay.description && (
                  <p className="text-sm sm:text-base text-green-700 mt-1">{openGameDay.description}</p>
                )}
                <p className="text-sm sm:text-base text-green-700 font-semibold mt-2">
                  {openGameDay.matches.length} partida{openGameDay.matches.length !== 1 ? "s" : ""} cadastrada{openGameDay.matches.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>
          
          <Button
            onClick={handleCloseClick}
            disabled={isLoading}
            variant="danger"
            size="md"
            fullWidth
          >
            Encerrar Dia de Jogos
          </Button>

          {/* Dialog de confirmação */}
          <ConfirmDialog
            isOpen={showConfirmDialog}
            onClose={() => setShowConfirmDialog(false)}
            onConfirm={handleConfirmClose}
            title="Encerrar Dia de Jogos"
            message={`Você está prestes a encerrar este dia de jogos. ${openGameDay.matches.length > 0 ? `Existem ${openGameDay.matches.length} partida(s) cadastrada(s). ` : ""}Após encerrar, não será possível criar novas partidas neste dia. Esta ação não pode ser desfeita. Deseja continuar?`}
            confirmLabel="Sim, Encerrar"
            cancelLabel="Cancelar"
            isLoading={isLoading}
            variant="warning"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4 sm:p-6">
            <p className="body-text text-sm sm:text-base">Nenhum dia de jogos aberto no momento.</p>
            <p className="text-secondary mt-2">
              Inicie um novo dia de jogos para começar a cadastrar partidas.
            </p>
          </div>

          <div>
            <label htmlFor="matchDurationMinutes" className="block text-base font-semibold text-gray-900 mb-2">
              Tempo da partida (minutos) *
            </label>
            <input
              id="matchDurationMinutes"
              type="number"
              min="1"
              max="120"
              value={matchDurationMinutes}
              onChange={(e) => setMatchDurationMinutes(parseInt(e.target.value) || 10)}
              required
              className="input-mobile"
              aria-required="true"
              disabled={isLoading}
            />
            <p className="text-sm text-gray-600 mt-1">Tempo máximo de cada partida em minutos (padrão: 10)</p>
          </div>
          
          <Button
            onClick={handleStart}
            disabled={isLoading}
            variant="primary"
            size="md"
            fullWidth
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loading size="sm" />
                Iniciando...
              </span>
            ) : (
              "Iniciar Dia de Jogos"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

