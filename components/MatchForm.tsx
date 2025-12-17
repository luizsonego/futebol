"use client";

import { useState } from "react";
import { createMatch } from "@/lib/actions/matches";
import { useRouter } from "next/navigation";
import { Button } from "./Button";
import { useToast } from "./ToastProvider";
import { Loading } from "./Loading";

interface MatchFormProps {
  gameDayId: string;
  teams: Array<{ id: string; name: string }>;
}

export function MatchForm({ gameDayId, teams }: MatchFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [formData, setFormData] = useState({
    team1Id: "",
    team2Id: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const result = await createMatch({
      gameDayId,
      team1Id: formData.team1Id,
      team2Id: formData.team2Id,
      goalsTeam1: 0,
      goalsTeam2: 0,
      status: "scheduled",
    });
    
    if (result.success) {
      setFormData({ team1Id: "", team2Id: "" });
      toast.showToast("Partida criada com sucesso! ⚽", "success");
      router.refresh();
    } else {
      const errorMsg = result.error || "Erro ao criar partida";
      setError(errorMsg);
      toast.showToast(errorMsg, "error");
    }
    
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" aria-label="Formulário de criação de partida">
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
        <label htmlFor="team1Id" className="block text-base font-semibold text-gray-900 mb-2">
          Time 1 *
        </label>
        <select
          id="team1Id"
          value={formData.team1Id}
          onChange={(e) => setFormData({ ...formData, team1Id: e.target.value })}
          required
          className="input-mobile"
          aria-required="true"
        >
          <option value="">Selecione um time</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="team2Id" className="block text-base font-semibold text-gray-900 mb-2">
          Time 2 *
        </label>
        <select
          id="team2Id"
          value={formData.team2Id}
          onChange={(e) => setFormData({ ...formData, team2Id: e.target.value })}
          required
          className="input-mobile"
          aria-required="true"
        >
          <option value="">Selecione um time</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || !formData.team1Id || !formData.team2Id}
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
          "Criar Partida"
        )}
      </Button>
    </form>
  );
}

