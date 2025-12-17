"use client";

import Link from "next/link";
import { deleteGameDay } from "@/lib/actions/gameDays";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./Button";
import { ConfirmDialog } from "./ConfirmDialog";
import { useToast } from "./ToastProvider";

interface GameDayCardProps {
  id: string;
  date: Date;
  description: string | null;
  isOpen: boolean;
  matchesCount: number;
  finishedMatches: number;
}

export function GameDayCard({
  id,
  date,
  description,
  isOpen,
  matchesCount,
  finishedMatches,
}: GameDayCardProps) {
  const router = useRouter();
  const toast = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteConfirm(false);
    setIsDeleting(true);

    const result = await deleteGameDay(id);

    if (result.success) {
      toast.showToast("Dia de jogos deletado com sucesso", "success");
      router.refresh();
    } else {
      toast.showToast(result.error || "Erro ao deletar dia de jogos", "error");
      setIsDeleting(false);
    }
  };

  const dateFormatted = date.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <div
        className={`card hover:shadow-xl active:shadow-lg transition-all duration-200 active:scale-[0.99] ${
          isOpen ? "bg-green-50 border-2 border-green-400" : ""
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <Link
            href={`/game-days/${id}`}
            className="flex-1 min-w-0 w-full"
          >
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                {dateFormatted}
              </h3>
              {isOpen && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border-2 border-green-300">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                  Aberto
                </span>
              )}
            </div>
            {description && (
              <p className="body-text text-sm sm:text-base mt-1">{description}</p>
            )}
            <p className="text-secondary mt-2 font-medium">
              {matchesCount} partida{matchesCount !== 1 ? "s" : ""} | {finishedMatches} finalizada{finishedMatches !== 1 ? "s" : ""}
            </p>
          </Link>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href={`/game-days/${id}`}
              className="text-blue-600 text-xl sm:text-2xl font-bold hover:text-blue-700 transition-colors"
            >
              →
            </Link>
            <Button
              onClick={handleDeleteClick}
              disabled={isDeleting}
              variant="danger"
              size="sm"
              className="text-sm"
            >
              {isDeleting ? "Deletando..." : "Deletar"}
            </Button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Deletar Dia de Jogos"
        message={`Você está prestes a deletar o dia de jogos de ${dateFormatted}. Todas as partidas associadas também serão deletadas. Esta ação não pode ser desfeita. Deseja continuar?`}
        confirmLabel="Sim, Deletar"
        cancelLabel="Cancelar"
        isLoading={isDeleting}
        variant="danger"
      />
    </>
  );
}

