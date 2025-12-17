'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Verificar se já está instalado
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInStandaloneMode = (window.navigator as any).standalone === true;
    
    if (isStandalone || isInStandaloneMode) {
      return; // Já está instalado, não mostrar
    }

    // Verificar se o usuário já dispensou anteriormente
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      // Verificar se foi há mais de 7 dias
      const dismissedDate = new Date(dismissed);
      const daysSinceDismissed = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        return; // Ainda não passou 7 dias desde a última vez que dispensou
      }
    }

    // Detectar sistema operacional
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isAndroidDevice = /android/.test(userAgent);

    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);

    // Handler para Android (Chrome)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Para iOS ou se não houver prompt nativo, mostrar após um pequeno delay
    if (isIOSDevice || (!isAndroidDevice && !deferredPrompt)) {
      // Aguardar 2 segundos após o carregamento da página
      const timer = setTimeout(() => {
        setShowInstallButton(true);
      }, 2000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handler);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Android - usar prompt nativo
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setShowInstallButton(false);
        localStorage.removeItem('pwa-install-dismissed');
      }
      
      setDeferredPrompt(null);
    } else if (isIOS) {
      // iOS - instruções já estão sendo mostradas
      // O usuário precisa seguir as instruções manualmente
    }
  };

  const handleDismiss = () => {
    setShowInstallButton(false);
    localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
  };

  if (!showInstallButton) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black bg-opacity-50 md:hidden animate-in fade-in duration-300">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md animate-in slide-in-from-bottom duration-300">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚽</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Instalar App
              </h3>
              <p className="text-sm text-gray-600">
                Adicione à tela inicial para acesso rápido e melhor experiência
              </p>
            </div>
          </div>

          {/* Instruções específicas por plataforma */}
          {isIOS ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-blue-900 mb-2">
                📱 Instruções para iPhone/iPad:
              </p>
              <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
                <li>Toque no botão de compartilhar <span className="font-bold">□↑</span> na parte inferior</li>
                <li>Role para baixo e selecione <span className="font-bold">"Adicionar à Tela de Início"</span></li>
                <li>Toque em <span className="font-bold">"Adicionar"</span></li>
              </ol>
            </div>
          ) : isAndroid ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-green-900 mb-2">
                🤖 Instruções para Android:
              </p>
              <p className="text-xs text-green-800">
                Toque no botão abaixo para instalar automaticamente, ou use o menu do navegador → "Adicionar à tela inicial"
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-gray-900 mb-2">
                💡 Como instalar:
              </p>
              <p className="text-xs text-gray-700">
                Use o menu do navegador para adicionar este site à sua tela inicial
              </p>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3">
            <button
              onClick={handleDismiss}
              className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Agora não
            </button>
            {deferredPrompt ? (
              <button
                onClick={handleInstallClick}
                className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                Instalar Agora
              </button>
            ) : (
              <button
                onClick={handleDismiss}
                className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                Entendi
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

