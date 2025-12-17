"use server";

import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uuidSchema } from "./validations";
import type { ActionResult } from "./types";

/**
 * Configurações do scheduler
 */
const SCHEDULER_CONFIG = {
  TOTAL_TIME_MINUTES: 120, // 2 horas
  MIN_GAME_DURATION_MINUTES: 8,
  MAX_GAME_DURATION_MINUTES: 10,
  AVERAGE_GAME_DURATION_MINUTES: 9, // Média entre 8 e 10
} as const;

/**
 * Gera todos os pares únicos de times para um round-robin completo
 * @param teamIds Array de IDs dos times
 * @returns Array de pares [team1Id, team2Id]
 */
function generateAllPairs(teamIds: string[]): [string, string][] {
  const pairs: [string, string][] = [];
  
  for (let i = 0; i < teamIds.length; i++) {
    for (let j = i + 1; j < teamIds.length; j++) {
      pairs.push([teamIds[i], teamIds[j]]);
    }
  }
  
  return pairs;
}

/**
 * Calcula o número máximo de jogos que cabem no período disponível
 */
function calculateMaxGames(): number {
  return Math.floor(
    SCHEDULER_CONFIG.TOTAL_TIME_MINUTES / 
    SCHEDULER_CONFIG.AVERAGE_GAME_DURATION_MINUTES
  );
}

/**
 * Distribui os pares de forma balanceada usando round-robin circular
 * Garante que cada time jogue aproximadamente o mesmo número de partidas
 * @param pairs Array de todos os pares possíveis
 * @param maxGames Número máximo de jogos permitidos
 * @returns Array balanceado de pares selecionados
 */
function balancePairs(pairs: [string, string][], maxGames: number): [string, string][] {
  if (pairs.length <= maxGames) {
    return pairs;
  }

  // Contador de partidas por time
  const gameCounts = new Map<string, number>();
  
  // Inicializa contadores
  const allTeamIds = new Set<string>();
  pairs.forEach(([t1, t2]) => {
    allTeamIds.add(t1);
    allTeamIds.add(t2);
  });
  
  allTeamIds.forEach(teamId => {
    gameCounts.set(teamId, 0);
  });

  const selectedPairs: [string, string][] = [];
  const usedPairs = new Set<string>();

  // Função para criar chave única de um par
  const pairKey = (t1: string, t2: string) => {
    return t1 < t2 ? `${t1}-${t2}` : `${t2}-${t1}`;
  };

  // Calcula o número ideal de partidas por time
  const idealGamesPerTeam = Math.floor((maxGames * 2) / allTeamIds.size);

  // Seleciona pares balanceadamente
  while (selectedPairs.length < maxGames && selectedPairs.length < pairs.length) {
    let bestPair: [string, string] | null = null;
    let bestScore = -Infinity;

    // Procura o par que melhor balanceia a distribuição
    for (const pair of pairs) {
      const [t1, t2] = pair;
      const key = pairKey(t1, t2);

      // Pula se já foi usado
      if (usedPairs.has(key)) continue;

      const count1 = gameCounts.get(t1) || 0;
      const count2 = gameCounts.get(t2) || 0;

      // Prioriza times que estão abaixo do ideal
      const score = 
        (idealGamesPerTeam - count1) * 2 + 
        (idealGamesPerTeam - count2) * 2 -
        Math.abs(count1 - count2); // Penaliza diferenças grandes

      if (score > bestScore) {
        bestScore = score;
        bestPair = pair;
      }
    }

    if (bestPair) {
      const [t1, t2] = bestPair;
      selectedPairs.push(bestPair);
      usedPairs.add(pairKey(t1, t2));
      
      gameCounts.set(t1, (gameCounts.get(t1) || 0) + 1);
      gameCounts.set(t2, (gameCounts.get(t2) || 0) + 1);
    } else {
      // Se não encontrou mais pares válidos, para
      break;
    }
  }

  return selectedPairs;
}

