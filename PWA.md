# Progressive Web App (PWA)

Este aplicativo foi configurado como um Progressive Web App (PWA), permitindo que seja instalado e executado como um aplicativo nativo no celular.

## Como Instalar no Celular

### Android (Chrome)

1. Abra o aplicativo no navegador Chrome
2. Quando aparecer o banner de instalação na parte inferior, toque em **"Instalar"**
3. Ou acesse o menu do Chrome (três pontos) e selecione **"Adicionar à tela inicial"**
4. O aplicativo será instalado e aparecerá como um ícone na tela inicial

### iOS (Safari)

1. Abra o aplicativo no navegador Safari
2. Toque no botão de compartilhar (quadrado com seta para cima)
3. Role para baixo e selecione **"Adicionar à Tela de Início"**
4. Confirme o nome e toque em **"Adicionar"**
5. O aplicativo será instalado e aparecerá como um ícone na tela inicial

## Funcionalidades PWA

- ✅ **Instalável**: Pode ser instalado como aplicativo nativo
- ✅ **Offline**: Funciona parcialmente offline graças ao service worker
- ✅ **Ícone na tela inicial**: Aparece como um aplicativo normal
- ✅ **Tela cheia**: Abre em modo standalone (sem barra do navegador)
- ✅ **Notificações**: Suporte para notificações push (quando implementado)

## Desenvolvimento

O PWA está desabilitado em modo de desenvolvimento (`NODE_ENV === 'development'`) para facilitar o desenvolvimento.

Para testar o PWA em produção:

```bash
npm run build
npm start
```

## Arquivos de Configuração

- `public/manifest.json` - Configurações do manifest do PWA
- `public/icon-192.png` e `public/icon-512.png` - Ícones do aplicativo
- `next.config.js` - Configuração do next-pwa
- `components/InstallPWA.tsx` - Componente de prompt de instalação

## Gerar Novos Ícones

Se precisar gerar novos ícones, execute:

```bash
node scripts/generate-icons.js
```

Os ícones serão gerados automaticamente em `public/`.

