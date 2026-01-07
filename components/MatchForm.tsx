"use client";

import { useState, useRef, useEffect } from "react";
import { createMatch } from "@/lib/actions/matches";
import { useRouter } from "next/navigation";
import { Button } from "./Button";
import { useToast } from "./ToastProvider";
import { Loading } from "./Loading";

interface MatchFormProps {
  gameDayId: string;
  teams: Array<{ id: string; name: string; primaryColor: string; secondaryColor: string }>;
}

interface TeamSelectProps {
  id: string;
  label: string;
  value: string;
  teams: Array<{ id: string; name: string; primaryColor: string; secondaryColor: string }>;
  excludeTeamId?: string;
  onChange: (teamId: string) => void;
  disabled?: boolean;
}

function TeamSelect({ id, label, value, teams, excludeTeamId, onChange, disabled }: TeamSelectProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedTeam = teams.find((t) => t.id === value);

  // Filtra times excluindo o time já selecionado no outro campo
  const availableTeams = teams.filter((team) => team.id !== excludeTeamId);

  // Filtra times pela busca
  const filteredTeams = availableTeams.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Quando o select é aberto, foca no input
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Fecha o dropdown quando clica fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setFocusedIndex(-1);
    if (!isOpen) setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    setSearchTerm("");
  };

  const handleSelectTeam = (teamId: string) => {
    onChange(teamId);
    setIsOpen(false);
    setSearchTerm("");
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isOpen && focusedIndex >= 0 && filteredTeams[focusedIndex]) {
      e.preventDefault();
      handleSelectTeam(filteredTeams[focusedIndex].id);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (isOpen) {
        setFocusedIndex((prev) =>
          prev < filteredTeams.length - 1 ? prev + 1 : prev
        );
      } else {
        setIsOpen(true);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (isOpen) {
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setSearchTerm("");
      setFocusedIndex(-1);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative">
      <label htmlFor={id} className="block text-base font-semibold text-gray-900 mb-2">
        {label} *
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={isOpen ? searchTerm : selectedTeam?.name || ""}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder="Digite para buscar..."
          disabled={disabled}
          className="input-mobile pr-10"
          aria-required="true"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={`${id}-dropdown`}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {isOpen && filteredTeams.length > 0 && (
        <div
          ref={dropdownRef}
          id={`${id}-dropdown`}
          className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
          role="listbox"
        >
          {filteredTeams.map((team, index) => (
            <button
              key={team.id}
              type="button"
              onClick={() => handleSelectTeam(team.id)}
              className={`w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors ${index === focusedIndex ? "bg-blue-50" : ""
                } ${value === team.id ? "bg-blue-100 font-semibold" : ""}`}
              role="option"
              aria-selected={value === team.id}
            >
              {team.name}
            </button>
          ))}
        </div>
      )}

      {isOpen && filteredTeams.length === 0 && searchTerm && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500"
        >
          Nenhum time encontrado
        </div>
      )}
    </div>
  );
}

type TabType = "select" | "color";

