#!/bin/sh

# Configure the container for bind-mount
# Sets variables in .env
WIN_PATH="/c/Users"
UBU_PATH="/usr"
MAC_PATH=""

# Update SOURCE path in .env for docker-compose.yml
case "$OSTYPE" in
  darwin*)  echo "SOURCE=$MAC_PATH" > ./.env ;; 
  linux*)   echo "SOURCE=$UBU_PATH" > ./.env ;;
  msys*)    echo "SOURCE=$WIN_PATH" > ./.env ;;
  *)        export HOST_OS="unknown: $OSTYPE" ;;
esac