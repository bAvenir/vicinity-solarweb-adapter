# bAvenir VICINITY adapter

This is a Node.js project that acts as an adapter between VICINITY and other technologies or applications.

The first version aims to support the following interactions:

* Data collection service
* REST API to VCNT
* MQTT server to VCNT

## Pre-requisites

### Mandatory 

* Node.js > v12
* Docker

### Recommended for full functionality

* Docker-compose
* Sonarqube server

## How to run

* With docker (Uses Nginx proxy)
    * ./_setup.sh -> to run development mode
    * ./_setup.sh -p -> to run production (If tests fail the process stops)
    * docker-compose up -> to run as development in interactive mode

* Without docker
    * ./_setup.sh -l -> to run development mode

* Run development tools
    * npm run test -> for jest tests
    * npm run analyze -> for sonarqube analysis 

## Configuration

Use a .env file

* ENV_VAR=SOMETHING

Example:

    # Configuration
    NODE_ENV=development
    ## SERVER
    SERVER_PORT=9997
    SERVER_IP=0.0.0.0
    SERVER_TIMEOUT=10000
    SERVER_MAX_PAYLOAD=100kb
    ## GATEWAY
    GTW_HOST="localhost"
    GTW_PORT=8181
    GTW_CALLBACK_ROUTE=agent
    GTW_ROUTE=api
    GTW_TIMEOUT=10000
    GTW_ID=""
    GTW_PWD=""
    ## Sonar-scanner
    SONAR_URL=http://localhost:9000
    SONAR_TOKEN=<ADD_YOUR_TOKEN>
    SONAR_PROJECT_NAME=<ADD_YOUR_PROJECT_NAME>
    SONAR_SOURCES=src
    SONAR_INCLUSIONS=**
    SONAR_TESTS=src/_test
    SONAR_TEST_FILE_PATH=./coverage/test-reporter.xml
    SONAR_COVERAGE_FILE_PATH=./coverage/lcov.info

Load into app using process.env.ENV_VAR and the npm package dotenv.

## Includes

* Testing
* Security features
* Reverse Proxy
* Docker configuration
* Built-in CI
* Utils (Logger, request, id gen ...)
* Sonarqube scanner