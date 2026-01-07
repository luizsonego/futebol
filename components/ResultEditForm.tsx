"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateTeamResult } from "@/lib/actions/results";
import { type UpdateTeamResultInput } from "@/lib/validations";
import { Button } from "./Button";
import { useToast } from "./ToastProvider";
import { Loading } from "./Loading";

interface ResultEditFormProps {
  teamId: string;
  teamName: string;
  currentPoints: number;
  currentGoals: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

/**
 * Componente de formulário para editar resultados de um time
 */
export function ResultEditForm({
  teamId,
  teamName,
  currentPoints,
  currentGoals,
  onSuccess,
  onCancel,
}: ResultEditFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [formData, setFormData] = useState<UpdateTeamResultInput>({
    teamId,
    points: currentPoints,
    goalsScored: currentGoals,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Preencher formulário quando os valores mudarem
  useEffect(() => {
    setFormData({
      teamId,
      points: currentPoints,
      goalsScored: currentGoals,
    });
  }, [teamId, currentPoints, currentGoals]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const result = await updateTeamResult(formData);

    if (result.success) {
      toast.showToast("Resultado atualizado com sucesso! ✓", "success");
      router.refresh();
      onSuccess?.();
    } else {
      const errorMsg = result.error || "Erro ao atualizar resultado";
      setError(errorMsg);
      toast.showToast(errorMsg, "error");
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-label={`Formulário de edição de resultado - ${teamName}`}>
      {error && (
        <div
          className="bg-red-50 border-2 border-red-500 text-red-800 px-4 py-3 rounded-lg font-medium shadow-sm animate-shake"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm font-medium text-gray-700 mb-1">Time</p>
        <p className="text-lg font-semibold text-gray-900">{teamName}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="points" className="block text-base font-semibold text-gray-900 mb-2">
            Pontos *
          </label>
          <input
            id="points"
            type="number"
            value={formData.points}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 0;
              setFormData({ ...formData, points: Math.max(0, value) });
              setError(null);
            }}
            min="0"
            required
            className="input-mobile"
            aria-describedby="points-help"
            aria-required="true"
          />
          <p id="points-help" className="text-xs text-gray-600 mt-1.5">
            Pontos do time na classificação
          </p>
        </div>

        <div>
          <label htmlFor="goalsScored" className="block text-base font-semibold text-gray-900 mb-2">
            Gols Marcados *
          </label>
          <input
            id="goalsScored"
            type="number"
            value={formData.goalsScored}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 0;
              setFormData({ ...formData, goalsScored: Math.max(0, value) });
              setError(null);
            }}
            min="0"
            required
            className="input-mobile"
            aria-describedby="goalsScored-help"
            aria-required="true"
          />
          <p id="goalsScored-help" className="text-xs text-gray-600 mt-1.5">
            Total de gols marcados pelo time
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            variant="secondary"
            size="md"
            className="flex-1"
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          variant="primary"
          size="md"
          className={onCancel ? "flex-1" : "w-full"}
          fullWidth={!onCancel}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loading size="sm" />
              Atualizando...
            </span>
          ) : (
            "Atualizar Resultado"
          )}
        </Button>
      </div>
    </form>
  );
}

