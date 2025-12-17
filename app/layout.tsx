import type { Metadata } from "next";
import { MobileFooter } from "@/components/MobileFooter";
import { ToastProvider } from "@/components/ToastProvider";
import { GameProvider } from "@/components/GameContext";
import { MainContent } from "@/components/MainContent";
import { SettingsButton } from "@/components/SettingsButton";
import { InstallPWA } from "@/components/InstallPWA";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gerenciamento de Futebol",
  description: "MVP para gerenciamento de jogos de futebol",
  manifest: "/manifest.json",
  themeColor: "#2563eb",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Gerenciamento de Futebol",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gray-50 flex flex-col">
        <ToastProvider>
          <GameProvider>
            {/* Header simples - mobile first */}
            <header className="bg-blue-600 text-white shadow-md sticky top-0 z-50" role="banner">
              <div className="container mx-auto px-4 relative">
                <div className="flex items-center justify-center h-14 md:h-16">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold">
                    ⚽ Gerenciamento de Futebol
                  </h1>
                </div>
                <SettingsButton />
              </div>
            </header>

            {/* Área principal centralizada - com padding bottom ajustado dinamicamente */}
            <MainContent>
              {children}
            </MainContent>

            {/* Footer fixo apenas no mobile */}
            <MobileFooter />
            
            {/* Prompt de instalação PWA */}
            <InstallPWA />
          </GameProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

