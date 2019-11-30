# !/bin/sh

# Command line arguments
while [[ "$#" -gt 0 ]]; do case $1 in
  -i|--interactive) interactive_mode=1;;
  *) echo "Unknown parameter passed: $1"; exit 1;;
esac; shift; done

# JustShareIt! v1.0
init() {

    INTRO_HASH="$(base64 JustShareIt)"
    while read line; do echo ${line} | base64 --decode; done <<< "$INTRO_HASH"

}

# Call to head function
init

# Set environment for docker-compose
echo "[INFO] ==> Setting up environment..."
echo "[INFO] ==> Creating reference mount..."

# Configure the container for bind-mount
# Sets variables in .env
set_compose_env() {
    
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

}

# docker-compose
compose() {

    # Docker-Compose
    echo "[INFO] ==> Getting things ready to JustShareIt!"
    
    if [ $interactive_mode ]
    then
        echo "[INFO] ==> Running in Interactive Mode"
        echo "[INFO] ==> Use KEYBOARD_INTERRUPT to shutdown"
        docker-compose up --build

        echo "[INFO] ==> Cleaning up"
        docker-compose down
        echo "[INFO] ==> Shutdown Successful"
    else
        echo "[INFO] ==> Running in Detach Mode"
        echo "[INFO] ==> Use stop command to shutdown"
        docker-compose up -d --build
    fi

}

# Call to set environment variables for docker-compose
# and run docker-compose
set_compose_env && compose