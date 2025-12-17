# Sons Personalizados

Esta pasta é destinada a armazenar arquivos de áudio personalizados para o cronômetro de partidas.

## Como usar um som externo

1. Coloque seu arquivo de áudio (MP3, WAV, OGG, etc.) nesta pasta `public/sounds/`
2. Por padrão, o sistema procura por `/sounds/whistle.mp3`
3. Você pode configurar um caminho diferente usando a variável de ambiente `NEXT_PUBLIC_WHISTLE_SOUND_PATH`

### Exemplo de arquivo:
- `public/sounds/whistle.mp3` - Som de apito de juiz

### Configuração via variável de ambiente:

Crie ou edite o arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_WHISTLE_SOUND_PATH=/sounds/whistle.mp3
```

Ou use outro caminho:

```env
NEXT_PUBLIC_WHISTLE_SOUND_PATH=/sounds/apito-futebol.mp3
```

## Fallback

Se o arquivo de áudio externo não for encontrado ou houver erro ao reproduzi-lo, o sistema automaticamente usará um som sintético gerado pela Web Audio API.

## Formatos suportados

O elemento HTML `<audio>` suporta os seguintes formatos:
- MP3 (recomendado para melhor compatibilidade)
- WAV
- OGG
- AAC
- M4A

## Notas

- O volume padrão é 70% (0.7)
- O arquivo deve estar acessível publicamente na pasta `public/`
- O caminho deve começar com `/` (ex: `/sounds/whistle.mp3`)

