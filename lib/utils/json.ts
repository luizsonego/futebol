/**
 * Utilitários para manipulação segura de dados JSON
 */

/**
 * Tipos para dados JSON armazenados no banco
 */

/**
 * Tipo para teamIds na Queue
 */
export type QueueTeamIds = string[];

/**
 * Função helper para parse seguro de JSON com tipo
 */
export function parseJSON<T>(json: string | null, fallback: T): T {
  if (!json) {
    return fallback;
  }
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    console.error("Erro ao fazer parse de JSON:", error);
    return fallback;
  }
}

/**
 * Função helper para stringify seguro
 */
export function stringifyJSON<T>(data: T): string {
  try {
    return JSON.stringify(data);
  } catch (error) {
    console.error("Erro ao fazer stringify de JSON:", error);
    return "[]";
  }
}

