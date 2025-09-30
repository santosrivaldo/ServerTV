#!/bin/bash

# Script de restauração para ServerTV
# Uso: ./restore.sh <backup_dir>

BACKUP_DIR="$1"

if [ -z "$BACKUP_DIR" ]; then
    echo "Uso: $0 <backup_dir>"
    echo "Exemplo: $0 ./backups/servertv_backup_20231201_120000"
    exit 1
fi

if [ ! -d "$BACKUP_DIR" ]; then
    echo "❌ Diretório de backup não encontrado: $BACKUP_DIR"
    exit 1
fi

echo "🔄 Iniciando restauração do ServerTV..."
echo "   Backup: $BACKUP_DIR"

# Verificar se os serviços estão rodando
if ! docker-compose ps | grep -q "Up"; then
    echo "⚠️  Serviços não estão rodando. Iniciando..."
    docker-compose up -d
    sleep 10
fi

echo "🗄️  Restaurando banco de dados..."
if [ -f "$BACKUP_DIR/database.sql" ]; then
    docker-compose exec -T postgres psql -U servertv_user -d servertv -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
    docker-compose exec -T postgres psql -U servertv_user -d servertv < "$BACKUP_DIR/database.sql"
    
    if [ $? -eq 0 ]; then
        echo "✅ Banco de dados restaurado com sucesso"
    else
        echo "❌ Erro na restauração do banco de dados"
        exit 1
    fi
else
    echo "⚠️  Arquivo database.sql não encontrado"
fi

echo "📁 Restaurando vídeos..."
if [ -f "$BACKUP_DIR/videos.tar.gz" ]; then
    # Parar serviços que usam vídeos
    docker-compose stop backend frontend nginx
    
    # Remover diretório atual de vídeos
    rm -rf ./videos
    
    # Extrair backup
    tar -xzf "$BACKUP_DIR/videos.tar.gz"
    
    if [ $? -eq 0 ]; then
        echo "✅ Vídeos restaurados com sucesso"
    else
        echo "❌ Erro na restauração dos vídeos"
        exit 1
    fi
    
    # Reiniciar serviços
    docker-compose up -d
else
    echo "⚠️  Arquivo videos.tar.gz não encontrado"
fi

echo "📋 Restaurando logs..."
if [ -f "$BACKUP_DIR/logs.tar.gz" ]; then
    tar -xzf "$BACKUP_DIR/logs.tar.gz"
    echo "✅ Logs restaurados com sucesso"
else
    echo "⚠️  Arquivo logs.tar.gz não encontrado"
fi

echo "⚙️  Restaurando configurações..."
if [ -f "$BACKUP_DIR/docker-compose.yml" ]; then
    cp "$BACKUP_DIR/docker-compose.yml" ./docker-compose.yml.backup
    echo "✅ Configuração do Docker salva como backup"
fi

if [ -f "$BACKUP_DIR/nginx.conf" ]; then
    cp "$BACKUP_DIR/nginx.conf" ./nginx/nginx.conf.backup
    echo "✅ Configuração do Nginx salva como backup"
fi

echo "🔄 Reiniciando serviços..."
docker-compose restart

echo "⏳ Aguardando serviços iniciarem..."
sleep 15

echo "🔍 Verificando status dos serviços..."
docker-compose ps

echo "🎉 Restauração concluída!"
echo "   Verifique se todos os serviços estão rodando: docker-compose ps"
echo "   Acesse o sistema em: http://localhost:3001"
