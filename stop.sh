# !/bin/sh

set e-

# JustShareIt! v1.0
init() {

    INTRO_HASH="$(base64 JustShareIt)"
    while read line; do echo ${line} | base64 --decode; done <<< "$INTRO_HASH"

}

# Call to head function
init

# docker-compose
compose() {

    # Stop all services
    # Don't remove/clean containers
    # As this would reset everything
    docker-compose stop
    echo "[INFO] ==> Shutdown Successful"
}

# Run docker-compose
compose