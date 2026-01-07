"use client";

import { deleteTeam } from "@/lib/actions/teams";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./Button";

interface TeamCardProps {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  onDeleted?: () => void;
  onEdit?: () => void;
}

/**
 * Componente de card para exibir informações de um time
 * Responsável apenas pela UI e interação do usuário
 */
export function TeamCard({ id, name, primaryColor, secondaryColor, onDeleted, onEdit }: TeamCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm(`Tem certeza que deseja deletar o time "${name}"?`)) return;
    
    setIsDeleting(true);
    setError(null);
    
    // Chama a Server Action para deletar
    const result = await deleteTeam(id);
    
    if (result.success) {
      router.refresh();
      onDeleted?.();
    } else {
      setError(result.error || "Erro ao deletar time");
      setIsDeleting(false);
    }
  };

  return (
    <div className="card">
      {error && (
        <div 
          className="mb-4 bg-red-50 border-2 border-red-500 text-red-800 px-4 py-3 rounded-lg text-sm font-medium"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0 w-full sm:w-auto">
          <div
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-bold text-xl sm:text-2xl flex-shrink-0 shadow-md"
            style={{
              backgroundColor: primaryColor,
              color: secondaryColor,
            }}
            aria-hidden="true"
          >
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg sm:text-xl text-gray-900 truncate">{name}</h3>
            <div className="flex gap-3 mt-2">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-5 h-5 rounded border-2 border-gray-400 shadow-sm"
                  style={{ backgroundColor: primaryColor }}
                  aria-label="Cor primária"
                />
                <span className="text-xs sm:text-sm text-gray-700 font-medium">Primária</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className="w-5 h-5 rounded border-2 border-gray-400 shadow-sm"
                  style={{ backgroundColor: secondaryColor }}
                  aria-label="Cor secundária"
                />
                <span className="text-xs sm:text-sm text-gray-700 font-medium">Secundária</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {onEdit && (
            <Button
              onClick={onEdit}
              disabled={isDeleting}
              variant="secondary"
              size="md"
              className="flex-1 sm:flex-none"
            >
              Editar
            </Button>
          )}
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            variant="danger"
            size="md"
            className="flex-1 sm:flex-none"
          >
            {isDeleting ? "Deletando..." : "Deletar"}
          </Button>
        </div>
      </div>
    </div>
  );
}

