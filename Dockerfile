FROM node:lts-slim
WORKDIR /app
COPY . .

RUN yarn install
CMD ["yarn", "dev"]