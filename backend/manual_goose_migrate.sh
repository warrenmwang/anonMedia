#!/bin/bash

# Script for development database migrations
if [ -e ".env" ]; then
    source .env
else 
    exit 1
fi

GOOSE_MIGRATION_DIR="./sql/schema"
GOOSE_DATABASE_URL="postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}"
goose -dir "$GOOSE_MIGRATION_DIR" postgres "$GOOSE_DATABASE_URL" $1