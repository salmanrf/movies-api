FROM node:lts-alpine3.16

WORKDIR /app

COPY . /app

RUN addgroup app && adduser -S -G app app
RUN mkdir node_modules/.cache
RUN chown app:app node_modules/.cache

CMD ["yarn"]