#!/bin/bash

# Script de backup para ServerTV
# Uso: ./backup.sh [backup_dir]

BACKUP_DIR="${1:-./backups}"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="servertv_backup_$DATE"

echo "🚀 Iniciando backup do ServerTV..."

# Criar diretório de backup
mkdir -p "$BACKUP_DIR/$BACKUP_NAME"

echo "📦 Fazendo backup do banco de dados..."
docker-compose exec -T postgres pg_dump -U servertv_user servertv > "$BACKUP_DIR/$BACKUP_NAME/database.sql"

if [ $? -eq 0 ]; then
    echo "✅ Backup do banco de dados concluído"
else
    echo "❌ Erro no backup do banco de dados"
    exit 1
fi

echo "📁 Fazendo backup dos vídeos..."
if [ -d "./videos" ]; then
    tar -czf "$BACKUP_DIR/$BACKUP_NAME/videos.tar.gz" -C . videos/
    echo "✅ Backup dos vídeos concluído"
else
    echo "⚠️  Diretório de vídeos não encontrado"
fi

echo "📋 Fazendo backup dos logs..."
if [ -d "./logs" ]; then
    tar -czf "$BACKUP_DIR/$BACKUP_NAME/logs.tar.gz" -C . logs/
    echo "✅ Backup dos logs concluído"
else
    echo "⚠️  Diretório de logs não encontrado"
fi

echo "📄 Fazendo backup das configurações..."
cp docker-compose.yml "$BACKUP_DIR/$BACKUP_NAME/"
cp nginx/nginx.conf "$BACKUP_DIR/$BACKUP_NAME/nginx.conf"
cp -r database/ "$BACKUP_DIR/$BACKUP_NAME/database/"
cp -r scripts/ "$BACKUP_DIR/$BACKUP_NAME/scripts/"
echo "✅ Backup das configurações concluído"

# Criar arquivo de informações do backup
cat > "$BACKUP_DIR/$BACKUP_NAME/backup_info.txt" << EOF
ServerTV Backup Information
==========================
Date: $(date)
Backup Name: $BACKUP_NAME
Database: PostgreSQL
Videos: $(du -sh ./videos 2>/dev/null | cut -f1 || echo "N/A")
Logs: $(du -sh ./logs 2>/dev/null | cut -f1 || echo "N/A")

Files included:
- database.sql (PostgreSQL dump)
- videos.tar.gz (Video files)
- logs.tar.gz (Application logs)
- docker-compose.yml (Docker configuration)
- nginx.conf (Nginx configuration)
- database/ (Database scripts)
- scripts/ (Utility scripts)

To restore:
1. Extract videos: tar -xzf videos.tar.gz
2. Extract logs: tar -xzf logs.tar.gz
3. Restore database: psql -U servertv_user servertv < database.sql
4. Restart services: docker-compose up -d
EOF

echo "📊 Informações do backup:"
echo "   Diretório: $BACKUP_DIR/$BACKUP_NAME"
echo "   Tamanho: $(du -sh "$BACKUP_DIR/$BACKUP_NAME" | cut -f1)"
echo "   Arquivos: $(find "$BACKUP_DIR/$BACKUP_NAME" -type f | wc -l)"

echo "🎉 Backup concluído com sucesso!"
echo "   Localização: $BACKUP_DIR/$BACKUP_NAME"
