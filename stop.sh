#!/bin/bash

# Script para parar o ServerTV
# Uso: ./stop.sh

echo "🛑 Parando ServerTV - Sistema de Streaming de Vídeos"
echo "================================================"

# Parar todos os serviços
echo "🔄 Parando serviços..."
docker-compose down

# Verificar se todos os containers foram parados
echo "🔍 Verificando status dos containers..."
docker-compose ps

echo ""
echo "✅ ServerTV parado com sucesso!"
echo ""
echo "📊 Para ver logs dos serviços:"
echo "   docker-compose logs"
echo ""
echo "🚀 Para iniciar novamente:"
echo "   ./start.sh"
echo "   ou"
echo "   docker-compose up -d"
