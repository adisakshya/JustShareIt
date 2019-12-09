# !/bin/sh

# Command line arguments
while [[ "$#" -gt 0 ]]; do case $1 in
  -r|--reset) reset=1;;
  *) echo "Unknown parameter passed: $1"; exit 1;;
esac; shift; done

# JustShareIt! v1.0
init() {

    INTRO_HASH="$(base64 JustShareIt)"
    while read line; do echo ${line} | base64 --decode; done <<< "$INTRO_HASH"

}

# Call to head function
init

# docker-compose
compose() {

    if [ $reset ]
    then
        # Docker-Compose Down
        echo "[INFO] ==> Cleaning Up..."
        docker-compose down -v
    else
        # Stop all services
        # Don't remove/clean containers
        # As this would reset everything
        docker-compose stop
    fi

    echo "[INFO] ==> Shutdown Successful"
}

# Run docker-compose command
compose