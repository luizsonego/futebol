"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { prisma } from "../prisma";
import { uuidSchema, uuidArraySchema } from "../validations";
import type { ActionResult } from "../types";
import { parseJSON, stringifyJSON, type QueueTeamIds } from "../utils/json";

/**
 * Inicializa ou obtém a fila de times para um dia de jogos
 */
export async function getQueue(gameDayId: string): Promise<ActionResult> {
  try {
    uuidSchema.parse(gameDayId);
    let queue = await prisma.queue.findUnique({
      where: { gameDayId },
    });

    if (!queue) {
      // Se não existe fila, cria uma vazia
      queue = await prisma.queue.create({
        data: {
          gameDayId,
          teamIds: stringifyJSON<QueueTeamIds>([]),
        },
      });
    }

    const teamIds = parseJSON<QueueTeamIds>(queue.teamIds, []);
    return { success: true, data: { id: queue.id, teamIds } };
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
      error: error instanceof Error ? error.message : "Erro ao buscar fila",
    };
  }
}

/**
 * Adiciona times à fila
 */
export async function addTeamsToQueue(
  gameDayId: string,
  teamIds: string[]
): Promise<ActionResult> {
  try {
    uuidSchema.parse(gameDayId);
    uuidArraySchema.parse(teamIds);

    let queue = await prisma.queue.findUnique({
      where: { gameDayId },
    });

    const currentTeamIds = queue
      ? parseJSON<QueueTeamIds>(queue.teamIds, [])
      : [];

    // Adiciona apenas times que ainda não estão na fila
    const newTeamIds = teamIds.filter((id) => !currentTeamIds.includes(id));
    const updatedTeamIds = [...currentTeamIds, ...newTeamIds];

    if (queue) {
      await prisma.queue.update({
        where: { id: queue.id },
        data: {
          teamIds: stringifyJSON<QueueTeamIds>(updatedTeamIds),
        },
      });
    } else {
      await prisma.queue.create({
        data: {
          gameDayId,
          teamIds: stringifyJSON<QueueTeamIds>(updatedTeamIds),
        },
      });
    }

    revalidatePath(`/game-days/${gameDayId}`);
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
        error instanceof Error ? error.message : "Erro ao adicionar times à fila",
    };
  }
}

/**
 * Remove um time da fila
 */
export async function removeTeamFromQueue(
  gameDayId: string,
  teamId: string
): Promise<ActionResult> {
  try {
    uuidSchema.parse(gameDayId);
    uuidSchema.parse(teamId);

    const queue = await prisma.queue.findUnique({
      where: { gameDayId },
    });

    if (!queue) {
      return { success: false, error: "Fila não encontrada" };
    }

    const currentTeamIds = parseJSON<QueueTeamIds>(queue.teamIds, []);
    const updatedTeamIds = currentTeamIds.filter((id) => id !== teamId);

    await prisma.queue.update({
      where: { id: queue.id },
      data: {
        teamIds: stringifyJSON<QueueTeamIds>(updatedTeamIds),
      },
    });

    revalidatePath(`/game-days/${gameDayId}`);
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
        error instanceof Error ? error.message : "Erro ao remover time da fila",
    };
  }
}

/**
 * Atualiza a ordem da fila
 */
export async function updateQueueOrder(
  gameDayId: string,
  teamIds: string[]
): Promise<ActionResult> {
  try {
    uuidSchema.parse(gameDayId);
    // Permite array vazio para limpar a fila
    if (teamIds.length > 0) {
      uuidArraySchema.parse(teamIds);
    }

    let queue = await prisma.queue.findUnique({
      where: { gameDayId },
    });

    if (queue) {
      await prisma.queue.update({
        where: { id: queue.id },
        data: {
          teamIds: stringifyJSON<QueueTeamIds>(teamIds),
        },
      });
    } else {
      await prisma.queue.create({
        data: {
          gameDayId,
          teamIds: stringifyJSON<QueueTeamIds>(teamIds),
        },
      });
    }

    revalidatePath(`/game-days/${gameDayId}`);
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
        error instanceof Error ? error.message : "Erro ao atualizar ordem da fila",
    };
  }
}

