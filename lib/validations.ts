import { z } from "zod";

// Schema para validação de Time
export const teamSchema = z.object({
  name: z
    .string()
    .min(1, "Nome do time é obrigatório")
    .max(100, "Nome do time deve ter no máximo 100 caracteres")
    .trim(),
  primaryColor: z
    .string()
    .regex(
      /^#[0-9A-Fa-f]{6}$/,
      "Cor primária deve ser um código hex válido (ex: #FF0000)"
    ),
  secondaryColor: z
    .string()
    .regex(
      /^#[0-9A-Fa-f]{6}$/,
      "Cor secundária deve ser um código hex válido (ex: #FFFFFF)"
    ),
});

export type TeamInput = z.infer<typeof teamSchema>;

// Schema para validação de Dia de Jogos
export const gameDaySchema = z.object({
  date: z.string().datetime("Data inválida"),
  description: z.string().max(500, "Descrição deve ter no máximo 500 caracteres").optional().nullable(),
  matchDurationMinutes: z.number().int().min(1, "Tempo da partida deve ser pelo menos 1 minuto").max(120, "Tempo da partida não pode exceder 120 minutos").default(10),
});

export type GameDayInput = z.infer<typeof gameDaySchema>;

// Schema para validação de Partida
export const matchSchema = z
  .object({
    gameDayId: z.string().uuid("ID do dia de jogos inválido"),
    team1Id: z.string().uuid("ID do time 1 inválido"),
    team2Id: z.string().uuid("ID do time 2 inválido"),
    goalsTeam1: z.number().int().min(0).default(0),
    goalsTeam2: z.number().int().min(0).default(0),
    status: z
      .enum(["scheduled", "in_progress", "finished"])
      .default("scheduled"),
  })
  .refine((data) => data.team1Id !== data.team2Id, {
    message: "Os times devem ser diferentes",
    path: ["team2Id"],
  });

export type MatchInput = z.infer<typeof matchSchema>;

// Schema para atualização de gols durante partida
export const updateMatchGoalsSchema = z.object({
  matchId: z.string().uuid("ID da partida inválido"),
  goalsTeam1: z.number().int().min(0, "Gols do time 1 deve ser maior ou igual a 0"),
  goalsTeam2: z.number().int().min(0, "Gols do time 2 deve ser maior ou igual a 0"),
});

export type UpdateMatchGoalsInput = z.infer<typeof updateMatchGoalsSchema>;

// Schema para validação de UUID simples
export const uuidSchema = z.string().uuid("ID inválido");

// Schema para validação de array de UUIDs
export const uuidArraySchema = z
  .array(z.string().uuid("ID inválido"))
  .min(1, "Array não pode estar vazio");

// Schema para substituição de times em partida
export const replaceTeamsSchema = z.object({
  matchId: z.string().uuid("ID da partida inválido"),
  teamOutId: z.string().uuid("ID do time que sai inválido"),
  teamInId: z.string().uuid("ID do time que entra inválido"),
}).refine((data) => data.teamOutId !== data.teamInId, {
  message: "O time que sai e o time que entra devem ser diferentes",
  path: ["teamInId"],
});

export type ReplaceTeamsInput = z.infer<typeof replaceTeamsSchema>;

