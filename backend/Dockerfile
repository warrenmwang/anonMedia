FROM golang:1.22
RUN apt-get update && apt-get upgrade -y 
RUN apt-get install -y postgresql-client
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download && go mod verify
RUN go install github.com/pressly/goose/v3/cmd/goose@latest
COPY . .
RUN go build -o main cmd/api/main.go