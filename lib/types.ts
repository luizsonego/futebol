/**
 * Tipos compartilhados para resultados de ações do servidor
 */

/**
 * Resultado padrão de uma ação do servidor
 */
export type ActionResult<T = unknown> =
  | { success: true; data?: T }
  | { success: false; error: string };

/**
 * Validador de UUID
 */
export function isValidUUID(value: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

/**
 * Valida um UUID e lança erro se inválido
 */
export function validateUUID(value: string, fieldName: string): void {
  if (!isValidUUID(value)) {
    throw new Error(`${fieldName} deve ser um UUID válido`);
  }
}

/**
 * Valida um array de UUIDs
 */
export function validateUUIDArray(
  value: string[],
  fieldName: string
): void {
  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} deve ser um array`);
  }
  if (value.length === 0) {
    throw new Error(`${fieldName} não pode estar vazio`);
  }
  value.forEach((id, index) => {
    if (!isValidUUID(id)) {
      throw new Error(
        `${fieldName}[${index}] deve ser um UUID válido`
      );
    }
  });
}

