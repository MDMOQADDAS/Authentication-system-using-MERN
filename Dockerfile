FROM node:latest

WORKDIR /myapp

COPY  * ./

COPY views/ /myapp/views/

RUN npm i

EXPOSE 80

CMD ["npm", "start"]