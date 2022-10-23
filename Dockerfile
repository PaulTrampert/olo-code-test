FROM node:lts-alpine AS build
ARG BUILD_ENV=development

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]
RUN npm install
COPY . .
RUN npm run build

FROM node:lts-alpine AS prod
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build ["/app/package.json", "/app/package-lock.json", "./"]
RUN npm install
COPY --from=build /app/dist/ ./dist/
EXPOSE 8080
CMD ["node", "dist/index"]

FROM prod as dev
ENV NODE_ENV=development
RUN npm install
CMD ["npm", "run", "dev"]

FROM dev as unit-test
RUN apk update && apk add git
CMD ["npm", "run", "test"]