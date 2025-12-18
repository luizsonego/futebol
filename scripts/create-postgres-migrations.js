#!/usr/bin/env node

/**
 * Script para criar migrações PostgreSQL a partir do schema atual
 * Use este script antes do primeiro deploy na Vercel
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔄 Criando migrações PostgreSQL...\n');

// Verificar se DATABASE_URL está configurada
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl || !databaseUrl.startsWith('postgres')) {
  console.error('❌ Erro: DATABASE_URL deve ser uma connection string PostgreSQL');
  console.error('   Exemplo: postgresql://user:password@host:port/database');
  console.error('\n💡 Configure a variável de ambiente:');
  console.error('   export DATABASE_URL="postgresql://..."');
  process.exit(1);
}

try {
  // Atualizar o schema para PostgreSQL
  console.log('1️⃣ Configurando schema para PostgreSQL...');
  execSync('npm run db:setup', { stdio: 'inherit' });

  // Gerar o cliente Prisma
  console.log('\n2️⃣ Gerando Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Criar migração inicial para PostgreSQL
  console.log('\n3️⃣ Criando migração inicial para PostgreSQL...');
  console.log('   (Isso criará uma nova migração baseada no schema atual)\n');
  
  execSync('npx prisma migrate dev --name init_postgres --create-only', { stdio: 'inherit' });

  console.log('\n✅ Migrações PostgreSQL criadas com sucesso!');
  console.log('\n📝 Próximos passos:');
  console.log('   1. Revise as migrações em prisma/migrations/');
  console.log('   2. Commit as migrações no Git');
  console.log('   3. Faça o deploy na Vercel');
  
} catch (error) {
  console.error('\n❌ Erro ao criar migrações:', error.message);
  process.exit(1);
}

