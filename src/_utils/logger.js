/*
Logger middleware - replaces node default logger
Writes in console and in text files
The level of verbosity can be customized based on needs
*/

var winston = require('winston');
const { createLogger, format, transports } = winston;

// winston.emitErrs = true;

var myCustomLevels = {
  levels: {
    error: 0,
    warn: 1,
    audit: 2,
    info: 3,
    debug: 4
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    audit: 'green',
    info: 'gray',
    debug: 'blue'
  }
};

var logger = winston.createLogger({
    levels: myCustomLevels.levels,
    transports: [
        new winston.transports.Console({
          level: 'debug',
          json: true
        })
    ],
    format: format.combine(
        // format.label({ label: 'something' }),
        // format.timestamp(),
        format.colorize(),
        format.simple()
      ),
    exitOnError: false
});

// var logger_json = winston.createLogger({
//     levels: myCustomLevels.levels,
//     transports: [
//         new winston.transports.Console({
//           level: 'debug',
//           json: true
//         })
//     ],
//     format: format.combine(
//         format.timestamp(),
//         format.json()
//       ),
//     exitOnError: false
// });

module.exports = logger;

module.exports.stream = {
    write: function(message, encoding){
        if(message.substr(0, 3) >= 500){
          logger.error(message.slice(0,-1)); // Remove additional line char
        } else if(message.substr(0, 3) >= 400){
          logger.warn(message.slice(0,-1));
        } else {
          logger.info(message.slice(0,-1));
        }
    }
};
