/**
 * response.js
 * Class decribing the standard response  
 * @class
 */ 
module.exports = class Resp {
  constructor(status, message){
    this.error = status === 500;
    this.status = status;
    this.message = message;
    this.success = status < 300; 
  }
};