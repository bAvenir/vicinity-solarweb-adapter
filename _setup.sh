#!/bin/bash
USAGE="$(basename "$0") [-h -p -l]
-- Prepares prod or dev mode
-- Deletes old images
-- Examples
./run.sh -p
Where:
  Flags:
      -h  Shows help
      -l  Activates local (Has priority if enabled)
      -p  Activates production mode"

# Default config
SSL="false"
LOCAL="false"
MY_PATH=$(pwd)

# Get configuration
while getopts 'hd:pd:ld:' OPTION; do
case "$OPTION" in
    h)
    echo "$USAGE"
    exit 0
    ;;
    l)
    LOCAL="true"
    ;;
    p)
    SSL="true"
    ;;
esac
done

# Kill and remove old proxy containers
docker kill proxy nodejs-scaffold gateway
docker rm proxy nodejs-scaffold gateway
docker rmi nodejs-scaffold
docker rm $(docker ps -a -q) # Remove zombi containers

# Start proxy container
if [ ${LOCAL} == "true" ]; then
    docker run -p 8181:8181 -d --name gateway \
        -v ${MY_PATH}/gateway/GatewayConfig.xml:/gateway/config/GatewayConfig.xml:ro \
        bavenir/vicinity-gateway-api:latest
    npm run dev
else 
    if [ ${SSL} == "false" ]; then
        docker-compose -f docker-compose.yml up -d
    else
        docker-compose -f docker-compose-prod.yml up -d
    fi
fi