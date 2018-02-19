FROM node:8

RUN mkdir /usr/src/app

WORKDIR /usr/src/app

RUN npm install -g @adonisjs/cli

CMD ["adonis", "serve", "--dev", "--polling"]
