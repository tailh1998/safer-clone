FROM node:20.17.0-alpine

WORKDIR /app

RUN if ! command -v yarn > /dev/null; then npm install -g yarn; fi

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

CMD ["yarn", "dev"]
