FROM node:18-alpine
WORKDIR /creator-economy
COPY . .
RUN yarn install --production
CMD ["yarn", "dev"]
EXPOSE 3000