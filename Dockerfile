FROM node:lts-alpine
ARG BUILD_ENV=development

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]
RUN npm install
COPY . .

EXPOSE 8080

CMD ['npm', 'run', 'dev']