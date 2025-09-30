# ServerTV - Sistema de Streaming de Vídeos

Sistema completo de streaming de vídeos com arquitetura Docker, autenticação JWT e sistema de playlists hierárquico.

## 🚀 Funcionalidades

### Backend (Node.js + NestJS)
- **API REST** completa com autenticação JWT
- **Upload de vídeos** com transcodificação automática (HLS)
- **Sistema de playlists hierárquico** (Geral, Região, Setor, Loja)
- **Tokens de acesso** com expiração para links seguros
- **Estatísticas** de visualizações e acessos
- **Documentação** automática com Swagger

### Frontend (React + TypeScript)
- **Painel administrativo** moderno e responsivo
- **Upload de vídeos** com drag & drop
- **Gerenciamento de playlists** e usuários
- **Player de vídeo** integrado
- **Dashboard** com estatísticas em tempo real

### Infraestrutura
- **Docker Compose** para orquestração completa
- **PostgreSQL** para banco de dados
- **Nginx** como reverse proxy
- **FFmpeg** para transcodificação de vídeos
- **Armazenamento local** em volumes Docker

## 📋 Pré-requisitos

- Docker e Docker Compose
- 8GB+ de RAM recomendado
- 50GB+ de espaço em disco

## 🛠️ Instalação

1. **Clone o repositório:**
```bash
git clone <repository-url>
cd ServerTV
```

2. **Configure as variáveis de ambiente:**
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite as configurações conforme necessário
nano .env
```

3. **Inicie os serviços:**
```bash
docker-compose up -d
```

4. **Aguarde a inicialização completa:**
```bash
# Verifique os logs
docker-compose logs -f

# Verifique o status dos containers
docker-compose ps
```

## 🌐 Acesso

- **Frontend:** http://localhost:3001
- **API:** http://localhost:3000/api
- **Documentação:** http://localhost:3000/api/docs
- **Nginx (Proxy):** http://localhost:80

## 👤 Credenciais Padrão

- **Email:** admin@servertv.com
- **Senha:** admin123

## 📁 Estrutura do Projeto

```
ServerTV/
├── backend/                 # API Node.js + NestJS
│   ├── src/
│   │   ├── auth/           # Autenticação JWT
│   │   ├── users/          # Gerenciamento de usuários
│   │   ├── videos/         # Upload e streaming
│   │   ├── playlists/     # Sistema hierárquico
│   │   ├── access-tokens/  # Tokens de acesso
│   │   └── stats/          # Estatísticas
│   └── Dockerfile
├── frontend/               # Interface React
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── services/      # Serviços da API
│   │   └── contexts/      # Contextos React
│   └── Dockerfile
├── nginx/                  # Configuração do proxy
├── database/               # Scripts SQL
├── scripts/                # Scripts de transcodificação
├── videos/                 # Armazenamento de vídeos
└── docker-compose.yml      # Orquestração
```

## 🎯 Sistema de Playlists Hierárquico

### Níveis de Acesso
1. **Geral** - Vídeos globais para todos os usuários
2. **Região** - Vídeos específicos por região
3. **Setor** - Vídeos segmentados por setor
4. **Loja** - Vídeos exclusivos por loja

### Controle de Permissões
- **Admin:** Acesso total ao sistema
- **Gerente:** Gerenciamento de conteúdo e usuários
- **Usuário:** Visualização de vídeos autorizados

## 🔐 Segurança

### Autenticação
- **JWT tokens** com expiração configurável
- **Controle de acesso** baseado em papéis
- **Rate limiting** para prevenir abuso

### Links Seguros
- **Tokens temporários** para reprodução
- **Expiração automática** de links
- **Logs de acesso** para auditoria

## 📊 Monitoramento

### Estatísticas Disponíveis
- Total de vídeos e visualizações
- Vídeos mais assistidos
- Acessos por período
- Distribuição por região/setor

### Logs
- **Acesso:** Logs de visualizações
- **Erro:** Logs de sistema
- **Auditoria:** Logs de segurança

## 🚀 Deploy em Produção

### Configurações Recomendadas
```yaml
# docker-compose.override.yml
version: '3.8'
services:
  postgres:
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  backend:
    environment:
      NODE_ENV: production
      JWT_SECRET: ${JWT_SECRET}
    volumes:
      - ./videos:/app/videos
      - ./logs:/app/logs
```

### Backup
```bash
# Backup do banco de dados
docker-compose exec postgres pg_dump -U servertv_user servertv > backup.sql

# Backup dos vídeos
tar -czf videos_backup.tar.gz videos/
```

## 🛠️ Desenvolvimento

### Executar em Modo Desenvolvimento
```bash
# Backend
cd backend
npm install
npm run start:dev

# Frontend
cd frontend
npm install
npm start
```

### Testes
```bash
# Backend
cd backend
npm run test

# Frontend
cd frontend
npm test
```

## 📝 API Documentation

A documentação completa da API está disponível em:
- **Swagger UI:** http://localhost:3000/api/docs
- **OpenAPI Spec:** http://localhost:3000/api/docs-json

### Endpoints Principais

#### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /api/auth/profile` - Perfil do usuário

#### Vídeos
- `GET /api/videos` - Listar vídeos
- `POST /api/videos` - Upload de vídeo
- `GET /api/videos/:id` - Obter vídeo
- `GET /api/videos/:id/stream/:quality` - Stream do vídeo

#### Playlists
- `GET /api/playlists` - Listar playlists
- `POST /api/playlists` - Criar playlist
- `POST /api/playlists/:id/videos` - Adicionar vídeo

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Para suporte e dúvidas:
- Abra uma issue no GitHub
- Consulte a documentação da API
- Verifique os logs dos containers

## 🔄 Atualizações

### v1.0.0
- Sistema completo de streaming
- Autenticação JWT
- Playlists hierárquicas
- Interface administrativa
- Docker Compose
- Documentação completa
