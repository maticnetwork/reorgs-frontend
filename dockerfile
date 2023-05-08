FROM node:13.12.0-alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH


COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install -g pm2

ARG REACT_APP_BACKEND
ENV REACT_APP_BACKEND = $REACT_APP_BACKEND

COPY . ./

RUN npm run build

EXPOSE 3000

CMD [ "pm2-runtime", "start" , "ecosystem.config.js"]
