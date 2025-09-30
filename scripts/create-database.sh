#!/bin/bash

# Script para criar o banco de dados ServerTV
# Uso: ./create-database.sh

echo "🗄️  Criando banco de dados ServerTV..."

# Aguardar o PostgreSQL estar pronto
echo "⏳ Aguardando PostgreSQL estar pronto..."
sleep 10

# Criar o banco de dados
echo "📦 Criando banco de dados 'servertv'..."
docker-compose exec -T postgres psql -U servertv_user -d postgres -c "CREATE DATABASE servertv;"

if [ $? -eq 0 ]; then
    echo "✅ Banco de dados 'servertv' criado com sucesso!"
else
    echo "❌ Erro ao criar banco de dados"
    exit 1
fi

# Executar script de inicialização
echo "📋 Executando script de inicialização..."
docker-compose exec -T postgres psql -U servertv_user -d servertv -f /docker-entrypoint-initdb.d/init.sql

if [ $? -eq 0 ]; then
    echo "✅ Script de inicialização executado com sucesso!"
else
    echo "❌ Erro ao executar script de inicialização"
    exit 1
fi

echo "🎉 Banco de dados ServerTV configurado com sucesso!"
echo ""
echo "Para iniciar os serviços:"
echo "  docker-compose up -d"
