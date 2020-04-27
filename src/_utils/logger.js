/*
Logger middleware - replaces node default logger
Writes in console and in text files
The level of verbosity can be customized based on needs
*/

var winston = require('winston');
const { createLogger, format, transports } = winston;
require('winston-daily-rotate-file');
 
  let file_transport = new winston.transports.DailyRotateFile({
    filename: './log/adapter-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
  });

  let console_transport = new winston.transports.Console({
    level: 'debug',
    json: true
  });

let myCustomLevels = {
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

let logger = winston.createLogger({
    levels: myCustomLevels.levels,
    transports: [
      file_transport,
      console_transport
    ],
    format: format.combine(
        // format.label({ label: 'something' }),
        // format.timestamp(),
        // format.colorize(),
        format.simple()
      ),
    exitOnError: false
});

// winston.emitErrs = true;

// transport.on('rotate', function(oldFilename, newFilename) {
//   // do something fun
// });

// let logger_json = winston.createLogger({
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
