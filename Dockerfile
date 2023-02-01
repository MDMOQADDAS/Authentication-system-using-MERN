FROM node:latest

WORKDIR /myapp

COPY  * ./

COPY views/ /myapp/views/
COPY models/ /myapp/models/

RUN npm i

EXPOSE 80

CMD ["npm", "start"]