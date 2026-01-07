"use client";

import { useState, useEffect } from "react";
import { createGameDay, updateGameDay } from "@/lib/actions/gameDays";
import { useRouter } from "next/navigation";
import { Button } from "./Button";
import { useToast } from "./ToastProvider";
import { Loading } from "./Loading";

interface GameDayFormProps {
  gameDayToEdit?: {
    id: string;
    date: Date;
    description: string | null;
    matchDurationMinutes: number;
  } | null;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export function GameDayForm({ gameDayToEdit, onCancel, onSuccess }: GameDayFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 16),
    description: "",
    matchDurationMinutes: 10,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Preencher formulário quando estiver editando
  useEffect(() => {
    if (gameDayToEdit) {
      const date = new Date(gameDayToEdit.date);
      setFormData({
        date: new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16),
        description: gameDayToEdit.description || "",
        matchDurationMinutes: gameDayToEdit.matchDurationMinutes,
      });
    } else {
      setFormData({
        date: new Date().toISOString().slice(0, 16),
        description: "",
        matchDurationMinutes: 10,
      });
    }
  }, [gameDayToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const result = gameDayToEdit
      ? await updateGameDay(gameDayToEdit.id, {
          date: new Date(formData.date).toISOString(),
          description: formData.description || undefined,
          matchDurationMinutes: formData.matchDurationMinutes,
        })
      : await createGameDay({
          date: new Date(formData.date).toISOString(),
          description: formData.description || undefined,
          matchDurationMinutes: formData.matchDurationMinutes,
        });
    
    if (result.success) {
      if (!gameDayToEdit) {
        setFormData({ date: new Date().toISOString().slice(0, 16), description: "", matchDurationMinutes: 10 });
      }
      toast.showToast(
        gameDayToEdit ? "Dia de jogos atualizado com sucesso! 📅" : "Dia de jogos criado com sucesso! 📅",
        "success"
      );
      router.refresh();
      onSuccess?.();
    } else {
      const errorMsg = result.error || (gameDayToEdit ? "Erro ao atualizar dia de jogos" : "Erro ao criar dia de jogos");
      setError(errorMsg);
      toast.showToast(errorMsg, "error");
    }
    
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" aria-label="Formulário de criação de dia de jogos">
      {error && (
        <div 
          className="bg-red-50 border-2 border-red-500 text-red-800 px-4 py-3 rounded-lg font-medium shadow-sm animate-shake"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="date" className="block text-base font-semibold text-gray-900 mb-2">
          Data e Hora *
        </label>
        <input
          id="date"
          type="datetime-local"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
          className="input-mobile"
          aria-required="true"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-base font-semibold text-gray-900 mb-2">
          Descrição (opcional)
        </label>
        <input
          id="description"
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="input-mobile"
        />
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
          value={formData.matchDurationMinutes}
          onChange={(e) => setFormData({ ...formData, matchDurationMinutes: parseInt(e.target.value) || 10 })}
          required
          className="input-mobile"
          aria-required="true"
        />
        <p className="text-sm text-gray-600 mt-1">Tempo máximo de cada partida em minutos (padrão: 10)</p>
      </div>

      <div className="flex gap-3">
        {gameDayToEdit && onCancel && (
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
          className={gameDayToEdit && onCancel ? "flex-1" : "w-full"}
          fullWidth={!gameDayToEdit || !onCancel}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loading size="sm" />
              {gameDayToEdit ? "Atualizando..." : "Criando..."}
            </span>
          ) : (
            gameDayToEdit ? "Atualizar Dia de Jogos" : "Criar Dia de Jogos"
          )}
        </Button>
      </div>
    </form>
  );
}

