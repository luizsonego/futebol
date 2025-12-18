#!/bin/bash

# Script para executar migrações durante o build
# Usa migrate deploy se disponível, caso contrário usa db push

set -e

echo "🔄 Executando migrações do banco de dados..."

# Tentar executar migrate deploy primeiro
if npx prisma migrate deploy; then
  echo "✅ Migrações aplicadas com sucesso via migrate deploy"
else
  echo "⚠️ migrate deploy falhou, tentando db push..."
  if npx prisma db push --accept-data-loss; then
    echo "✅ Schema sincronizado via db push"
  else
    echo "❌ Erro ao aplicar migrações"
    exit 1
  fi
fi

