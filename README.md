# ⚽ Sistema de Gerenciamento de Futebol

MVP funcional para gerenciamento de jogos de futebol desenvolvido com Next.js 14, TypeScript, Prisma ORM e SQLite.

## 🚀 Funcionalidades

- **Cadastro de Times**: Crie times com cores personalizadas (primária e secundária)
- **Dias de Jogos**: Organize partidas em dias específicos
- **Chaveamento**: Criação manual ou automática (todos contra todos)
- **Registro de Gols**: Atualize placares em tempo real durante as partidas
- **Cálculo de Pontuação**: Sistema automático (3 vitória, 1 empate, 0 derrota)
- **Tabela de Classificação**: Visualize resultados e identifique o campeão

## 🛠️ Tecnologias

- **Next.js 14** (App Router)
- **TypeScript**
- **Prisma ORM**
- **SQLite**
- **Zod** (validação)
- **Tailwind CSS** (estilização)
- **Server Actions** (operações de dados)

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <repo-url>
cd classificacao
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o banco de dados:
```bash
npm run db:generate
npm run db:push
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

5. Acesse `http://localhost:3000`

## 📁 Estrutura do Projeto

```
classificacao/
├── app/                    # Páginas e rotas (App Router)
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página inicial
│   ├── teams/             # Página de times
│   ├── game-days/         # Página de dias de jogos
│   ├── matches/           # Página de partidas
│   └── standings/         # Página da tabela
├── components/            # Componentes React reutilizáveis
├── lib/
│   ├── actions/          # Server Actions
│   ├── utils/            # Funções utilitárias
│   ├── validations.ts    # Schemas Zod
│   └── prisma.ts         # Cliente Prisma
└── prisma/
    └── schema.prisma     # Schema do banco de dados
```

## 🎯 Como Usar

1. **Cadastre Times**: Vá em "Times" e adicione os times participantes com suas cores
2. **Crie um Dia de Jogos**: Em "Dias de Jogos", crie um novo dia para organizar partidas
3. **Gere Chaveamento**: No detalhe do dia de jogos, use o chaveamento automático ou crie partidas manualmente
4. **Registre Gols**: Durante as partidas, atualize os placares em tempo real
5. **Finalize Partidas**: Marque as partidas como finalizadas para atualizar a tabela
6. **Acompanhe a Tabela**: Veja a classificação e descubra quem é o campeão!

## 📊 Critérios de Desempate

A tabela é ordenada por:
1. Maior número de pontos
2. Maior saldo de gols
3. Maior número de gols marcados

## 🔒 Segurança

- Todas as operações de dados são feitas via Server Actions (nada crítico no client)
- Validação com Zod em todas as entradas
- TypeScript para type safety

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run start` - Inicia servidor de produção
- `npm run db:push` - Aplica mudanças do schema ao banco
- `npm run db:studio` - Abre Prisma Studio (interface visual do banco)
- `npm run db:generate` - Gera cliente Prisma

## 🎨 Decisões de Arquitetura

- **Separação de Responsabilidades**: UI, regras de negócio e persistência bem separadas
- **Server Actions**: Todas as operações de dados no servidor
- **Validação com Zod**: Schemas reutilizáveis e type-safe
- **Componentes Reutilizáveis**: UI modular e fácil de manter
- **MVP Focado**: Sem overengineering, apenas o necessário para funcionar

## 📄 Licença

Este é um projeto MVP para fins educacionais/demonstrativos.

