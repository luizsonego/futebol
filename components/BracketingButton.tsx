"use client";

import { useState } from "react";
import { createAutomaticBracketing } from "@/lib/actions/bracketing";
import { useRouter } from "next/navigation";
import { Button } from "./Button";
import { useToast } from "./ToastProvider";
import { Loading } from "./Loading";

interface BracketingButtonProps {
  gameDayId: string;
}

export function BracketingButton({ gameDayId }: BracketingButtonProps) {
  const router = useRouter();
  const toast = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!confirm("Isso irá criar partidas balanceadas (round-robin) respeitando o período de 2 horas. Todos os times jogarão aproximadamente o mesmo número de partidas. Deseja continuar?")) {
      return;
    }

    setIsGenerating(true);
    setError(null);

    const result = await createAutomaticBracketing(gameDayId);
    
    if (result.success) {
      toast.showToast("Chaveamento gerado com sucesso! 🎯", "success");
      router.refresh();
    } else {
      const errorMsg = result.error || "Erro ao gerar chaveamento";
      setError(errorMsg);
      toast.showToast(errorMsg, "error");
    }
    
    setIsGenerating(false);
  };

  return (
    <div>
      {error && (
        <div 
          className="bg-red-50 border-2 border-red-500 text-red-800 px-4 py-3 rounded-lg font-medium shadow-sm mb-4 animate-shake"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}
      <Button
        onClick={handleGenerate}
        disabled={isGenerating}
        variant="success"
        size="md"
        fullWidth
      >
        {isGenerating ? (
          <span className="flex items-center justify-center gap-2">
            <Loading size="sm" />
            Gerando...
          </span>
        ) : (
          "Gerar Chaveamento Automático"
        )}
      </Button>
    </div>
  );
}

