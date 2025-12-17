import { prisma } from "../prisma";

export interface TeamStanding {
  teamId: string;
  teamName: string;
  primaryColor: string;
  secondaryColor: string;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

/**
 * Calcula a tabela de classificação baseada nas partidas finalizadas
 */
export async function calculateStandings(): Promise<TeamStanding[]> {
  const teams = await prisma.team.findMany();
  const finishedMatches = await prisma.match.findMany({
    where: {
      status: "finished",
    },
    include: {
      team1: true,
      team2: true,
    },
  });

  const standingsMap = new Map<string, TeamStanding>();

  // Inicializa todos os times com estatísticas zeradas
  teams.forEach((team) => {
    standingsMap.set(team.id, {
      teamId: team.id,
      teamName: team.name,
      primaryColor: team.primaryColor,
      secondaryColor: team.secondaryColor,
      matchesPlayed: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    });
  });

  // Processa cada partida finalizada
  finishedMatches.forEach((match) => {
    const team1Standing = standingsMap.get(match.team1Id)!;
    const team2Standing = standingsMap.get(match.team2Id)!;

    // Atualiza gols
    team1Standing.goalsFor += match.goalsTeam1;
    team1Standing.goalsAgainst += match.goalsTeam2;
    team2Standing.goalsFor += match.goalsTeam2;
    team2Standing.goalsAgainst += match.goalsTeam1;

    // Atualiza partidas jogadas
    team1Standing.matchesPlayed++;
    team2Standing.matchesPlayed++;

    // Determina resultado e atualiza estatísticas
    if (match.goalsTeam1 > match.goalsTeam2) {
      // Time 1 venceu
      team1Standing.wins++;
      team1Standing.points += 3;
      team2Standing.losses++;
    } else if (match.goalsTeam2 > match.goalsTeam1) {
      // Time 2 venceu
      team2Standing.wins++;
      team2Standing.points += 3;
      team1Standing.losses++;
    } else {
      // Empate
      team1Standing.draws++;
      team1Standing.points += 1;
      team2Standing.draws++;
      team2Standing.points += 1;
    }
  });

  // Calcula saldo de gols
  standingsMap.forEach((standing) => {
    standing.goalDifference = standing.goalsFor - standing.goalsAgainst;
  });

  // Converte para array e ordena
  const standings = Array.from(standingsMap.values());
  
  // Ordena por: pontos (desc), saldo de gols (desc), gols marcados (desc)
  standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });

  return standings;
}

/**
 * Calcula a tabela de classificação baseada nas partidas finalizadas de um dia de jogos específico
 */
export async function calculateStandingsByGameDay(gameDayId: string): Promise<TeamStanding[]> {
  const teams = await prisma.team.findMany();
  const finishedMatches = await prisma.match.findMany({
    where: {
      status: "finished",
      gameDayId: gameDayId,
    },
    include: {
      team1: true,
      team2: true,
    },
  });

  const standingsMap = new Map<string, TeamStanding>();

  // Inicializa todos os times com estatísticas zeradas
  teams.forEach((team) => {
    standingsMap.set(team.id, {
      teamId: team.id,
      teamName: team.name,
      primaryColor: team.primaryColor,
      secondaryColor: team.secondaryColor,
      matchesPlayed: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    });
  });

  // Processa cada partida finalizada do dia
  finishedMatches.forEach((match) => {
    const team1Standing = standingsMap.get(match.team1Id)!;
    const team2Standing = standingsMap.get(match.team2Id)!;

    // Atualiza gols
    team1Standing.goalsFor += match.goalsTeam1;
    team1Standing.goalsAgainst += match.goalsTeam2;
    team2Standing.goalsFor += match.goalsTeam2;
    team2Standing.goalsAgainst += match.goalsTeam1;

    // Atualiza partidas jogadas
    team1Standing.matchesPlayed++;
    team2Standing.matchesPlayed++;

    // Determina resultado e atualiza estatísticas
    if (match.goalsTeam1 > match.goalsTeam2) {
      // Time 1 venceu
      team1Standing.wins++;
      team1Standing.points += 3;
      team2Standing.losses++;
    } else if (match.goalsTeam2 > match.goalsTeam1) {
      // Time 2 venceu
      team2Standing.wins++;
      team2Standing.points += 3;
      team1Standing.losses++;
    } else {
      // Empate
      team1Standing.draws++;
      team1Standing.points += 1;
      team2Standing.draws++;
      team2Standing.points += 1;
    }
  });

  // Calcula saldo de gols
  standingsMap.forEach((standing) => {
    standing.goalDifference = standing.goalsFor - standing.goalsAgainst;
  });

  // Converte para array e ordena
  const standings = Array.from(standingsMap.values());
  
  // Filtra apenas times que jogaram pelo menos uma partida neste dia
  const standingsWithMatches = standings.filter(standing => standing.matchesPlayed > 0);
  
  // Ordena por: pontos (desc), saldo de gols (desc), gols marcados (desc)
  standingsWithMatches.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });

  return standingsWithMatches;
}

/**
 * Determina o campeão de um dia de jogos com base nos critérios:
 * 1. Pontos
 * 2. Gols marcados (em caso de empate em pontos)
 * 
 * Retorna o ID do time campeão ou null se não houver campeão
 * (ex: nenhuma partida finalizada ou empate completo)
 * 
 * @param gameDayId - ID do dia de jogos
 * @returns ID do time campeão ou null
 */
export async function determineChampion(gameDayId: string): Promise<string | null> {
  const standings = await calculateStandingsByGameDay(gameDayId);
  
  // Se não houver times com partidas jogadas, não há campeão
  if (standings.length === 0) {
    return null;
  }
  
  // O primeiro time da lista já está ordenado pelos critérios corretos
  // (pontos desc, saldo de gols desc, gols marcados desc)
  const champion = standings[0];
  
  // Se o campeão não tem pontos, não há campeão válido
  if (champion.points === 0) {
    return null;
  }
  
  // Verifica se há empate no primeiro lugar
  // Se houver múltiplos times com os mesmos pontos e gols, retorna null
  const topPoints = champion.points;
  const topGoals = champion.goalsFor;
  const topGoalDifference = champion.goalDifference;
  
  const tiedTeams = standings.filter(
    (team) =>
      team.points === topPoints &&
      team.goalDifference === topGoalDifference &&
      team.goalsFor === topGoals
  );
  
  // Se houver empate completo, retorna null (pode ser expandido para critérios futuros)
  if (tiedTeams.length > 1) {
    return null;
  }
  
  return champion.teamId;
}

/**
 * Interface para armazenar informações do ranking final
 * Preparado para futuras regras como tempo de jogo
 */
export interface FinalStandingsData {
  standings: TeamStanding[];
  championId: string | null;
  closedAt: string;
  tiebreakerRules?: {
    // Preparado para futuras regras
    // playTime?: number; // Tempo total de jogo em minutos
    // averagePlayTime?: number; // Tempo médio por partida
  };
}

