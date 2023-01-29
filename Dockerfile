FROM node:lts-alpine3.16

WORKDIR /app

COPY . /app

CMD ["yarn"]