# !/bin/sh

# Command line arguments
while [[ "$#" -gt 0 ]]; do case $1 in
  -r|--reset) reset=1;;
  *) echo "Unknown parameter passed: $1"; exit 1;;
esac; shift; done

restart() {

    # Docker-Compose
    echo "[INFO] ==> JustRestartingIt!"
    
    if [ $reset ]
    then
        ./stop.sh -r
    else
        ./stop.sh
    fi

    ./start.sh

}

restart