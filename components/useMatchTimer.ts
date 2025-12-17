"use client";

import { useState, useEffect } from "react";
import { calculateRemainingTime, formatTime, isTimeUp } from "@/lib/utils/timer";
import { playWhistleSound } from "@/lib/utils/sound";

interface UseMatchTimerProps {
  startedAt: Date | string | null;
  durationMinutes: number;
  endedAt?: Date | string | null;
}

interface UseMatchTimerReturn {
  timeDisplay: string;
  isTimeUp: boolean;
  remainingTime: number;
}

/**
 * Hook para gerenciar o cronômetro da partida
 * Calcula o tempo restante baseado em tempo real para evitar drift
 */
export function useMatchTimer({
  startedAt,
  durationMinutes,
  endedAt,
}: UseMatchTimerProps): UseMatchTimerReturn {
  const [remainingTime, setRemainingTime] = useState(() => {
    if (endedAt) {
      return 0; // Partida já encerrada
    }
    return calculateRemainingTime(startedAt, durationMinutes);
  });

  const [hasPlayedSound, setHasPlayedSound] = useState(false);

  useEffect(() => {
    // Se a partida já foi encerrada, não atualiza mais
    if (endedAt) {
      setRemainingTime(0);
      return;
    }

    // Se a partida ainda não começou, mostra o tempo total
    if (!startedAt) {
      setRemainingTime(durationMinutes * 60 * 1000);
      return;
    }

    // Função para atualizar o tempo baseado em tempo real
    const updateTime = () => {
      // Se a partida foi encerrada manualmente, não atualiza mais
      if (endedAt) {
        return;
      }

      const newRemainingTime = calculateRemainingTime(startedAt, durationMinutes);
      setRemainingTime(newRemainingTime);

      // Toca o som de apito quando o tempo acaba (apenas uma vez)
      // Só toca se a partida ainda não foi encerrada manualmente
      if (isTimeUp(newRemainingTime) && !hasPlayedSound && !endedAt) {
        playWhistleSound();
        setHasPlayedSound(true);
      }
    };

    // Atualiza imediatamente
    updateTime();

    // Atualiza a cada segundo
    const interval = setInterval(updateTime, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [startedAt, durationMinutes, endedAt, hasPlayedSound]);


  return {
    timeDisplay: formatTime(remainingTime),
    isTimeUp: isTimeUp(remainingTime),
    remainingTime,
  };
}