/**
 * Cria o chaveamento automático de partidas para um GameDay
 * @param gameDayId ID do GameDay onde as partidas serão criadas
 * @returns Resultado da operação com sucesso ou erro
 */
export async function scheduleMatches(
  gameDayId: string
): Promise<ActionResult> {
  try {
    uuidSchema.parse(gameDayId);
    // Verifica se o GameDay existe e está aberto
    const gameDay = await prisma.gameDay.findUnique({
      where: { id: gameDayId },
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
        error: "Não é possível criar partidas em um dia de jogos encerrado",
      };
    }

    // Verifica se já existem partidas
    if (gameDay.matches.length > 0) {
      return {
        success: false,
        error: "Este dia de jogos já possui partidas. Delete-as antes de criar um novo chaveamento.",
      };
    }

    // Busca todos os times
    const teams = await prisma.team.findMany({
      orderBy: { name: "asc" },
    });

    if (teams.length < 2) {
      return {
        success: false,
        error: "É necessário pelo menos 2 times para criar partidas",
      };
    }

    const teamIds = teams.map(team => team.id);

    // Gera todos os pares possíveis
    const allPairs = generateAllPairs(teamIds);

    // Calcula o número máximo de jogos
    const maxGames = calculateMaxGames();

    // Balanceia os pares se necessário
    const selectedPairs = balancePairs(allPairs, maxGames);

    if (selectedPairs.length === 0) {
      return {
        success: false,
        error: "Não foi possível gerar partidas balanceadas",
      };
    }

    // Cria as partidas no banco de dados
    const matches = await prisma.$transaction(
      selectedPairs.map(([team1Id, team2Id]) =>
        prisma.match.create({
          data: {
            gameDayId,
            team1Id,
            team2Id,
            status: "scheduled",
            goalsTeam1: 0,
            goalsTeam2: 0,
          },
        })
      )
    );

    // Revalida as páginas relevantes
    revalidatePath("/game-days");
    revalidatePath(`/game-days/${gameDayId}`);
    revalidatePath("/matches");
    revalidatePath("/standings");

    return {
      success: true,
      data: {
        matches,
        totalMatches: matches.length,
        maxPossibleMatches: allPairs.length,
        teamsParticipating: teams.length,
      },
    };
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
          : "Erro ao criar chaveamento automático",
    };
  }
}

/**
 * Retorna estatísticas sobre o chaveamento possível
 * @param gameDayId ID do GameDay (opcional)
 * @returns Estatísticas do chaveamento
 */
export async function getSchedulingStats(
  gameDayId?: string
): Promise<ActionResult> {
  try {
    if (gameDayId) {
      uuidSchema.parse(gameDayId);
    }
    const teams = await prisma.team.findMany();
    
    if (teams.length < 2) {
      return {
        success: true,
        data: {
          totalTeams: teams.length,
          totalPossibleMatches: 0,
          maxMatchesInTimeWindow: calculateMaxGames(),
          canSchedule: false,
          message: "É necessário pelo menos 2 times",
        },
      };
    }

    const teamIds = teams.map(t => t.id);
    const allPairs = generateAllPairs(teamIds);
    const maxGames = calculateMaxGames();

    let existingMatches = 0;
    if (gameDayId) {
      const gameDay = await prisma.gameDay.findUnique({
        where: { id: gameDayId },
        include: { matches: true },
      });
      existingMatches = gameDay?.matches.length || 0;
    }

    return {
      success: true,
      data: {
        totalTeams: teams.length,
        totalPossibleMatches: allPairs.length,
        maxMatchesInTimeWindow: maxGames,
        recommendedMatches: Math.min(allPairs.length, maxGames),
        existingMatches,
        canSchedule: gameDayId ? existingMatches === 0 : true,
        averageGamesPerTeam: Math.floor((Math.min(allPairs.length, maxGames) * 2) / teams.length),
      },
    };
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
          : "Erro ao calcular estatísticas",
    };
  }
}

