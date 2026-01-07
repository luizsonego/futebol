# 🚀 Guia de Deploy para Vercel

Este projeto foi configurado para usar **PostgreSQL** em produção na Vercel, pois SQLite não é adequado para ambientes serverless.

## 📋 Configuração na Vercel

### 1. Variáveis de Ambiente

Configure as seguintes variáveis de ambiente no painel da Vercel:

```
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19UdDB5ZGJOTXhUSHBEMVdoNjV5NFUiLCJhcGlfa2V5IjoiMDFLQ1NEMUpQSzQ0OE5ZTVhRTktWSFhENDUiLCJ0ZW5hbnRfaWQiOiI0MjU2YjMyODNhY2NiOTZkOGJlY2I3ZWQ1NmI0NjI0MTJkZmMxYjYyYjhjZTM2ZTAzNDY4NWU5MTc1YTNjMzY3IiwiaW50ZXJuYWxfc2VjcmV0IjoiMjM1MDBjZjAtMWEzNC00ZDRiLWI0YjgtZmZjZDE2OWQzN2JiIn0.pMQxxsK1JwGDgnWEMC6gLo7jHLNcehg1VJYSJILWCho"
```

**Ou use a URL direta do PostgreSQL:**

```
DATABASE_URL="postgres://4256b3283accb96d8becb7ed56b462412dfc1b62b8ce36e034685e9175a3c367:sk_Tt0ydbNMxTHpD1Wh65y4U@db.prisma.io:5432/postgres?sslmode=require"
```

### 2. Primeira Migração

Antes do primeiro deploy, você precisa criar e aplicar a migração inicial:

```bash
# Localmente (com DATABASE_URL apontando para o PostgreSQL de produção)
npx prisma migrate dev --name init
```

**OU** se preferir fazer via Vercel:

1. Configure a variável `DATABASE_URL` na Vercel
2. No build, o comando `prisma migrate deploy` será executado automaticamente
3. Certifique-se de que as migrações estão commitadas no repositório

### 3. Scripts de Build

O `package.json` foi atualizado para usar migrações em produção:

- **Build**: `prisma generate && prisma migrate deploy && next build`
- **Desenvolvimento**: Continue usando `prisma db push` localmente se necessário

### 4. Desenvolvimento Local

Para desenvolvimento local, você pode:

**Opção A**: Usar PostgreSQL localmente (recomendado)
```bash
# Configure DATABASE_URL no .env local apontando para seu PostgreSQL
DATABASE_URL="postgres://user:password@localhost:5432/classificacao"
```

**Opção B**: Continuar usando SQLite temporariamente (apenas para desenvolvimento)
```bash
# No schema.prisma, altere temporariamente para:
# provider = "sqlite"
# url = "file:./dev.db"
```

⚠️ **Importante**: Sempre teste com PostgreSQL antes de fazer deploy!

## 🔄 Migração de Dados (se necessário)

Se você já tem dados no SQLite local e precisa migrar para PostgreSQL:

1. Exporte os dados do SQLite:
```bash
npx prisma db pull  # Se necessário
```

2. Configure o PostgreSQL como destino
3. Execute as migrações
4. Importe os dados manualmente ou use ferramentas de migração

## ✅ Checklist de Deploy

- [ ] Variável `DATABASE_URL` configurada na Vercel
- [ ] Migrações criadas e commitadas (`prisma/migrations/`)
- [ ] Schema do Prisma atualizado para PostgreSQL
- [ ] Testado localmente com PostgreSQL
- [ ] Build passa sem erros

## 🆘 Troubleshooting

### Erro: "Migration engine failed to connect"

- Verifique se a `DATABASE_URL` está correta
- Certifique-se de que o banco está acessível
- Verifique as configurações de SSL se necessário

### Erro: "Migration not found"

- Execute `npx prisma migrate dev` localmente primeiro
- Commit as migrações geradas em `prisma/migrations/`

### Dados não persistem

- SQLite não funciona na Vercel - você DEVE usar PostgreSQL
- Verifique se a `DATABASE_URL` está apontando para o PostgreSQL correto

