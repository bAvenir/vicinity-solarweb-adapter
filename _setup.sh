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

# Initial folder setup
mkdir -p ${MY_PATH}/gateway/log
mkdir -p ${MY_PATH}/gateway/data
mkdir -p ${MY_PATH}/agent/exports
mkdir -p ${MY_PATH}/log
touch ${MY_PATH}/agent/exports/events.json  
touch ${MY_PATH}/agent/exports/properties.json
touch ${MY_PATH}/agent/exports/actions.json
touch ${MY_PATH}/agent/exports/registrations.json

# Kill and remove old proxy containers
docker kill proxy bavenir-adapter gateway
docker rm proxy bavenir-adapter gateway
docker rmi bavenir-adapter
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