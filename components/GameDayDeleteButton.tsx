"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteGameDay } from "@/lib/actions/gameDays";
import { Button } from "./Button";
import { ConfirmDialog } from "./ConfirmDialog";
import { useToast } from "./ToastProvider";

interface GameDayDeleteButtonProps {
  gameDayId: string;
  gameDayDate: Date;
  matchesCount: number;
}

export function GameDayDeleteButton({
  gameDayId,
  gameDayDate,
  matchesCount,
}: GameDayDeleteButtonProps) {
  const router = useRouter();
  const toast = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteConfirm(false);
    setIsDeleting(true);

    const result = await deleteGameDay(gameDayId);

    if (result.success) {
      toast.showToast("Dia de jogos deletado com sucesso", "success");
      router.push("/game-days");
    } else {
      toast.showToast(result.error || "Erro ao deletar dia de jogos", "error");
      setIsDeleting(false);
    }
  };

  const dateFormatted = gameDayDate.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Button
        onClick={handleDeleteClick}
        disabled={isDeleting}
        variant="danger"
        size="md"
        fullWidth
        className="sm:w-auto"
      >
        {isDeleting ? "Deletando..." : "Deletar Dia de Jogos"}
      </Button>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Deletar Dia de Jogos"
        message={`Você está prestes a deletar o dia de jogos de ${dateFormatted}. ${matchesCount > 0 ? `Todas as ${matchesCount} partida(s) associada(s) também serão deletadas. ` : ""}Esta ação não pode ser desfeita. Deseja continuar?`}
        confirmLabel="Sim, Deletar"
        cancelLabel="Cancelar"
        isLoading={isDeleting}
        variant="danger"
      />
    </>
  );
}

