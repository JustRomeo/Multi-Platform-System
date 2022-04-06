FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN node generateKeyPair.js
EXPOSE 8080

CMD ["npm", "start"]
