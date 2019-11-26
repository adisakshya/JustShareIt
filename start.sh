#!/bin/sh

# Set environment for docker-compose
echo "Setting up environment..."
echo "Creating reference mount..."
sh ./compose_utils/set_compose_env.sh

# Docker-Compose
echo "Getting Ready to JustShareIt!"
docker-compose up --build