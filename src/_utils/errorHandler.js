/* Module containing error handlers */
let myErrors = {};

//Load configuration
const config = require('../_configuration/configuration');

// Load loggers
const Log = require('../_classes/logger');
let logger = new Log();

/**
 * Event listener for HTTP server "error" event.
 */
 myErrors.serverError = function(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }
  
    var bind = typeof port === 'string'
      ? 'Pipe ' + config.port
      : 'Port ' + config.port;
  
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        logger.error(bind + ' requires elevated privileges', 'Error Handler');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        logger.error(bind + ' is already in use', 'Error Handler');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

// Make functions public
module.exports = myErrors;
  