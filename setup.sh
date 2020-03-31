#!/bin/bash
USAGE="$(basename "$0") [-h -p]
-- Prepares prod or dev mode
-- Deletes old images
-- Examples
./run.sh -p
Where:
  Flags:
      -h  shows help
      -p  Activates production mode"

# Default config
SSL="false"

# Get configuration
while getopts 'hd:sd:p:' OPTION; do
case "$OPTION" in
    h)
    echo "$USAGE"
    exit 0
    ;;
    p)
    SSL="true"
    ;;
esac
done

# Kill and remove old proxy containers
docker kill proxy nodejs-scaffold
docker rm proxy nodejs-scaffold
docker rmi nodejs-scaffold
docker rm $(docker ps -a -q) # Remove zombi containers

# Start proxy container
if [ ${SSL} == "false" ]; then
    docker-compose -f docker-compose.yml up -d
else
    docker-compose -f docker-compose-prod.yml up -d
fi