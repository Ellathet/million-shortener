FROM node:22-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i pnpm -g
RUN pnpm install
COPY . .

CMD [ "pnpm", "dev" ]
