// Global packages
var logger = require('../_utils/logger');

module.exports = class Log {
  constructor() {
    this.ini = new Date();
  }

  // Methods
  debug(message, agent, other) {
    logger.debug(this._buildLog(this.ini, message, agent, other));
  }
  info(message, agent, other) {
    logger.info(this._buildLog(this.ini, message, agent, other));
  }
  warn(message, agent, other) {
    logger.warn(this._buildLog(this.ini, message, agent, other));
  }
  error(message, agent, other) {
    logger.error(this._buildLog(this.ini, message, agent, other));
  }

  // Private methods

  _buildLog(ini, message, agent, other){
    try{
      var aux = message;
      var date = new Date();
      var duration = date.getTime() - ini.getTime();
      aux = typeof agent !== 'undefined' ? agent + " - " + aux : "Unknown" + " - " + aux;
      aux = date.toISOString() + " - " + aux;
      aux = aux + " - " + duration + "ms";
      if(typeof other === 'object'){
        return aux + this._goThroughObject(other);
      } else if(typeof other === 'string'){
        return aux + " - " + other;
      } else {
        return aux;
      }
    } catch(err) {
      return err;
    }
  }

  _goThroughObject(other){
    var aux = "";
    for(var i in other){
      aux = aux + " - " + i + " : " + other[i];
    }
    return aux;
  }

}





