#!/bin/bash

GOOSE_MIGRATION_DIR="/app/sql/schema"
GOOSE_DATABASE_URL="postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}"

echo "Waiting for PostgreSQL to start..."
while ! pg_isready -h $DB_HOST -p $DB_PORT -q -U $DB_USERNAME; do
  sleep 1
done
echo "PostgreSQL started"

echo "Waiting for database to be available..."
until PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -d $DB_DATABASE -c '\l' | grep $DB_DATABASE > /dev/null; do
  sleep 1
done
echo "Database is available"

echo "Running Goose migrations..."
goose -dir "$GOOSE_MIGRATION_DIR" postgres "$GOOSE_DATABASE_URL" up

if [ $? -ne 0 ]; then
  echo "Goose migrations failed"
  exit 1
else
  echo "Goose migrations applied successfully"
fi

echo "Running main binary now."
