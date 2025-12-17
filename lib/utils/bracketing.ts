import { prisma } from "../prisma";

/**
 * Gera chaveamento automático em formato de todos contra todos
 * para um dia de jogos específico
 */
export async function generateAutomaticBracketing(gameDayId: string) {
  // Verificar se o dia de jogos está aberto
  const gameDay = await prisma.gameDay.findUnique({
    where: { id: gameDayId },
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

  const teams = await prisma.team.findMany();
  
  if (teams.length < 2) {
    return {
      success: false,
      error: "É necessário pelo menos 2 times para gerar chaveamento",
    };
  }

  const matches: Array<{ team1Id: string; team2Id: string }> = [];

  // Gera todos contra todos (sem repetição)
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      matches.push({
        team1Id: teams[i].id,
        team2Id: teams[j].id,
      });
    }
  }

  // Cria as partidas no banco
  try {
    const createdMatches = await Promise.all(
      matches.map((match) =>
        prisma.match.create({
          data: {
            gameDayId,
            team1Id: match.team1Id,
            team2Id: match.team2Id,
            status: "scheduled",
          },
          include: {
            team1: true,
            team2: true,
          },
        })
      )
    );

    return {
      success: true,
      data: createdMatches,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao gerar chaveamento",
    };
  }
}

