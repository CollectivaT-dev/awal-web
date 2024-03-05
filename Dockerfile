FROM node:20.11-alpine

COPY . /app/

WORKDIR /app

RUN npm i 

RUN npm rebuild

CMD ["npm", "run", "dev"]