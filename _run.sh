#!/bin/bash
USAGE="$(basename "$0") [-h -e]
-- Runs whole infrastructure
-- Examples
./_run.sh --> DEV mode (Interactive)
./_run.sh -e prod --> PROD mode
Where:
  Flags:
      -h  Shows help
      -e  environment [dev, prod]"

# Default config
MY_ENV="dev"
MY_PATH=$(pwd)

# Get configuration
while getopts 'hd:e:' OPTION; do
case "$OPTION" in
    h)
    echo "$USAGE"
    exit 0
    ;;
    e)
    MY_ENV="$OPTARG"
    ;;
esac
done

# Start proxy container
if [ ${MY_ENV} == "prod" ]; then
    docker-compose -f docker-compose.yml up -d
else
    docker-compose -f docker-compose-dev.yml up
fi