FROM node:21.6.1-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:21.6.1-alpine
WORKDIR /app
COPY --from=build /app/build ./build
RUN npm install -g serve