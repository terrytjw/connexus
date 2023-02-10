FROM node:lts-slim
WORKDIR /app
COPY . .

RUN yarn
RUN yarn prisma generate
CMD ["yarn", "dev"]