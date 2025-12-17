"use server";

import { ZodError } from "zod";
import { scheduleMatches } from "@/lib/scheduler";
import { uuidSchema } from "../validations";
import type { ActionResult } from "../types";

/**
 * Cria chaveamento automático usando o scheduler balanceado
 * Este é um wrapper que mantém compatibilidade com o código existente
 */
export async function createAutomaticBracketing(
  gameDayId: string
): Promise<ActionResult> {
  try {
    uuidSchema.parse(gameDayId);
    return await scheduleMatches(gameDayId);
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

