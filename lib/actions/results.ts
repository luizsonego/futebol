"use server";

import { prisma } from "../prisma";
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

