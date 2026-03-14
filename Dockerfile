FROM node:24-alpine

WORKDIR /app

COPY package*.json  ./

RUN npm i

COPY . .

RUN npm run build

EXPOSE 3000
EXPOSE 8080

CMD [ "npm" , "run" ,"dev" ]