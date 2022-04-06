FROM node:lts-alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json /app/

RUN npm install
RUN npm install react-script -g

COPY . /app/

EXPOSE 8081

CMD ["npm", "start"]
