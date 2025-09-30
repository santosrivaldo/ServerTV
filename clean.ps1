# Script de limpeza para ServerTV (Windows PowerShell)
# Uso: .\clean.ps1

Write-Host "🧹 Limpando ServerTV" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan

# Parar todos os containers
Write-Host "🛑 Parando containers..." -ForegroundColor Yellow
docker-compose down

# Remover containers
Write-Host "🗑️  Removendo containers..." -ForegroundColor Yellow
docker-compose rm -f

# Remover imagens
Write-Host "🖼️  Removendo imagens..." -ForegroundColor Yellow
docker-compose down --rmi all

# Limpar volumes órfãos
Write-Host "📦 Removendo volumes órfãos..." -ForegroundColor Yellow
docker volume prune -f

# Limpar cache do Docker
Write-Host "🧹 Limpando cache do Docker..." -ForegroundColor Yellow
docker system prune -f

# Remover diretórios de build
Write-Host "📁 Removendo diretórios de build..." -ForegroundColor Yellow
if (Test-Path "backend\node_modules") { Remove-Item -Recurse -Force "backend\node_modules" }
if (Test-Path "frontend\node_modules") { Remove-Item -Recurse -Force "frontend\node_modules" }
if (Test-Path "backend\dist") { Remove-Item -Recurse -Force "backend\dist" }
if (Test-Path "frontend\build") { Remove-Item -Recurse -Force "frontend\build" }

# Limpar logs
Write-Host "📋 Limpando logs..." -ForegroundColor Yellow
if (Test-Path "logs") { Remove-Item -Recurse -Force "logs\*" }

# Reconstruir
Write-Host "🔨 Reconstruindo..." -ForegroundColor Yellow
docker-compose build --no-cache

Write-Host "✅ Limpeza concluída!" -ForegroundColor Green
Write-Host ""
Write-Host "Para iniciar novamente:" -ForegroundColor Cyan
Write-Host "  docker-compose up -d --build" -ForegroundColor White
