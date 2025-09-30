#!/bin/bash

# Script de limpeza para ServerTV
# Uso: ./clean.sh

echo "🧹 Limpando ServerTV"
echo "==================="

# Parar todos os containers
echo "🛑 Parando containers..."
docker-compose down

# Remover containers
echo "🗑️  Removendo containers..."
docker-compose rm -f

# Remover imagens
echo "🖼️  Removendo imagens..."
docker-compose down --rmi all

# Limpar volumes órfãos
echo "📦 Removendo volumes órfãos..."
docker volume prune -f

# Limpar cache do Docker
echo "🧹 Limpando cache do Docker..."
docker system prune -f

# Remover diretórios de build
echo "📁 Removendo diretórios de build..."
rm -rf backend/node_modules
rm -rf frontend/node_modules
rm -rf backend/dist
rm -rf frontend/build

# Limpar logs
echo "📋 Limpando logs..."
rm -rf logs/*

# Reconstruir
echo "🔨 Reconstruindo..."
docker-compose build --no-cache

echo "✅ Limpeza concluída!"
echo ""
echo "Para iniciar novamente:"
echo "  ./start.sh"