export function MatchForm({ gameDayId, teams }: MatchFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<TabType>("select");
  const [formData, setFormData] = useState({
    team1Id: "",
    team2Id: "",
  });
  const [colorSelection, setColorSelection] = useState<{
    team1Id: string | null;
    team2Id: string | null;
  }>({
    team1Id: null,
    team2Id: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createMatchAction = async (team1Id: string, team2Id: string) => {
    setIsSubmitting(true);
    setError(null);

    const result = await createMatch({
      gameDayId,
      team1Id,
      team2Id,
      goalsTeam1: 0,
      goalsTeam2: 0,
      status: "scheduled",
    });

    if (result.success) {
      setFormData({ team1Id: "", team2Id: "" });
      setColorSelection({ team1Id: null, team2Id: null });
      toast.showToast("Partida criada com sucesso! ⚽", "success");
      router.refresh();
    } else {
      const errorMsg = result.error || "Erro ao criar partida";
      setError(errorMsg);
      toast.showToast(errorMsg, "error");
    }

    setIsSubmitting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMatchAction(formData.team1Id, formData.team2Id);
  };

  const handleColorTeamClick = (teamId: string) => {
    if (isSubmitting) return;

    // Se já está selecionado, deseleciona
    if (colorSelection.team1Id === teamId) {
      setColorSelection({ team1Id: null, team2Id: colorSelection.team2Id });
      return;
    }
    if (colorSelection.team2Id === teamId) {
      setColorSelection({ team1Id: colorSelection.team1Id, team2Id: null });
      return;
    }

    // Não permite selecionar o mesmo time duas vezes
    if (colorSelection.team1Id === teamId || colorSelection.team2Id === teamId) {
      return;
    }

    // Seleciona o primeiro time se ainda não foi selecionado
    if (!colorSelection.team1Id) {
      setColorSelection({ team1Id: teamId, team2Id: null });
      return;
    }

    // Seleciona o segundo time e cria a partida automaticamente
    if (!colorSelection.team2Id) {
      setColorSelection({ team1Id: colorSelection.team1Id, team2Id: teamId });
      // Cria a partida automaticamente após um pequeno delay para feedback visual
      setTimeout(() => {
        createMatchAction(colorSelection.team1Id!, teamId);
      }, 200);
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    // Limpa seleções ao trocar de aba
    if (tab === "select") {
      setColorSelection({ team1Id: null, team2Id: null });
    } else {
      setFormData({ team1Id: "", team2Id: "" });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Tabs */}
      <div className="flex border-b-2 border-gray-200">
        <button
          type="button"
          onClick={() => handleTabChange("select")}
          className={`flex-1 px-4 py-3 text-sm sm:text-base font-semibold transition-colors ${activeTab === "select"
            ? "text-blue-600 border-b-2 border-blue-600 -mb-[2px]"
            : "text-gray-600 hover:text-gray-900"
            }`}
        >
          Por Select
        </button>
        <button
          type="button"
          onClick={() => handleTabChange("color")}
          className={`flex-1 px-4 py-3 text-sm sm:text-base font-semibold transition-colors ${activeTab === "color"
            ? "text-blue-600 border-b-2 border-blue-600 -mb-[2px]"
            : "text-gray-600 hover:text-gray-900"
            }`}
        >
          Por Cor
        </button>
      </div>

      {error && (
        <div
          className="bg-red-50 border-2 border-red-500 text-red-800 px-4 py-3 rounded-lg font-medium shadow-sm animate-shake"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}

      {activeTab === "select" ? (
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" aria-label="Formulário de criação de partida">
          <TeamSelect
            id="team1Id"
            label="Time 1"
            value={formData.team1Id}
            teams={teams}
            excludeTeamId={formData.team2Id}
            onChange={(teamId) => setFormData({ ...formData, team1Id: teamId })}
            disabled={isSubmitting}
          />

          <TeamSelect
            id="team2Id"
            label="Time 2"
            value={formData.team2Id}
            teams={teams}
            excludeTeamId={formData.team1Id}
            onChange={(teamId) => setFormData({ ...formData, team2Id: teamId })}
            disabled={isSubmitting}
          />

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
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            {colorSelection.team1Id && !colorSelection.team2Id ? (
              <p className="font-medium text-blue-600">
                Selecione o segundo time para criar a partida automaticamente
              </p>
            ) : !colorSelection.team1Id ? (
              <p>Clique em um time para selecionar o primeiro time</p>
            ) : (
              <p className="font-medium text-green-600">Criando partida...</p>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {teams.map((team) => {
              const isSelected1 = colorSelection.team1Id === team.id;
              const isSelected2 = colorSelection.team2Id === team.id;
              const isSelected = isSelected1 || isSelected2;

              return (
                <button
                  key={team.id}
                  type="button"
                  onClick={() => handleColorTeamClick(team.id)}
                  disabled={isSubmitting}
                  className={`
                    relative px-4 py-3 rounded-lg font-semibold text-sm sm:text-base
                    transition-all duration-200 transform
                    ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95"}
                    ${isSelected1 ? "ring-4 ring-blue-400 ring-offset-2" : ""}
                    ${isSelected2 ? "ring-4 ring-green-400 ring-offset-2" : ""}
                    shadow-md hover:shadow-lg
                  `}
                  style={{
                    backgroundColor: team.primaryColor,
                    color: team.secondaryColor,
                  }}
                >
                  {team.name}
                  {isSelected1 && (
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      1
                    </span>
                  )}
                  {isSelected2 && (
                    <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      2
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {(colorSelection.team1Id || colorSelection.team2Id) && (
            <div className="pt-2">
              <Button
                type="button"
                onClick={() => setColorSelection({ team1Id: null, team2Id: null })}
                disabled={isSubmitting}
                variant="secondary"
                size="md"
                fullWidth
              >
                Limpar Seleção
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

