FROM node:21.6.1-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
ARG REACT_APP_API_HOST
ENV REACT_APP_API_HOST=$REACT_APP_API_HOST
RUN npm run build

FROM node:21.6.1-alpine
WORKDIR /app
COPY --from=build /app/build ./build
RUN npm install -g serve