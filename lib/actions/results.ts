"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { prisma } from "../prisma";
import { updateTeamResultSchema, type UpdateTeamResultInput } from "../validations";
import type { ActionResult } from "../types";

export interface TeamResult {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  points: number;
  goals: number; // gols marcados
}

/**
 * Busca todos os times com seus pontos e gols, ordenados por pontos e depois por gols
 */
export async function getResults(): Promise<ActionResult<TeamResult[]>> {
  try {
    const teams = await prisma.team.findMany({
      select: {
        id: true,
        name: true,
        primaryColor: true,
        secondaryColor: true,
        points: true,
        goalsScored: true,
      },
    });

    // Mapeia para o formato esperado
    const results: TeamResult[] = teams.map((team) => ({
      id: team.id,
      name: team.name,
      primaryColor: team.primaryColor,
      secondaryColor: team.secondaryColor,
      points: team.points,
      goals: team.goalsScored,
    }));

    // Ordena por: 1. Pontos (desc), 2. Gols (desc)
    results.sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      return b.goals - a.goals;
    });

    return { success: true, data: results };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao buscar resultados",
    };
  }
}

/**
 * Reseta todos os resultados (zera pontos e gols de todos os times)
 */
export async function resetAllResults(): Promise<ActionResult> {
  try {
    await prisma.team.updateMany({
      data: {
        points: 0,
        goalsScored: 0,
        goalsConceded: 0,
      },
    });

    revalidatePath("/resultados");
    revalidatePath("/standings");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao resetar resultados",
    };
  }
}

/**
 * Atualiza manualmente os pontos e gols marcados de um time
 */
export async function updateTeamResult(
  data: UpdateTeamResultInput
): Promise<ActionResult> {
  try {
    const validated = updateTeamResultSchema.parse(data);

    // Verifica se o time existe
    const team = await prisma.team.findUnique({
      where: { id: validated.teamId },
    });

    if (!team) {
      return {
        success: false,
        error: "Time não encontrado",
      };
    }

    // Atualiza o time
    await prisma.team.update({
      where: { id: validated.teamId },
      data: {
        points: validated.points,
        goalsScored: validated.goalsScored,
        // Mantém goalsConceded como está, pois não faz parte da edição manual
      },
    });

    revalidatePath("/resultados");
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
      error: error instanceof Error ? error.message : "Erro ao atualizar resultado",
    };
  }
}

