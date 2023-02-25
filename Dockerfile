FROM node:lts-slim
WORKDIR /app
COPY . .

RUN apt-get update && apt-get install -y build-essential && apt-get install python3 -y

RUN yarn
RUN yarn prisma generate
CMD ["yarn", "dev"]