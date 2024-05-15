FROM node:18-bullseye as bot
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
ARG PORT
EXPOSE 3000
RUN echo "Iniciando bot..."
CMD ["npm", "run", "dev"]