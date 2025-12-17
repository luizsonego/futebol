# Setup Inicial - Next.js 14 + TypeScript + TailwindCSS + Prisma (SQLite)

Este documento descreve o processo completo de configuração inicial do projeto.

## 1. Comandos de Criação do Projeto

### Criar projeto Next.js com TypeScript e App Router

```bash
npx create-next-app@14 classificacao --typescript --tailwind --app --no-src-dir
cd classificacao
```

Ou manualmente:

```bash
mkdir classificacao
cd classificacao
npm init -y
npm install next@14 react@18 react-dom@18
npm install -D typescript @types/react @types/node @types/react-dom
```

### Instalar dependências do TailwindCSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Instalar Prisma e Prisma Client

```bash
npm install @prisma/client
npm install -D prisma
npx prisma init --datasource-provider sqlite
```

## 2. Configuração do TailwindCSS

### Arquivo: `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Arquivo: `postcss.config.js`

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### Arquivo: `app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

## 3. Configuração do Prisma

### Arquivo: `prisma/schema.prisma` (Básico)

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

// Exemplo básico de modelo
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("users")
}
```

### Gerar Prisma Client

```bash
npx prisma generate
```

### Criar banco de dados (aplicar schema)

```bash
npx prisma db push
```

### Abrir Prisma Studio (opcional)

```bash
npx prisma studio
```

## 4. Estrutura Inicial de Pastas

```
classificacao/
├── app/
│   ├── layout.tsx          # Layout raiz da aplicação
│   ├── page.tsx            # Página inicial
│   ├── globals.css         # Estilos globais com Tailwind
│   └── favicon.ico
├── components/             # Componentes React reutilizáveis
├── lib/
│   └── prisma.ts          # Instância do Prisma Client
├── prisma/
│   ├── schema.prisma      # Schema do banco de dados
│   └── dev.db             # Banco SQLite (gerado após db push)
├── public/                # Arquivos estáticos
├── .env                   # Variáveis de ambiente (gerado pelo Prisma)
├── .gitignore
├── next.config.js         # Configuração do Next.js
├── package.json
├── postcss.config.js      # Configuração do PostCSS
├── tailwind.config.js     # Configuração do TailwindCSS
└── tsconfig.json          # Configuração do TypeScript
```

## 5. Arquivo `lib/prisma.ts`

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

**Explicação:**
- Cria uma instância singleton do Prisma Client
- Evita múltiplas instâncias durante desenvolvimento (hot reload)
- Habilita logs de queries em desenvolvimento

## 6. Configuração do TypeScript

### Arquivo: `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## 7. Scripts do `package.json`

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "db:generate": "prisma generate"
  }
}
```

## 8. Arquivo `.env` (gerado automaticamente pelo Prisma)

```
DATABASE_URL="file:./dev.db"
```

## 9. Próximos Passos

1. Execute `npm run dev` para iniciar o servidor de desenvolvimento
2. Acesse `http://localhost:3000` no navegador
3. Configure seus modelos no `prisma/schema.prisma`
4. Execute `npm run db:push` para aplicar mudanças no banco
5. Execute `npm run db:generate` para regenerar o Prisma Client após mudanças no schema

## 10. Exemplo de Uso do Prisma

```typescript
import { prisma } from "@/lib/prisma";

// Exemplo de Server Component
export default async function Page() {
  const users = await prisma.user.findMany();
  
  return (
    <div>
      <h1>Usuários</h1>
      {users.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

