FROM node:8

RUN mkdir /usr/src/app

WORKDIR /usr/src/app

# COPY . .

# RUN cp .env.docker .env

# RUN npm install

RUN npm install -g @adonisjs/cli

CMD ["adonis", "serve", "--dev", "--polling"]
