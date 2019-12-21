#! /bin/bash

# Shell Script for exporting docker-machine ip
# as environment variable
# for Windows, macOS & Linux

set -e

# Update SOURCE path in .env for docker-compose.yml
case "$OSTYPE" in
    linux*) echo "export DOCKER_IP='localhost'" > ./dockerenv ; exit ;
esac

function docker_ready(){
  docker_exec="$(docker-machine active)"
}

function docker_machine_ip(){
  echo "export DOCKER_IP='$(docker-machine ip)'" > ./dockerenv
  echo "[INFO] => docker-machine ip detected"
}

flag=0
if docker_ready; then
    echo "[INFO] => docker-machine is active"
    docker_machine_ip
else
    echo "[INFO] => docker-machine isn't active"
    echo "[INFO] => Trying to start docker-machine...please be patient!"
    start_machine="$(docker-machine start default)"
    flag=1
fi

if [ "$flag" -eq 1 ]; then
    if docker_ready; then
        echo "[INFO] => docker-machine started successfully!"
        docker_machine_ip
    else
        echo "[INFO] => docker-machine failed to start"
    fi
fi
