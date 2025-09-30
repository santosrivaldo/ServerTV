# Script para criar o banco de dados ServerTV (Windows PowerShell)
# Uso: .\create-database.ps1

Write-Host "🗄️  Criando banco de dados ServerTV..." -ForegroundColor Cyan

# Aguardar o PostgreSQL estar pronto
Write-Host "⏳ Aguardando PostgreSQL estar pronto..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Criar o banco de dados
Write-Host "📦 Criando banco de dados 'servertv'..." -ForegroundColor Yellow
docker-compose exec -T postgres psql -U servertv_user -d postgres -c "CREATE DATABASE servertv;"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Banco de dados 'servertv' criado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro ao criar banco de dados" -ForegroundColor Red
    exit 1
}

# Executar script de inicialização
Write-Host "📋 Executando script de inicialização..." -ForegroundColor Yellow
docker-compose exec -T postgres psql -U servertv_user -d servertv -f /docker-entrypoint-initdb.d/init.sql

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Script de inicialização executado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro ao executar script de inicialização" -ForegroundColor Red
    exit 1
}

Write-Host "🎉 Banco de dados ServerTV configurado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "Para iniciar os serviços:" -ForegroundColor Cyan
Write-Host "  docker-compose up -d" -ForegroundColor White
