"use client";

import { useState } from "react";
import { createGameDay } from "@/lib/actions/gameDays";
import { useRouter } from "next/navigation";
import { Button } from "./Button";
import { useToast } from "./ToastProvider";
import { Loading } from "./Loading";

export function GameDayForm() {
  const router = useRouter();
  const toast = useToast();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 16),
    description: "",
    matchDurationMinutes: 10,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const result = await createGameDay({
      date: new Date(formData.date).toISOString(),
      description: formData.description || undefined,
      matchDurationMinutes: formData.matchDurationMinutes,
    });
    
    if (result.success) {
      setFormData({ date: new Date().toISOString().slice(0, 16), description: "", matchDurationMinutes: 10 });
      toast.showToast("Dia de jogos criado com sucesso! 📅", "success");
      router.refresh();
    } else {
      const errorMsg = result.error || "Erro ao criar dia de jogos";
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

      <Button
        type="submit"
        disabled={isSubmitting}
        variant="primary"
        size="md"
        fullWidth
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loading size="sm" />
            Criando...
          </span>
        ) : (
          "Criar Dia de Jogos"
        )}
      </Button>
    </form>
  );
}

