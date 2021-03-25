#!/bin/bash

if [ ! -f ".env" ]; then
  cp .env.example .env
fi

npm install

while true; do
  sleep 100
done