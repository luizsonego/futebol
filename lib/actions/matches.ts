"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { prisma } from "../prisma";
import {
  matchSchema,
  updateMatchGoalsSchema,
  uuidSchema,
  replaceTeamsSchema,
  type MatchInput,
  type UpdateMatchGoalsInput,
  type ReplaceTeamsInput,
} from "../validations";
import { updateTeamScores } from "../scoring";
import type { ActionResult } from "../types";

export async function createMatch(data: MatchInput): Promise<ActionResult> {
  try {
    const validated = matchSchema.parse(data);

    // Verificar se o dia de jogos está aberto
    const gameDay = await prisma.gameDay.findUnique({
      where: { id: validated.gameDayId },
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
        error: "Não é possível criar partidas em um dia de jogos encerrado",
      };
    }

    const match = await prisma.match.create({
      data: validated,
      include: {
        team1: true,
        team2: true,
        gameDay: true,
      },
    });
    revalidatePath("/game-days");
    revalidatePath("/matches");
    revalidatePath("/standings");
    return { success: true, data: match };
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
      error: error instanceof Error ? error.message : "Erro ao criar partida",
    };
  }
}

export async function getMatches(): Promise<ActionResult> {
  try {
    const matches = await prisma.match.findMany({
      include: {
        team1: true,
        team2: true,
        gameDay: true,
      },
      orderBy: [
        { gameDay: { date: "desc" } },
        { createdAt: "asc" },
      ],
    });
    return { success: true, data: matches };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao buscar partidas",
    };
  }
}

export async function updateMatchGoals(
  data: UpdateMatchGoalsInput
): Promise<ActionResult> {
  try {
    const validated = updateMatchGoalsSchema.parse(data);

    const match = await prisma.match.update({
      where: { id: validated.matchId },
      data: {
        goalsTeam1: validated.goalsTeam1,
        goalsTeam2: validated.goalsTeam2,
        status: "in_progress",
      },
      include: {
        team1: true,
        team2: true,
      },
    });
    revalidatePath("/game-days");
    revalidatePath("/matches");
    revalidatePath("/standings");
    return { success: true, data: match };
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
      error: error instanceof Error ? error.message : "Erro ao atualizar gols",
    };
  }
}

export async function startMatch(matchId: string): Promise<ActionResult> {
  try {
    uuidSchema.parse(matchId);
    const match = await prisma.match.update({
      where: { id: matchId },
      data: {
        status: "in_progress",
        startedAt: new Date(),
      },
      include: {
        team1: true,
        team2: true,
        gameDay: true,
      },
    });
    revalidatePath("/game-days");
    revalidatePath("/matches");
    return { success: true, data: match };
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
      error: error instanceof Error ? error.message : "Erro ao iniciar partida",
    };
  }
}

export async function finishMatch(
  matchId: string,
  goalsTeam1: number,
  goalsTeam2: number
): Promise<ActionResult> {
  try {
    const validated = updateMatchGoalsSchema.parse({
      matchId,
      goalsTeam1,
      goalsTeam2,
    });

    // Busca a partida para obter os IDs dos times
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      return {
        success: false,
        error: "Partida não encontrada",
      };
    }

    // Calcula o tempo cronometrado da partida
    const endedAt = new Date();
    let actualDurationMinutes: number | null = null;
    
    if (match.startedAt) {
      const durationMs = endedAt.getTime() - new Date(match.startedAt).getTime();
      actualDurationMinutes = Math.round((durationMs / 1000 / 60) * 100) / 100; // Arredonda para 2 casas decimais
    }

    // Atualiza a partida e os scores dos times
    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: {
        status: "finished",
        goalsTeam1: validated.goalsTeam1,
        goalsTeam2: validated.goalsTeam2,
        endedAt,
        actualDurationMinutes,
      },
    });

    // Atualiza a pontuação e gols dos times
    await updateTeamScores(
      match.team1Id,
      match.team2Id,
      validated.goalsTeam1,
      validated.goalsTeam2
    );

    revalidatePath("/game-days");
    revalidatePath("/matches");
    revalidatePath("/standings");
    return { success: true, data: updatedMatch };
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
        error instanceof Error ? error.message : "Erro ao finalizar partida",
    };
  }
}

export async function deleteMatch(id: string): Promise<ActionResult> {
  try {
    uuidSchema.parse(id);
    await prisma.match.delete({
      where: { id },
    });
    revalidatePath("/game-days");
    revalidatePath("/matches");
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
      error: error instanceof Error ? error.message : "Erro ao deletar partida",
    };
  }
}

export async function replaceTeamsInMatch(
  matchId: string,
  teamOutId: string,
  teamInId: string
): Promise<ActionResult> {
  try {
    const validated = replaceTeamsSchema.parse({
      matchId,
      teamOutId,
      teamInId,
    });

    const match = await prisma.match.findUnique({
      where: { id: validated.matchId },
      include: { gameDay: true },
    });

    if (!match) {
      return {
        success: false,
        error: "Partida não encontrada",
      };
    }

    if (match.status !== "finished") {
      return {
        success: false,
        error: "Apenas partidas finalizadas podem ter times substituídos",
      };
    }

    if (!match.gameDay.isOpen) {
      return {
        success: false,
        error:
          "Não é possível criar novas partidas em um dia de jogos encerrado",
      };
    }

    // Valida que o time que sai é um dos times da partida
    if (
      validated.teamOutId !== match.team1Id &&
      validated.teamOutId !== match.team2Id
    ) {
      return {
        success: false,
        error: "O time que sai deve ser um dos times da partida",
      };
    }

    // Valida que o time que entra é diferente dos times da partida atual
    if (
      validated.teamInId === match.team1Id ||
      validated.teamInId === match.team2Id
    ) {
      return {
        success: false,
        error:
          "O time que entra deve ser diferente dos times da partida atual",
      };
    }

    // Determina qual time permanece
    const remainingTeamId =
      match.team1Id === validated.teamOutId ? match.team2Id : match.team1Id;

    // Cria nova partida com os times atualizados
    const newMatch = await prisma.match.create({
      data: {
        gameDayId: match.gameDayId,
        team1Id: remainingTeamId,
        team2Id: validated.teamInId,
        status: "scheduled",
        goalsTeam1: 0,
        goalsTeam2: 0,
      },
      include: {
        team1: true,
        team2: true,
        gameDay: true,
      },
    });

    revalidatePath("/game-days");
    revalidatePath(`/game-days/${match.gameDayId}`);
    revalidatePath("/matches");
    return { success: true, data: newMatch };
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
      error: error instanceof Error ? error.message : "Erro ao substituir times",
    };
  }
}

