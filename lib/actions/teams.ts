"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { prisma } from "../prisma";
import { teamSchema, uuidSchema, type TeamInput } from "../validations";
import type { ActionResult } from "../types";

/**
 * Cria um novo time no banco de dados
 * @param data - Dados do time validados pelo schema Zod
 * @returns Resultado da operação com sucesso ou erro
 */
export async function createTeam(data: TeamInput): Promise<ActionResult> {
  try {
    // Validação dos dados usando Zod
    const validated = teamSchema.parse(data);
    
    // Persistência no banco de dados usando Prisma
    const team = await prisma.team.create({
      data: validated,
    });
    
    // Revalidação do cache da página de times
    revalidatePath("/teams");
    
    return { success: true, data: team };
  } catch (error) {
    // Tratamento específico para erros de validação Zod
    if (error instanceof ZodError) {
      const firstError = error.errors[0];
      return {
        success: false,
        error: firstError?.message || "Dados inválidos",
      };
    }
    
    // Tratamento para outros erros (ex: banco de dados)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao criar time",
    };
  }
}

/**
 * Busca todos os times cadastrados
 * @returns Lista de times ordenados por nome
 */
export async function getTeams(): Promise<ActionResult> {
  try {
    const teams = await prisma.team.findMany({
      orderBy: { name: "asc" },
    });
    return { success: true, data: teams };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao buscar times",
    };
  }
}

/**
 * Deleta um time do banco de dados
 * @param id - ID do time a ser deletado
 * @returns Resultado da operação com sucesso ou erro
 */
export async function deleteTeam(id: string): Promise<ActionResult> {
  try {
    uuidSchema.parse(id);
    await prisma.team.delete({
      where: { id },
    });
    revalidatePath("/teams");
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
      error: error instanceof Error ? error.message : "Erro ao deletar time",
    };
  }
}

