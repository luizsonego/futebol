"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getQueue, addTeamsToQueue, removeTeamFromQueue } from "@/lib/actions/queue";
import { Button } from "./Button";
import { useToast } from "./ToastProvider";
import { Loading } from "./Loading";

interface QueueManagerProps {
  gameDayId: string;
  teams: Array<{ id: string; name: string; primaryColor: string }>;
}

export function QueueManager({ gameDayId, teams }: QueueManagerProps) {
  const router = useRouter();
  const toast = useToast();
  const [queueTeamIds, setQueueTeamIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);

  useEffect(() => {
    loadQueue();
  }, [gameDayId]);

  const loadQueue = async () => {
    setIsLoading(true);
    const result = await getQueue(gameDayId);
    if (result.success && result.data) {
      setQueueTeamIds(result.data.teamIds);
    }
    setIsLoading(false);
  };

  const handleAddToQueue = async () => {
    if (selectedTeamIds.length === 0) return;

    setIsAdding(true);
    const result = await addTeamsToQueue(gameDayId, selectedTeamIds);
    if (result.success) {
      toast.showToast(`${selectedTeamIds.length} time(s) adicionado(s) à fila! ✅`, "success");
      await loadQueue();
      setSelectedTeamIds([]);
    } else {
      toast.showToast(result.error || "Erro ao adicionar times à fila", "error");
    }
    setIsAdding(false);
  };

  const handleRemoveFromQueue = async (teamId: string) => {
    const result = await removeTeamFromQueue(gameDayId, teamId);
    if (result.success) {
      toast.showToast("Time removido da fila", "success");
      await loadQueue();
    } else {
      toast.showToast(result.error || "Erro ao remover time da fila", "error");
    }
  };

  const availableTeams = teams.filter((team) => !queueTeamIds.includes(team.id));

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <Loading text="Carregando fila..." />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Fila de Times</h2>

      {queueTeamIds.length === 0 ? (
        <div className="text-gray-500 text-sm mb-4">
          Nenhum time na fila. Adicione times para começar.
        </div>
      ) : (
        <div className="mb-4 space-y-2">
          {queueTeamIds.map((teamId, index) => {
            const team = teams.find((t) => t.id === teamId);
            if (!team) return null;

            return (
              <div
                key={teamId}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500 w-6">
                    {index + 1}º
                  </span>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: team.primaryColor }}
                  >
                    {team.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">{team.name}</span>
                </div>
                <Button
                  onClick={() => handleRemoveFromQueue(teamId)}
                  variant="danger"
                  size="sm"
                  className="text-xs"
                >
                  Remover
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {availableTeams.length > 0 && (
        <div className="border-t pt-4">
          <label className="block text-sm font-medium mb-2">
            Adicionar times à fila
          </label>
          <div className="space-y-2 max-h-40 overflow-y-auto mb-3">
            {availableTeams.map((team) => (
              <label
                key={team.id}
                className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedTeamIds.includes(team.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTeamIds([...selectedTeamIds, team.id]);
                    } else {
                      setSelectedTeamIds(selectedTeamIds.filter((id) => id !== team.id));
                    }
                  }}
                  className="rounded w-5 h-5 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label={`Selecionar ${team.name} para adicionar à fila`}
                />
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs"
                  style={{ backgroundColor: team.primaryColor }}
                >
                  {team.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm">{team.name}</span>
              </label>
            ))}
          </div>
          <Button
            onClick={handleAddToQueue}
            disabled={isAdding || selectedTeamIds.length === 0}
            variant="primary"
            size="md"
            fullWidth
          >
            {isAdding ? (
              <span className="flex items-center justify-center gap-2">
                <Loading size="sm" />
                Adicionando...
              </span>
            ) : (
              "Adicionar à Fila"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

