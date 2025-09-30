#!/bin/bash

# Script de diagnóstico para ServerTV
# Uso: ./diagnose.sh

echo "🔍 Diagnóstico do ServerTV"
echo "========================="

# Verificar Docker
echo "🐳 Verificando Docker..."
if command -v docker &> /dev/null; then
    echo "✅ Docker instalado: $(docker --version)"
else
    echo "❌ Docker não instalado"
    exit 1
fi

if command -v docker-compose &> /dev/null; then
    echo "✅ Docker Compose instalado: $(docker-compose --version)"
else
    echo "❌ Docker Compose não instalado"
    exit 1
fi

# Verificar arquivos necessários
echo ""
echo "📁 Verificando arquivos necessários..."
required_files=(
    "docker-compose.yml"
    "backend/package.json"
    "frontend/package.json"
    "nginx/nginx.conf"
    "database/init.sql"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file não encontrado"
    fi
done

# Verificar diretórios
echo ""
echo "📂 Verificando diretórios..."
required_dirs=(
    "backend"
    "frontend"
    "nginx"
    "database"
    "scripts"
)

for dir in "${required_dirs[@]}"; do
    if [ -d "$dir" ]; then
        echo "✅ $dir/"
    else
        echo "❌ $dir/ não encontrado"
    fi
done

# Verificar status dos containers
echo ""
echo "🐳 Verificando containers..."
if docker-compose ps &> /dev/null; then
    docker-compose ps
else
    echo "❌ Erro ao verificar containers"
fi

# Verificar logs de erro
echo ""
echo "📋 Verificando logs de erro..."
services=("postgres" "backend" "frontend" "nginx")

for service in "${services[@]}"; do
    echo "--- Logs do $service ---"
    if docker-compose logs --tail=5 $service 2>/dev/null | grep -i error; then
        echo "❌ Erros encontrados no $service"
    else
        echo "✅ $service sem erros aparentes"
    fi
done

# Verificar portas
echo ""
echo "🌐 Verificando portas..."
ports=(3000 3001 5432 80)
for port in "${ports[@]}"; do
    if netstat -tuln 2>/dev/null | grep -q ":$port "; then
        echo "✅ Porta $port está em uso"
    else
        echo "⚠️  Porta $port não está em uso"
    fi
done

# Verificar espaço em disco
echo ""
echo "💾 Verificando espaço em disco..."
df -h | head -1
df -h | grep -E "(/$|/var|/tmp)"

# Verificar memória
echo ""
echo "🧠 Verificando memória..."
if command -v free &> /dev/null; then
    free -h
else
    echo "⚠️  Comando 'free' não disponível"
fi

# Verificar conectividade
echo ""
echo "🌐 Verificando conectividade..."
if curl -s http://localhost:3000/api > /dev/null; then
    echo "✅ API acessível"
else
    echo "❌ API não acessível"
fi

if curl -s http://localhost:3001 > /dev/null; then
    echo "✅ Frontend acessível"
else
    echo "❌ Frontend não acessível"
fi

echo ""
echo "🔧 Comandos úteis:"
echo "   docker-compose logs -f [serviço]  # Ver logs de um serviço"
echo "   docker-compose restart [serviço] # Reiniciar um serviço"
echo "   docker-compose down              # Parar todos os serviços"
echo "   docker-compose up -d --build     # Reconstruir e iniciar"
