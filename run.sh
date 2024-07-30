#!/bin/bash

cd backend 
set -a
source .env
set +a

cd ../frontend
set -a
source .env
set +a
cd ..

docker compose down && docker compose up --build
