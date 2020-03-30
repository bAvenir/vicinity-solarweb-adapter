// Load third party packages
const stoppable  = require('stoppable');

// Load modules
const config = require('./_configuration/configuration'),
      app =  require('./server');

// Load loggers
let Log = require('./_classes/logger');
let logger = new Log();

/* WEB SERVER lifecycle
  Start server
  Connection manager wrapping to end connections gracefully
  Control kill signals
*/
let server; // Initialize in higher scope
function startServer() {
  server = stoppable(app.listen(config.port, config.ip, function () {
    logger.info('Webserver is ready in port: ' + config.port, 'MAIN');
    bootstrap(); // Initialize everything else
  }), 3000);
}

// quit on ctrl-c when running docker in terminal
process.on('SIGINT', function onSigint () {
  logger.warn('Got SIGINT (aka ctrl-c in docker). Graceful shutdown ', 'MAIN');
  shutdown();
})

// quit properly on docker stop
process.on('SIGTERM', function onSigterm () {
  logger.warn('Got SIGTERM (docker container stop). Graceful shutdown ', 'MAIN');
  shutdown();
})

// gracefully shut down server
function shutdown() {
  server.stop(function onServerClosed (err) {
    if (err) {
      logger.error(err, 'MAIN');
      process.exitCode = 1;
    }
    process.exit();
  }); //decorated by stoppable module to handle keep alives 
}
/*
END SERVER LIFECYCLE
*/

/*
Area to start processes
*/
// Start server
startServer();

// Start other services
function bootstrap(){
  // ...
  logger.info("All services initialized", "MAIN");
}

/*
END AREA to start processes
*/

// Export server module
module.exports = server;
