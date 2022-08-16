#!/bin/bash

if [ ! -f ".env.local" ]; then
    cp .env.local.example .env.local
fi

yarn install

yarn dev
