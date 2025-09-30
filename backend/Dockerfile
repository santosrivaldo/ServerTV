FROM node:18-alpine

WORKDIR /app

# Instalar dependências do sistema
RUN apk add --no-cache \
    ffmpeg \
    python3 \
    make \
    g++

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar TODAS as dependências (incluindo devDependencies para build)
RUN npm install

# Copiar código fonte
COPY . .

# Compilar aplicação
RUN npm run build

# Remover devDependencies após o build
RUN npm prune --production

# Criar diretórios necessários
RUN mkdir -p /app/videos /app/logs

# Expor porta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "start:prod"]
