# 🚀 Guia de Deploy na Vercel

Este guia explica como fazer deploy do projeto na Vercel, incluindo a configuração do banco de dados PostgreSQL e execução de migrações.

## ⚡ Início Rápido

1. **Crie um banco PostgreSQL** na Vercel (Storage → Postgres)
2. **Configure a variável** `DATABASE_URL` no projeto Vercel
3. **Faça push** do código para o Git
4. **Deploy automático** - A Vercel fará o resto!

As migrações são executadas automaticamente durante o build. Veja os detalhes abaixo.

## 📋 Pré-requisitos

1. Conta na [Vercel](https://vercel.com)
2. Conta no [Vercel Postgres](https://vercel.com/storage/postgres) (ou outro provedor PostgreSQL)
3. Git configurado e repositório criado (GitHub, GitLab ou Bitbucket)

## 🔧 Passo 1: Preparar o Projeto Localmente

### 1.1 Atualizar o Schema do Prisma

O schema já está configurado para usar PostgreSQL na produção através da variável de ambiente `DATABASE_URL`. Em desenvolvimento, continua usando SQLite.

### 1.2 Preparar Migrações para PostgreSQL

O projeto possui migrações SQLite. Para fazer deploy na Vercel com PostgreSQL, você tem duas opções:

#### Opção A: Deploy Automático (Recomendado)

O Prisma Migrate detecta automaticamente o provider e aplica as migrações corretamente. As migrações SQLite serão convertidas automaticamente durante o deploy.

**Apenas certifique-se de que:**
- Todas as migrações estão commitadas no Git
- O schema está sincronizado

#### Opção B: Criar Migrações PostgreSQL Manualmente

Se preferir criar migrações específicas para PostgreSQL antes do deploy:

```bash
# 1. Configure a DATABASE_URL para PostgreSQL (local ou remoto)
export DATABASE_URL="postgresql://user:password@host:port/database"

# 2. Execute o script para criar migrações PostgreSQL
npm run db:migrate:postgres

# 3. Revise e commit as novas migrações
git add prisma/migrations
git commit -m "Add PostgreSQL migrations"
```

**⚠️ Importante:** 
- O script `setup-db.js` detecta automaticamente o provider baseado na `DATABASE_URL`
- Durante o build na Vercel, as migrações serão aplicadas automaticamente
- Certifique-se de que todas as migrações estão no repositório antes do deploy

## 🌐 Passo 2: Configurar Banco de Dados na Vercel

### 2.1 Criar Banco PostgreSQL na Vercel

1. Acesse o [Dashboard da Vercel](https://vercel.com/dashboard)
2. Vá em **Storage** → **Create Database** → **Postgres**
3. Escolha um nome para o banco e região
4. Clique em **Create**
5. Anote a **Connection String** que será gerada automaticamente

### 2.2 Alternativa: Usar Outro Provedor PostgreSQL

Se preferir usar outro provedor (como Supabase, Neon, Railway, etc.):

1. Crie uma conta no provedor escolhido
2. Crie um novo banco PostgreSQL
3. Copie a connection string (formato: `postgresql://user:password@host:port/database?sslmode=require`)

## 🔐 Passo 3: Configurar Variáveis de Ambiente

### 3.1 Na Vercel Dashboard

1. Vá para o seu projeto na Vercel (ou crie um novo)
2. Acesse **Settings** → **Environment Variables**
3. Adicione a variável:

   - **Nome:** `DATABASE_URL`
   - **Valor:** A connection string do PostgreSQL (ex: `postgresql://user:password@host:port/database?sslmode=require`)
   - **Environments:** Marque todas (Production, Preview, Development)

### 3.2 Variáveis de Ambiente Locais (Opcional)

Para testar localmente com PostgreSQL, crie um arquivo `.env.local`:

```env
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
```

**⚠️ Importante:** Nunca commite arquivos `.env` ou `.env.local` com credenciais reais!

## 📦 Passo 4: Fazer Deploy

### 4.1 Via Dashboard da Vercel

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Conecte seu repositório Git
3. Configure o projeto:
   - **Framework Preset:** Next.js (detectado automaticamente)
   - **Root Directory:** `./` (raiz do projeto)
   - **Build Command:** `npm run build` (ou deixe padrão)
   - **Output Directory:** `.next` (padrão do Next.js)
4. Clique em **Deploy**

### 4.2 Via CLI da Vercel

```bash
# Instalar Vercel CLI globalmente
npm i -g vercel

# Fazer login
vercel login

# Fazer deploy
vercel

# Para produção
vercel --prod
```

## 🔄 Passo 5: Executar Migrações do Banco de Dados

As migrações são executadas **automaticamente durante o build** através do script `build` configurado no `package.json`. O processo funciona assim:

1. **Setup do Schema**: O script `setup-db.js` detecta o provider (PostgreSQL ou SQLite) baseado na `DATABASE_URL`
2. **Geração do Cliente**: `prisma generate` cria o Prisma Client
3. **Aplicação de Migrações**: `prisma migrate deploy` aplica as migrações (ou `prisma db push` como fallback)
4. **Build do Next.js**: `next build` compila a aplicação

### 5.1 Verificar Logs de Build

1. Acesse o projeto na Vercel Dashboard
2. Vá em **Deployments** → Selecione o deployment mais recente
3. Clique em **Build Logs**
4. Procure por mensagens como:
   - `✅ Schema configurado para usar postgresql`
   - `Running prisma generate`
   - `Running prisma migrate deploy` ou `Running prisma db push`
   - `Database migrations applied successfully`
   - `✓ Compiled successfully`

### 5.2 Executar Migrações Manualmente (se necessário)

Se as migrações não executarem automaticamente, você pode executá-las manualmente:

**Opção 1: Via Vercel CLI**

```bash
vercel env pull .env.local  # Baixar variáveis de ambiente
npx prisma migrate deploy
```

**Opção 2: Via Vercel Dashboard**

1. Vá em **Deployments** → Selecione um deployment
2. Clique em **Shell** (se disponível)
3. Execute: `npx prisma migrate deploy`

**Opção 3: Via Script de Build Hook**

Você pode criar um script que executa as migrações antes do build. Isso já está configurado no `package.json`.

## ✅ Passo 6: Verificar Deploy

1. Acesse a URL fornecida pela Vercel (ex: `https://seu-projeto.vercel.app`)
2. Teste as funcionalidades principais:
   - Criar times
   - Criar dias de jogos
   - Criar partidas
   - Registrar gols
   - Ver tabela de classificação

## 🐛 Solução de Problemas Comuns

### Erro: "Prisma Client not generated"

**Solução:**
- Verifique se o script `postinstall` está no `package.json`
- Verifique os logs de build na Vercel
- Execute manualmente: `npx prisma generate`

### Erro: "Can't reach database server"

**Solução:**
- Verifique se a variável `DATABASE_URL` está configurada corretamente
- Verifique se o banco PostgreSQL está ativo
- Verifique se a connection string está correta (formato PostgreSQL, não SQLite)
- Verifique se o firewall do banco permite conexões da Vercel

### Erro: "Migration failed" ou "Migration engine failed"

**Solução:**
- O script de build usa `prisma db push` como fallback se `migrate deploy` falhar
- Verifique se todas as migrações estão commitadas no Git
- Verifique se o schema está sincronizado com as migrações
- Se o erro persistir, você pode usar `prisma db push` diretamente:
  ```bash
  # No script de build, substitua temporariamente:
  # prisma migrate deploy → prisma db push
  ```
- Execute `npx prisma migrate resolve --applied <migration_name>` se necessário
- **Nota:** `db push` sincroniza o schema diretamente sem usar migrações (útil para desenvolvimento)

### Erro: "Environment variable DATABASE_URL not found"

**Solução:**
- Verifique se a variável está configurada no Dashboard da Vercel
- Verifique se está marcada para o ambiente correto (Production/Preview)
- Faça um novo deploy após adicionar a variável

### Erro de Build: "Module not found" ou erros TypeScript

**Solução:**
- Execute `npm install` localmente para verificar dependências
- Verifique se todas as dependências estão no `package.json`
- Limpe o cache: `rm -rf .next node_modules && npm install`

### Erro: "PWA files not found"

**Solução:**
- O PWA é gerado durante o build
- Verifique se o `next.config.js` está configurado corretamente
- Verifique os logs de build para erros do `next-pwa`

## 📝 Checklist de Deploy

- [ ] Migrações do Prisma criadas e commitadas
- [ ] Banco PostgreSQL criado na Vercel (ou outro provedor)
- [ ] Variável `DATABASE_URL` configurada na Vercel
- [ ] Scripts de build configurados no `package.json`
- [ ] Projeto conectado ao repositório Git
- [ ] Deploy executado com sucesso
- [ ] Migrações aplicadas (verificar logs)
- [ ] Aplicação funcionando corretamente

## 🔄 Atualizações Futuras

Quando fizer mudanças no schema do Prisma:

1. Crie uma nova migração localmente:
   ```bash
   npx prisma migrate dev --name nome_da_migracao
   ```

2. Commit e push das migrações:
   ```bash
   git add prisma/migrations
   git commit -m "Add migration: nome_da_migracao"
   git push
   ```

3. Faça um novo deploy na Vercel (as migrações serão aplicadas automaticamente)

## 📚 Recursos Adicionais

- [Documentação da Vercel](https://vercel.com/docs)
- [Prisma com Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

## 💡 Dicas

1. **Sempre teste localmente** antes de fazer deploy
2. **Use Preview Deployments** para testar mudanças antes de produção
3. **Monitore os logs** durante o primeiro deploy
4. **Mantenha backups** do banco de dados
5. **Use variáveis de ambiente** para configurações sensíveis

