#!/usr/bin/env node

/**
 * Script para configurar o provider do Prisma baseado na DATABASE_URL
 * Detecta automaticamente se é PostgreSQL ou SQLite
 */

const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db';

// Detectar provider baseado na URL
let provider = 'sqlite';
if (databaseUrl.startsWith('postgresql://') || databaseUrl.startsWith('postgres://')) {
  provider = 'postgresql';
}

// Ler o schema atual
let schema = fs.readFileSync(schemaPath, 'utf8');

// Atualizar o provider no datasource
const datasourceRegex = /datasource db \{[^}]*\}/s;
const newDatasource = `datasource db {
  provider = "${provider}"
  url      = env("DATABASE_URL")
}`;

schema = schema.replace(datasourceRegex, newDatasource);

// Escrever o schema atualizado
fs.writeFileSync(schemaPath, schema, 'utf8');

console.log(`✅ Schema configurado para usar ${provider}`);
if (process.env.VERCEL) {
  console.log(`🚀 Ambiente: Vercel (Produção)`);
} else {
  console.log(`💻 Ambiente: Desenvolvimento`);
}

