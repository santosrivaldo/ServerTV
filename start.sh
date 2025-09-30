#!/bin/bash

# Script de inicialização rápida para ServerTV
# Uso: ./start.sh

echo "🚀 Iniciando ServerTV - Sistema de Streaming de Vídeos"
echo "=================================================="

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Por favor, instale o Docker primeiro."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
    exit 1
fi

# Criar diretórios necessários
echo "📁 Criando diretórios necessários..."
mkdir -p videos
mkdir -p logs
mkdir -p backups

# Verificar se o arquivo .env existe
if [ ! -f ".env" ]; then
    echo "⚙️  Criando arquivo de configuração..."
    cp env.example .env
    echo "✅ Arquivo .env criado. Você pode editá-lo se necessário."
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down

# Limpar imagens antigas para evitar cache
echo "🧹 Limpando cache do Docker..."
docker system prune -f

# Construir e iniciar os serviços
echo "🔨 Construindo e iniciando serviços..."
docker-compose up -d --build --force-recreate

# Aguardar os serviços iniciarem
echo "⏳ Aguardando serviços iniciarem..."
sleep 45

# Verificar status dos serviços
echo "🔍 Verificando status dos serviços..."
docker-compose ps

# Verificar se todos os serviços estão rodando
echo "🔍 Verificando saúde dos serviços..."
for service in postgres backend frontend nginx; do
    if docker-compose ps | grep -q "$service.*Up"; then
        echo "✅ $service está rodando"
    else
        echo "❌ $service não está rodando"
        echo "Logs do $service:"
        docker-compose logs --tail=20 $service
    fi
done

# Verificar logs de inicialização
echo "📋 Verificando logs de inicialização..."
echo "Backend:"
docker-compose logs --tail=10 backend

echo ""
echo "Frontend:"
docker-compose logs --tail=10 frontend

echo ""
echo "PostgreSQL:"
docker-compose logs --tail=5 postgres

echo ""
echo "Nginx:"
docker-compose logs --tail=5 nginx

echo ""
echo "🎉 ServerTV iniciado com sucesso!"
echo ""
echo "📱 Acesse o sistema:"
echo "   Frontend: http://localhost:3001"
echo "   API: http://localhost:3000/api"
echo "   Documentação: http://localhost:3000/api/docs"
echo "   Proxy: http://localhost:80"
echo ""
echo "👤 Credenciais padrão:"
echo "   Email: admin@servertv.com"
echo "   Senha: admin123"
echo ""
echo "📊 Para monitorar os serviços:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Para parar os serviços:"
echo "   docker-compose down"
echo ""
echo "🔄 Para reiniciar os serviços:"
echo "   docker-compose restart"
echo ""
echo "🔧 Para ver logs de um serviço específico:"
echo "   docker-compose logs -f [nome_do_serviço]"
