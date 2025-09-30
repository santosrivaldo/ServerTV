# Script de inicialização para ServerTV (Windows PowerShell)
# Uso: .\start.ps1

Write-Host "🚀 Iniciando ServerTV - Sistema de Streaming de Vídeos" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Verificar se Docker está instalado
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker não está instalado. Por favor, instale o Docker primeiro." -ForegroundColor Red
    exit 1
}

if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro." -ForegroundColor Red
    exit 1
}

# Criar diretórios necessários
Write-Host "📁 Criando diretórios necessários..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "videos" | Out-Null
New-Item -ItemType Directory -Force -Path "logs" | Out-Null
New-Item -ItemType Directory -Force -Path "backups" | Out-Null

# Verificar se o arquivo .env existe
if (-not (Test-Path ".env")) {
    Write-Host "⚙️  Criando arquivo de configuração..." -ForegroundColor Yellow
    Copy-Item "env.example" ".env"
    Write-Host "✅ Arquivo .env criado. Você pode editá-lo se necessário." -ForegroundColor Green
}

# Parar containers existentes
Write-Host "🛑 Parando containers existentes..." -ForegroundColor Yellow
docker-compose down

# Limpar cache do Docker
Write-Host "🧹 Limpando cache do Docker..." -ForegroundColor Yellow
docker system prune -f

# Construir e iniciar os serviços
Write-Host "🔨 Construindo e iniciando serviços..." -ForegroundColor Yellow
docker-compose up -d --build --force-recreate

# Aguardar os serviços iniciarem
Write-Host "⏳ Aguardando serviços iniciarem..." -ForegroundColor Yellow
Start-Sleep -Seconds 60

# Verificar status dos serviços
Write-Host "🔍 Verificando status dos serviços..." -ForegroundColor Yellow
docker-compose ps

# Verificar se todos os serviços estão rodando
Write-Host "🔍 Verificando saúde dos serviços..." -ForegroundColor Yellow
$services = @("postgres", "backend", "frontend", "nginx")
foreach ($service in $services) {
    $status = docker-compose ps | Select-String "$service.*Up"
    if ($status) {
        Write-Host "✅ $service está rodando" -ForegroundColor Green
    } else {
        Write-Host "❌ $service não está rodando" -ForegroundColor Red
        Write-Host "Logs do $service:" -ForegroundColor Yellow
        docker-compose logs --tail=20 $service
    }
}

Write-Host ""
Write-Host "🎉 ServerTV iniciado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Acesse o sistema:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3001" -ForegroundColor White
Write-Host "   API: http://localhost:3000/api" -ForegroundColor White
Write-Host "   Documentação: http://localhost:3000/api/docs" -ForegroundColor White
Write-Host "   Proxy: http://localhost:80" -ForegroundColor White
Write-Host ""
Write-Host "👤 Credenciais padrão:" -ForegroundColor Cyan
Write-Host "   Email: admin@servertv.com" -ForegroundColor White
Write-Host "   Senha: admin123" -ForegroundColor White
Write-Host ""
Write-Host "📊 Para monitorar os serviços:" -ForegroundColor Cyan
Write-Host "   docker-compose logs -f" -ForegroundColor White
Write-Host ""
Write-Host "🛑 Para parar os serviços:" -ForegroundColor Cyan
Write-Host "   docker-compose down" -ForegroundColor White
Write-Host ""
Write-Host "🔄 Para reiniciar os serviços:" -ForegroundColor Cyan
Write-Host "   docker-compose restart" -ForegroundColor White
