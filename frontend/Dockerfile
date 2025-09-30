FROM node:18-alpine as build

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# Compilar aplicação
RUN npm run build

# Estágio de produção
FROM nginx:alpine

# Copiar arquivos compilados
COPY --from=build /app/build /usr/share/nginx/html

# Copiar configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta
EXPOSE 3000

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
