"use client";

import { useEffect } from "react";
import { ResultEditForm } from "./ResultEditForm";
import { type TeamResult } from "@/lib/actions/results";

interface EditResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: TeamResult | null;
}

/**
 * Modal para editar resultados de um time
 */
export function EditResultModal({
  isOpen,
  onClose,
  team,
}: EditResultModalProps) {
  // Fechar ao pressionar ESC
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevenir scroll do body quando o modal está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !team) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-50 animate-slide-up"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-result-title"
      >
        <div
          className="bg-white rounded-lg shadow-2xl max-w-md w-full border-2 border-blue-200 animate-bounce-in pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-blue-50 px-6 py-4 border-b border-blue-200">
            <h3
              id="edit-result-title"
              className="text-lg font-bold text-gray-900"
            >
              Editar Resultado
            </h3>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <ResultEditForm
              teamId={team.id}
              teamName={team.name}
              currentPoints={team.points}
              currentGoals={team.goals}
              onSuccess={onClose}
              onCancel={onClose}
            />
          </div>
        </div>
      </div>
    </>
  );
}

