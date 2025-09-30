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

# Instalar dependências (usando npm install em vez de npm ci)
RUN npm install --omit=dev

# Copiar código fonte
COPY . .

# Compilar aplicação
RUN npm run build

# Criar diretórios necessários
RUN mkdir -p /app/videos /app/logs

# Expor porta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "start:prod"]
