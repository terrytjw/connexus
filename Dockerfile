FROM node:lts-slim
WORKDIR /app
COPY . .

RUN yarn
CMD ["yarn", "dev"]