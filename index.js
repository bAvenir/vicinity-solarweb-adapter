// Load third party packages
const stoppable = require('stoppable');
const dotenv = require('dotenv');

// Read Environmental Variables      
dotenv.config();

// Load VICINITY AGENT
const vcntagent = require('bavenir-agent');
const fronius = require('./src/_adapters/_modules/fronius/fronius');

// Load modules
const config = require('./src/configuration'),
      app =  require('./src/server'),
      errorHandler = vcntagent.utils.errorHandler;

// Load loggers
const Log = vcntagent.classes.logger;
let logger = new Log();

// Load services
const agent = vcntagent.services;

// Set up redis cache db
let persistance = vcntagent.persistance;

/* WEB SERVER lifecycle
  Start server
  Connection manager wrapping to end connections gracefully
  Control kill signals
  Control HTTP server errors
*/
let server; // Initialize in higher scope
function startServer() {
  server = stoppable(app.listen(config.port, config.ip, function () {
    // Server started
    logger.info('Webserver is ready in port: ' + config.port, 'MAIN');
    bootstrap(); // Initialize everything else
  }), 3000);
  // Listening for HTTP server errors
  server.on('error', errorHandler.serverError);
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
Area to start services
*/
async function bootstrap(){
  try{
    // Start Redis DB
    let testResult = await persistance.redisHealth();
    if(!testResult) throw new Error('Problem initializing cache');

    // TBD decide what to do if initialization fails (Stop adapter, restart, notify ...)
    await agent.initialize();
    await fronius.initialize();

    // Run other services here
    // ...
    
    logger.info("All services initialized", "MAIN");

  } catch(err) {
    logger.error("Service initialization halted due to errors, check previous logs for more info", "MAIN");
  }
}
/*
END AREA to start services
*/

// Start server
startServer();

// Export server module
module.exports = server;
