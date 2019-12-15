# !/bin/bash

set -e

function countdown() {
  secs=$1
  shift
  msg=$@
  while [ $secs -gt 0 ]
  do
    printf "\r\033[KWaiting %.d seconds $msg" $((secs--))
    sleep 1
  done
  echo
}

function db_ready(){
  docker_exec="$(docker exec -i JustShareIt_db mysql -uroot -proot <<< 'SHOW DATABASES')"
}

countdown 17 "for database to get ready..."

until db_ready; do
  >&2 echo 'Waiting for database to become available...'
  sleep 1
done
>&2 echo 'Database is up and running!'

exec "$@"