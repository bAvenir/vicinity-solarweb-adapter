# Node JS Scaffold

## How to run

* With docker (Uses Nginx proxy)
    * ./setup.sh -- to run development mode
    * ./setup.sh -p -- to run production (If tests fail the process stops)
    * docker-compose up -- to run as development in interactive mode

* Without docker
    * npm run start -- Normal mode
    * npm run dev -- Development mode (Listening to changes)

* Run development tools
    * npm run test -- for jest tests
    * npm run analyze -- for sonarqube analysis 

## Includes:

* Testing
* Security features
* Reverse Proxy
* Docker configuration
* Built-in CI
* Utils (Logger, request, id gen ...)
* Sonarqube scanner