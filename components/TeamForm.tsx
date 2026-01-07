"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createTeam, updateTeam } from "@/lib/actions/teams";
import { type TeamInput } from "@/lib/validations";
import { Button } from "./Button";
import { useToast } from "./ToastProvider";
import { Loading } from "./Loading";

interface TeamFormProps {
  onSuccess?: () => void;
  teamToEdit?: {
    id: string;
    name: string;
    primaryColor: string;
    secondaryColor: string;
  } | null;
  onCancel?: () => void;
}

/**
 * Componente de formulário para cadastro e edição de times
 * Responsável apenas pela UI e interação do usuário
 */
export function TeamForm({ onSuccess, teamToEdit, onCancel }: TeamFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [formData, setFormData] = useState<TeamInput>({
    name: "",
    primaryColor: "#000000",
    secondaryColor: "#FFFFFF",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Preencher formulário quando estiver editando
  useEffect(() => {
    if (teamToEdit) {
      setFormData({
        name: teamToEdit.name,
        primaryColor: teamToEdit.primaryColor,
        secondaryColor: teamToEdit.secondaryColor,
      });
    } else {
      setFormData({
        name: "",
        primaryColor: "#000000",
        secondaryColor: "#FFFFFF",
      });
    }
  }, [teamToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Chama a Server Action para persistência (validação ocorre no servidor)
    const result = teamToEdit
      ? await updateTeam(teamToEdit.id, formData)
      : await createTeam(formData);
    
    if (result.success) {
      if (!teamToEdit) {
        setFormData({ name: "", primaryColor: "#000000", secondaryColor: "#FFFFFF" });
      }
      toast.showToast(
        teamToEdit ? "Time atualizado com sucesso! ✓" : "Time criado com sucesso! ✓",
        "success"
      );
      router.refresh();
      onSuccess?.();
    } else {
      const errorMsg = result.error || (teamToEdit ? "Erro ao atualizar time" : "Erro ao criar time");
      setError(errorMsg);
      toast.showToast(errorMsg, "error");
    }
    
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" aria-label="Formulário de cadastro de time">
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
        <label htmlFor="name" className="block text-base font-semibold text-gray-900 mb-2">
          Nome do Time *
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            setError(null);
          }}
          required
          maxLength={100}
          placeholder="Ex: Flamengo"
          className="input-mobile"
          aria-describedby="name-help"
          aria-required="true"
        />
        <p id="name-help" className="text-xs text-gray-600 mt-1.5">Máximo de 100 caracteres</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="primaryColor" className="block text-base font-semibold text-gray-900 mb-2">
            Cor Primária *
          </label>
          <div className="flex gap-2">
            <input
              id="primaryColor"
              type="color"
              value={formData.primaryColor}
              onChange={(e) => {
                setFormData({ ...formData, primaryColor: e.target.value.toUpperCase() });
                setError(null);
              }}
              className="h-12 w-16 sm:w-20 border-2 border-gray-300 rounded-lg cursor-pointer flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Seletor de cor primária"
              aria-required="true"
            />
            <input
              type="text"
              value={formData.primaryColor}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                setFormData({ ...formData, primaryColor: value });
                setError(null);
              }}
              pattern="^#[0-9A-Fa-f]{6}$"
              placeholder="#000000"
              className="input-mobile flex-1"
              aria-label="Código hexadecimal da cor primária"
              aria-describedby="primaryColor-help"
            />
            <span id="primaryColor-help" className="sr-only">Formato: #RRGGBB (exemplo: #FF0000 para vermelho)</span>
          </div>
        </div>

        <div>
          <label htmlFor="secondaryColor" className="block text-base font-semibold text-gray-900 mb-2">
            Cor Secundária *
          </label>
          <div className="flex gap-2">
            <input
              id="secondaryColor"
              type="color"
              value={formData.secondaryColor}
              onChange={(e) => {
                setFormData({ ...formData, secondaryColor: e.target.value.toUpperCase() });
                setError(null);
              }}
              className="h-12 w-16 sm:w-20 border-2 border-gray-300 rounded-lg cursor-pointer flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Seletor de cor secundária"
              aria-required="true"
            />
            <input
              type="text"
              value={formData.secondaryColor}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                setFormData({ ...formData, secondaryColor: value });
                setError(null);
              }}
              pattern="^#[0-9A-Fa-f]{6}$"
              placeholder="#FFFFFF"
              className="input-mobile flex-1"
              aria-label="Código hexadecimal da cor secundária"
              aria-describedby="secondaryColor-help"
            />
            <span id="secondaryColor-help" className="sr-only">Formato: #RRGGBB (exemplo: #FFFFFF para branco)</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        {teamToEdit && onCancel && (
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
          disabled={isSubmitting || !formData.name.trim()}
          variant="primary"
          size="md"
          className={teamToEdit && onCancel ? "flex-1" : "w-full"}
          fullWidth={!teamToEdit || !onCancel}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loading size="sm" />
              {teamToEdit ? "Atualizando..." : "Criando..."}
            </span>
          ) : (
            teamToEdit ? "Atualizar Time" : "Criar Time"
          )}
        </Button>
      </div>
    </form>
  );
}

