// Global packages
var logger = require('../_utils/logger');

// Private

function buildLog(ini, message, agent, other){
  try{
    var aux = message;
    var date = new Date();
    var duration = date.getTime() - ini.getTime();
    aux = typeof agent !== 'undefined' ? agent + " - " + aux : "Unknown" + " - " + aux;
    aux = date.toISOString() + " - " + aux;
    aux = aux + " - " + duration + "ms";
    if(typeof other === 'object'){
      return aux + goThroughObject(other);
    } else if(typeof other === 'string'){
      return aux + " - " + other;
    } else {
      return aux;
    }
  } catch(err) {
    return err;
  }
}

function goThroughObject(other){
  var aux = "";
  for(var i in other){
    aux = aux + " - " + i + " : " + other[i];
  }
  return aux;
}

// Public Constructor

module.exports = Log;

function Log() {
}

// Methods

Log.prototype.debug = function(message, agent, other){
  logger.debug(buildLog(new Date(), message, agent, other));
};

Log.prototype.info = function(message, agent, other){
  logger.info(buildLog(new Date(), message, agent, other));
};

Log.prototype.warn = function(message, agent, other){
  logger.warn(buildLog(new Date(), message, agent, other));
};

Log.prototype.error = function(message, agent, other){
  logger.error(buildLog(new Date(), message, agent, other));
};
