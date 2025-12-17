/**
 * Utilitários para tocar sons no aplicativo
 */

// Caminho para o arquivo de áudio externo (MP3)
// Opções de configuração:
// 1. Via variável de ambiente: NEXT_PUBLIC_WHISTLE_SOUND_PATH no arquivo .env.local
// 2. Defina diretamente aqui: const EXTERNAL_SOUND_PATH = "/sounds/whistle.mp3";
// 3. Para desabilitar som externo e usar apenas sintético: const EXTERNAL_SOUND_PATH = "";
// 
// Coloque o arquivo na pasta public/ do projeto (ex: public/sounds/whistle.mp3)
// Se não especificado, não encontrado ou vazio, usa o som sintético como fallback
const EXTERNAL_SOUND_PATH = process.env.NEXT_PUBLIC_WHISTLE_SOUND_PATH || "/sounds/whistle.mp3";

// Cache do elemento de áudio para reutilização
let audioElement: HTMLAudioElement | null = null;

/**
 * Toca o som de apito sintético usando Web Audio API
 * Usado como fallback quando o arquivo externo não está disponível
 */
function playSyntheticWhistleSound(): void {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Cria um oscilador para gerar o som do apito
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Frequência inicial alta (apito agudo)
    oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
    // Desce rapidamente para simular o apito
    oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.3);
    oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.6);

    // Envelope de volume (fade in e fade out)
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.5);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.8);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.8);

    // Limpa após tocar
    oscillator.onended = () => {
      audioContext.close();
    };
  } catch (error) {
    // Fallback silencioso se Web Audio API não estiver disponível
    console.warn("Não foi possível tocar o som de apito sintético:", error);
  }
}

/**
 * Toca o som de apito
 * Primeiro tenta usar um arquivo de áudio externo (MP3)
 * Se não encontrar ou falhar, usa o som sintético como fallback
 */
export function playWhistleSound(): void {
  // Tenta primeiro usar arquivo de áudio externo
  if (EXTERNAL_SOUND_PATH && EXTERNAL_SOUND_PATH !== "") {
    try {
      // Cria ou reutiliza o elemento de áudio
      if (!audioElement) {
        audioElement = new Audio(EXTERNAL_SOUND_PATH);
        audioElement.volume = 0.7; // Volume padrão (0.0 a 1.0)
      }

      const audio = audioElement;
      
      // Reseta o áudio para o início
      audio.currentTime = 0;
      
      // Toca o áudio
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Áudio tocando com sucesso
          })
          .catch((error) => {
            // Se falhar ao tocar o arquivo externo, usa o som sintético
            console.warn("Não foi possível tocar o arquivo de áudio externo, usando som sintético:", error);
            playSyntheticWhistleSound();
          });
      }
      
      return;
    } catch (error) {
      // Se houver erro ao criar o elemento de áudio, usa o som sintético
      console.warn("Erro ao carregar arquivo de áudio externo, usando som sintético:", error);
      playSyntheticWhistleSound();
      return;
    }
  }
  
  // Se não houver caminho configurado, usa o som sintético
  playSyntheticWhistleSound();
}

