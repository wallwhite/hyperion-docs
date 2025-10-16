#!/usr/bin/env bash

ROOT_DIR=$(dirname $(dirname $(realpath $0)))

docker compose -f $ROOT_DIR/docker-compose.dev.yml down -v