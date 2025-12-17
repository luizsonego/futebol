"use server";

import { prisma } from "./prisma";

/**
 * Tipos de retorno para funções de scoring
 */
export interface ScoringResult {
  team1Id: string;
  team2Id: string;
  team1Points: number;
  team2Points: number;
}

/**
 * Calcula e atualiza a pontuação e gols dos times após uma partida ser finalizada
 * 
 * Regras:
 * - Vitória: 3 pontos
 * - Empate: 1 ponto para cada time
 * - Derrota: 0 pontos
 * 
 * @param team1Id - ID do primeiro time
 * @param team2Id - ID do segundo time
 * @param goalsTeam1 - Gols marcados pelo primeiro time
 * @param goalsTeam2 - Gols marcados pelo segundo time
 */
export async function updateTeamScores(
  team1Id: string,
  team2Id: string,
  goalsTeam1: number,
  goalsTeam2: number
) {
  // Busca os times atuais para obter os valores existentes
  const [team1, team2] = await Promise.all([
    prisma.team.findUnique({ where: { id: team1Id } }),
    prisma.team.findUnique({ where: { id: team2Id } }),
  ]);

  if (!team1 || !team2) {
    throw new Error("Um ou ambos os times não foram encontrados");
  }

  // Calcula os novos valores para o time 1
  const team1NewGoalsScored = team1.goalsScored + goalsTeam1;
  const team1NewGoalsConceded = team1.goalsConceded + goalsTeam2;
  
  // Calcula os novos valores para o time 2
  const team2NewGoalsScored = team2.goalsScored + goalsTeam2;
  const team2NewGoalsConceded = team2.goalsConceded + goalsTeam1;

  // Determina o resultado e calcula os pontos
  let team1PointsToAdd = 0;
  let team2PointsToAdd = 0;

  if (goalsTeam1 > goalsTeam2) {
    // Time 1 venceu
    team1PointsToAdd = 3;
    team2PointsToAdd = 0;
  } else if (goalsTeam2 > goalsTeam1) {
    // Time 2 venceu
    team1PointsToAdd = 0;
    team2PointsToAdd = 3;
  } else {
    // Empate
    team1PointsToAdd = 1;
    team2PointsToAdd = 1;
  }

  // Atualiza ambos os times em uma transação
  await prisma.$transaction([
    prisma.team.update({
      where: { id: team1Id },
      data: {
        points: team1.points + team1PointsToAdd,
        goalsScored: team1NewGoalsScored,
        goalsConceded: team1NewGoalsConceded,
      },
    }),
    prisma.team.update({
      where: { id: team2Id },
      data: {
        points: team2.points + team2PointsToAdd,
        goalsScored: team2NewGoalsScored,
        goalsConceded: team2NewGoalsConceded,
      },
    }),
  ]);
}

