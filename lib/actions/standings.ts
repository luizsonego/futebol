"use server";

import { ZodError } from "zod";
import { calculateStandings, calculateStandingsByGameDay } from "../utils/standings";
import { uuidSchema } from "../validations";
import type { ActionResult } from "../types";

export async function getStandings(): Promise<ActionResult> {
  try {
    const standings = await calculateStandings();
    return { success: true, data: standings };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro ao calcular tabela",
    };
  }
}

export async function getStandingsByGameDay(
  gameDayId: string
): Promise<ActionResult> {
  try {
    uuidSchema.parse(gameDayId);
    const standings = await calculateStandingsByGameDay(gameDayId);
    return { success: true, data: standings };
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
          : "Erro ao calcular tabela do dia",
    };
  }
}

