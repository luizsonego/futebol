"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { prisma } from "../prisma";
import { gameDaySchema, uuidSchema, type GameDayInput } from "../validations";
import {
  determineChampion,
  calculateStandingsByGameDay,
  type FinalStandingsData,
} from "../utils/standings";
import type { ActionResult } from "../types";
import { stringifyJSON } from "../utils/json";

export async function getOpenGameDay(): Promise<ActionResult> {
  try {
    const openGameDay = await prisma.gameDay.findFirst({
      where: { isOpen: true },
      include: {
        matches: {
          include: {
            team1: true,
            team2: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: openGameDay };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erro ao buscar dia de jogos aberto",
    };
  }
}

export async function startGameDay(matchDurationMinutes?: number): Promise<ActionResult> {
  try {
    // Verificar se já existe um dia aberto
    const existingOpenDay = await prisma.gameDay.findFirst({
      where: { isOpen: true },
    });

    if (existingOpenDay) {
      return {
        success: false,
        error:
          "Já existe um dia de jogos aberto. Encerre-o antes de criar um novo.",
      };
    }

    // Validar o tempo da partida
    const duration = matchDurationMinutes ?? 10;
    if (duration < 1 || duration > 120) {
      return {
        success: false,
        error: "O tempo da partida deve estar entre 1 e 120 minutos",
      };
    }

    // Criar novo dia de jogos aberto
    const gameDay = await prisma.gameDay.create({
      data: {
        date: new Date(),
        description: null,
        matchDurationMinutes: duration,
        isOpen: true,
      },
      include: {
        matches: {
          include: {
            team1: true,
            team2: true,
          },
        },
      },
    });
    revalidatePath("/game-days");
    revalidatePath("/");
    return { success: true, data: gameDay };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erro ao iniciar dia de jogos",
    };
  }
}

export async function closeGameDay(id: string): Promise<ActionResult> {
  try {
    // Validação do UUID
    uuidSchema.parse(id);

    // Verificar se o dia de jogos existe e está aberto
    const gameDay = await prisma.gameDay.findUnique({
      where: { id },
      include: {
        matches: true,
      },
    });

    if (!gameDay) {
      return {
        success: false,
        error: "Dia de jogos não encontrado",
      };
    }

    if (!gameDay.isOpen) {
      return {
        success: false,
        error: "Este dia de jogos já está encerrado",
      };
    }

    // Verificar se há partidas em andamento
    const inProgressMatches = gameDay.matches.filter(
      (match) => match.status === "in_progress"
    );

    if (inProgressMatches.length > 0) {
      return {
        success: false,
        error: `Não é possível encerrar o dia de jogos. Existem ${inProgressMatches.length} partida(s) em andamento. Finalize todas as partidas antes de encerrar o dia.`,
      };
    }

    // Calcular ranking final e determinar o campeão
    const finalStandings = await calculateStandingsByGameDay(id);
    const championId = await determineChampion(id);

    // Preparar dados do ranking final (preparado para futuras regras)
    const finalStandingsData: FinalStandingsData = {
      standings: finalStandings,
      championId,
      closedAt: new Date().toISOString(),
    };

    // Atualizar o dia de jogos com informações do encerramento
    const updatedGameDay = await prisma.gameDay.update({
      where: { id },
      data: {
        isOpen: false,
        championId,
        closedAt: new Date(),
        finalStandings: stringifyJSON<FinalStandingsData>(finalStandingsData),
      },
      include: {
        champion: true,
      },
    });

    revalidatePath("/game-days");
    revalidatePath(`/game-days/${id}`);
    revalidatePath("/");
    revalidatePath("/standings");
    return { success: true, data: updatedGameDay };
  } catch (error) {
    if (error instanceof ZodError) {
      const firstError = error.errors[0];
      return {
        success: false,
        error: firstError?.message || "Dados inválidos",
      };
    }
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erro ao encerrar dia de jogos",
    };
  }
}

export async function createGameDay(
  data: GameDayInput
): Promise<ActionResult> {
  try {
    const validated = gameDaySchema.parse(data);
    const gameDay = await prisma.gameDay.create({
      data: {
        date: new Date(validated.date),
        description: validated.description || null,
        matchDurationMinutes: validated.matchDurationMinutes,
        isOpen: false, // Dias criados manualmente começam fechados
      },
    });
    revalidatePath("/game-days");
    return { success: true, data: gameDay };
  } catch (error) {
    if (error instanceof ZodError) {
      const firstError = error.errors[0];
      return {
        success: false,
        error: firstError?.message || "Dados inválidos",
      };
    }
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erro ao criar dia de jogos",
    };
  }
}

export async function getGameDays(): Promise<ActionResult> {
  try {
    const gameDays = await prisma.gameDay.findMany({
      include: {
        matches: {
          include: {
            team1: true,
            team2: true,
          },
        },
        champion: true,
      },
      orderBy: { date: "desc" },
    });
    return { success: true, data: gameDays };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erro ao buscar dias de jogos",
    };
  }
}

export async function getGameDay(id: string): Promise<ActionResult> {
  try {
    uuidSchema.parse(id);
    const gameDay = await prisma.gameDay.findUnique({
      where: { id },
      include: {
        matches: {
          include: {
            team1: true,
            team2: true,
          },
          orderBy: { createdAt: "asc" },
        },
        champion: true,
      },
    });
    return { success: true, data: gameDay };
  } catch (error) {
    if (error instanceof ZodError) {
      const firstError = error.errors[0];
      return {
        success: false,
        error: firstError?.message || "Dados inválidos",
      };
    }
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erro ao buscar dia de jogos",
    };
  }
}

export async function deleteGameDay(id: string): Promise<ActionResult> {
  try {
    uuidSchema.parse(id);
    await prisma.gameDay.delete({
      where: { id },
    });
    revalidatePath("/game-days");
    revalidatePath(`/game-days/${id}`);
    revalidatePath("/");
    revalidatePath("/standings");
    return { success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      const firstError = error.errors[0];
      return {
        success: false,
        error: firstError?.message || "Dados inválidos",
      };
    }
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erro ao deletar dia de jogos",
    };
  }
}

