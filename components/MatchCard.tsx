"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { startMatch, deleteMatch, replaceTeamsInMatch, updateFinishedMatchResult } from "@/lib/actions/matches";
import { GameInterface } from "./GameInterface";
import { Button } from "./Button";
import { useToast } from "./ToastProvider";
import { Loading } from "./Loading";
import { ConfirmDialog } from "./ConfirmDialog";

interface MatchCardProps {
  id: string;
  team1Id: string;
  team2Id: string;
  team1Name: string;
  team2Name: string;
  team1Color: string;
  team2Color: string;
  goalsTeam1: number;
  goalsTeam2: number;
  status: string;
  gameDayId: string;
  gameDayIsOpen: boolean;
  availableTeams?: Array<{ id: string; name: string }>;
  matchDurationMinutes: number;
  startedAt: Date | string | null;
  endedAt?: Date | string | null;
  actualDurationMinutes?: number | null;
  onUpdated?: () => void;
}

export function MatchCard({
  id,
  team1Id,
  team2Id,
  team1Name,
  team2Name,
  team1Color,
  team2Color,
  goalsTeam1,
  goalsTeam2,
  status,
  gameDayId,
  gameDayIsOpen,
  availableTeams = [],
  matchDurationMinutes,
  startedAt,
  endedAt,
  actualDurationMinutes,
  onUpdated,
}: MatchCardProps) {
  const router = useRouter();
  const toast = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showReplaceForm, setShowReplaceForm] = useState(false);
  const [teamOutId, setTeamOutId] = useState("");
  const [teamInId, setTeamInId] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditResultForm, setShowEditResultForm] = useState(false);
  const [editGoalsTeam1, setEditGoalsTeam1] = useState(goalsTeam1);
  const [editGoalsTeam2, setEditGoalsTeam2] = useState(goalsTeam2);

  // Sincroniza os valores de edição quando as props mudarem
  useEffect(() => {
    if (!showEditResultForm) {
      setEditGoalsTeam1(goalsTeam1);
      setEditGoalsTeam2(goalsTeam2);
    }
  }, [goalsTeam1, goalsTeam2, showEditResultForm]);

  const handleStartMatch = async () => {
    setIsUpdating(true);
    const result = await startMatch(id);
    setIsUpdating(false);

    if (result.success) {
      toast.showToast("Partida iniciada com sucesso! ⚽", "success");
      router.refresh();
      onUpdated?.();
    } else {
      toast.showToast(result.error || "Erro ao iniciar partida", "error");
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteConfirm(false);
    setIsUpdating(true);

    const result = await deleteMatch(id);
    setIsUpdating(false);

    if (result.success) {
      toast.showToast("Partida deletada com sucesso", "success");
      router.refresh();
      onUpdated?.();
    } else {
      toast.showToast(result.error || "Erro ao deletar partida", "error");
    }
  };

  const handleReplaceTeams = async () => {
    if (!teamOutId || !teamInId) {
      toast.showToast("Selecione o time que sai e o time que entra", "error");
      return;
    }

    if (teamOutId === teamInId) {
      toast.showToast("O time que entra deve ser diferente do time que sai", "error");
      return;
    }

    setIsUpdating(true);
    const result = await replaceTeamsInMatch(id, teamOutId, teamInId);
    setIsUpdating(false);

    if (result.success) {
      toast.showToast("Times substituídos com sucesso! 🔄", "success");
      setShowReplaceForm(false);
      setTeamOutId("");
      setTeamInId("");
      router.refresh();
      onUpdated?.();
    } else {
      toast.showToast(result.error || "Erro ao substituir times", "error");
    }
  };

  const handleEditResult = async () => {
    if (
      editGoalsTeam1 === goalsTeam1 &&
      editGoalsTeam2 === goalsTeam2
    ) {
      toast.showToast("Nenhuma alteração foi feita", "info");
      setShowEditResultForm(false);
      return;
    }

    if (editGoalsTeam1 < 0 || editGoalsTeam2 < 0) {
      toast.showToast("Os gols não podem ser negativos", "error");
      return;
    }

    setIsUpdating(true);
    const result = await updateFinishedMatchResult(
      id,
      editGoalsTeam1,
      editGoalsTeam2
    );
    setIsUpdating(false);

    if (result.success) {
      toast.showToast("Resultado atualizado com sucesso! ✓", "success");
      setShowEditResultForm(false);
      router.refresh();
      onUpdated?.();
    } else {
      toast.showToast(result.error || "Erro ao atualizar resultado", "error");
    }
  };

  const isFinished = status === "finished";
  const isInProgress = status === "in_progress";
  const isScheduled = status === "scheduled";
  const canReplace = isFinished && gameDayIsOpen && availableTeams.length > 0;

  // Se a partida está em andamento, mostra a interface principal do jogo
  if (isInProgress) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs sm:text-sm px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-800 font-semibold border-2 border-yellow-300">
            ⚽ Em andamento
          </span>
        </div>
        <GameInterface
          matchId={id}
          team1Name={team1Name}
          team2Name={team2Name}
          team1Color={team1Color}
          team2Color={team2Color}
          initialGoalsTeam1={goalsTeam1}
          initialGoalsTeam2={goalsTeam2}
          gameDayId={gameDayId}
          matchDurationMinutes={matchDurationMinutes}
          startedAt={startedAt}
          endedAt={endedAt}
          onFinished={() => {
            router.refresh();
            onUpdated?.();
          }}
        />
      </div>
    );
  }

  // Visualização padrão para partidas agendadas e finalizadas
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`text-xs sm:text-sm px-3 py-1.5 rounded-full font-semibold border-2 ${isFinished
            ? "bg-green-100 text-green-800 border-green-300"
            : "bg-gray-100 text-gray-800 border-gray-300"
            }`}>
            {isFinished ? "✓ Finalizada" : "📅 Agendada"}
          </span>
          {isFinished && actualDurationMinutes !== null && actualDurationMinutes !== undefined && (
            <span className="text-xs sm:text-sm px-2 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-medium">
              ⏱️ {actualDurationMinutes.toFixed(1)} min
            </span>
          )}
        </div>
        {!isFinished && (
          <Button
            onClick={handleDeleteClick}
            variant="danger"
            size="sm"
            className="text-sm"
            disabled={isUpdating}
          >
            Deletar
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
        <div className="flex-1 text-center w-full sm:w-auto">
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto flex items-center justify-center text-white font-bold text-xl sm:text-2xl mb-2 shadow-md"
            style={{ backgroundColor: team1Color }}
            aria-hidden="true"
          >
            {team1Name.charAt(0).toUpperCase()}
          </div>
          <p className="font-bold text-base sm:text-lg text-gray-900">{team1Name}</p>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <span className="text-3xl sm:text-4xl font-black text-gray-900">{goalsTeam1}</span>
          <span className="text-xl sm:text-2xl text-gray-600 font-bold">×</span>
          <span className="text-3xl sm:text-4xl font-black text-gray-900">{goalsTeam2}</span>
        </div>

        <div className="flex-1 text-center w-full sm:w-auto">
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto flex items-center justify-center text-white font-bold text-xl sm:text-2xl mb-2 shadow-md"
            style={{ backgroundColor: team2Color }}
            aria-hidden="true"
          >
            {team2Name.charAt(0).toUpperCase()}
          </div>
          <p className="font-bold text-base sm:text-lg text-gray-900">{team2Name}</p>
        </div>
      </div>

      {isScheduled && (
        <div className="mt-4 flex gap-2 justify-center">
          <Button
            onClick={handleStartMatch}
            disabled={isUpdating}
            variant="primary"
            size="md"
            fullWidth
            className="sm:w-auto"
          >
            {isUpdating ? (
              <span className="flex items-center gap-2">
                <Loading size="sm" />
                Iniciando...
              </span>
            ) : (
              "Iniciar Partida"
            )}
          </Button>
        </div>
      )}

      {isFinished && (
        <div className="mt-4 border-t-2 border-gray-200 pt-4 space-y-4">
          {/* Botão de Editar Resultado */}
          {!showEditResultForm && (
            <Button
              onClick={() => {
                setShowEditResultForm(true);
                setEditGoalsTeam1(goalsTeam1);
                setEditGoalsTeam2(goalsTeam2);
              }}
              variant="primary"
              size="md"
              fullWidth
              className="sm:w-auto"
            >
              ✏️ Editar Resultado
            </Button>
          )}

          {/* Formulário de Edição de Resultado */}
          {showEditResultForm && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Editar Resultado
                </h3>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1 text-center">
                  <label
                    htmlFor="editGoalsTeam1"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    {team1Name}
                  </label>
                  <input
                    id="editGoalsTeam1"
                    type="number"
                    min="0"
                    value={editGoalsTeam1}
                    onChange={(e) =>
                      setEditGoalsTeam1(parseInt(e.target.value) || 0)
                    }
                    className="input-mobile text-center text-2xl font-bold w-20 mx-auto"
                    disabled={isUpdating}
                  />
                </div>

                <span className="text-2xl font-bold text-gray-600">×</span>

                <div className="flex-1 text-center">
                  <label
                    htmlFor="editGoalsTeam2"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    {team2Name}
                  </label>
                  <input
                    id="editGoalsTeam2"
                    type="number"
                    min="0"
                    value={editGoalsTeam2}
                    onChange={(e) =>
                      setEditGoalsTeam2(parseInt(e.target.value) || 0)
                    }
                    className="input-mobile text-center text-2xl font-bold w-20 mx-auto"
                    disabled={isUpdating}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={handleEditResult}
                  disabled={isUpdating}
                  variant="primary"
                  size="md"
                  className="flex-1"
                >
                  {isUpdating ? (
                    <span className="flex items-center gap-2 justify-center">
                      <Loading size="sm" />
                      Atualizando...
                    </span>
                  ) : (
                    "Confirmar Alteração"
                  )}
                </Button>
                <Button
                  onClick={() => {
                    setShowEditResultForm(false);
                    setEditGoalsTeam1(goalsTeam1);
                    setEditGoalsTeam2(goalsTeam2);
                  }}
                  disabled={isUpdating}
                  variant="secondary"
                  size="md"
                  className="flex-1 sm:flex-none"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {/* Botão de Substituir Times */}
          {canReplace && (
            <>
              {!showReplaceForm ? (
                <Button
                  onClick={() => setShowReplaceForm(true)}
                  variant="custom"
                  customColor="#9333EA"
                  size="md"
                  fullWidth
                  className="hover:bg-purple-700 active:bg-purple-800"
                  disabled={showEditResultForm}
                >
                  🔄 Substituir Times
                </Button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="teamOutId" className="block text-base font-semibold text-gray-900 mb-2">
                      Time que sai *
                    </label>
                    <select
                      id="teamOutId"
                      value={teamOutId}
                      onChange={(e) => setTeamOutId(e.target.value)}
                      className="input-mobile"
                      disabled={isUpdating}
                      aria-required="true"
                    >
                      <option value="">Selecione o time que sai</option>
                      <option value={team1Id}>{team1Name}</option>
                      <option value={team2Id}>{team2Name}</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="teamInId" className="block text-base font-semibold text-gray-900 mb-2">
                      Time que entra *
                    </label>
                    <select
                      id="teamInId"
                      value={teamInId}
                      onChange={(e) => setTeamInId(e.target.value)}
                      className="input-mobile"
                      disabled={isUpdating}
                      aria-required="true"
                    >
                      <option value="">Selecione o time que entra</option>
                      {availableTeams
                        .filter((team) => team.id !== team1Id && team.id !== team2Id)
                        .map((team) => (
                          <option key={team.id} value={team.id}>
                            {team.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={handleReplaceTeams}
                      disabled={isUpdating || !teamOutId || !teamInId}
                      variant="custom"
                      customColor="#9333EA"
                      size="md"
                      className="flex-1 hover:bg-purple-700 active:bg-purple-800"
                    >
                      {isUpdating ? "Substituindo..." : "Confirmar Substituição"}
                    </Button>
                    <Button
                      onClick={() => {
                        setShowReplaceForm(false);
                        setTeamOutId("");
                        setTeamInId("");
                      }}
                      disabled={isUpdating}
                      variant="secondary"
                      size="md"
                      className="flex-1 sm:flex-none"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Dialog de confirmação para deletar */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Deletar Partida"
        message={`Você está prestes a deletar a partida entre ${team1Name} e ${team2Name}. Esta ação não pode ser desfeita. Deseja continuar?`}
        confirmLabel="Sim, Deletar"
        cancelLabel="Cancelar"
        isLoading={isUpdating}
        variant="danger"
      />
    </div>
  );
}

