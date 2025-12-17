/**
 * Utilitários para cálculo de tempo do cronômetro de partida
 */

/**
 * Calcula o tempo restante em milissegundos baseado no tempo de início e duração
 * @param startedAt Data/hora de início da partida
 * @param durationMinutes Duração da partida em minutos
 * @returns Tempo restante em milissegundos (pode ser negativo se o tempo já passou)
 */
export function calculateRemainingTime(
  startedAt: Date | string | null,
  durationMinutes: number
): number {
  if (!startedAt) {
    return durationMinutes * 60 * 1000; // Retorna o tempo total se ainda não começou
  }

  const startTime = typeof startedAt === "string" ? new Date(startedAt) : startedAt;
  const now = Date.now();
  const elapsed = now - startTime.getTime();
  const totalDuration = durationMinutes * 60 * 1000;
  
  return Math.max(0, totalDuration - elapsed);
}

/**
 * Formata milissegundos em formato mm:ss
 * @param milliseconds Tempo em milissegundos
 * @returns String formatada como "mm:ss"
 */
export function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Verifica se o tempo acabou
 * @param remainingTime Tempo restante em milissegundos
 * @returns true se o tempo acabou (<= 0)
 */
export function isTimeUp(remainingTime: number): boolean {
  return remainingTime <= 0;
}

