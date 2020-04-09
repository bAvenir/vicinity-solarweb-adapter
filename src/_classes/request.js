// Global packages
const Log = require('./logger');
const request = require('request-promise');
const config = require('../_configuration/configuration');


/**
 * request.js
 * HTTP request service
When invoked requires 3 obligatory parameters:
url - String - Addreses the right external service -- http://.../
      The url will also point to the right header to be included in the request
endpoint - String - Endpoint where the request must be addressed
method - String - POST, GET, PUT, DELETE
payload - Object - Contains payload and may be an empty object  if not required {}
headers - i.e. Vicinity x-access-token. The default headers are preconfigured
destination - Allows choosing the urls defined in connections
* @class
*/

module.exports = class Request {
  constructor(){
    this.timeout = config.timeout || 5000;
    this.method = "GET";
  }

  // Methods

  setOptions(options) {
    if (options) {
      this.options = options;
    }
  }

  setBody(body){
    if(body && this.method !== "GET"){
      this.body = JSON.stringify(body);
    }
  }

  setUri(url, endpoint){
      this.uri = url + endpoint;
  }

  setMethod(method){
    this.method = method;
  }

  addQueryString(key, value){
    this.qs[key] = value;
  }

  addHeader(key, value){
      this.headers[key] = value;
  }

  _validate(){
    if(!this.uri){ throw new Error("Missing URI"); }
    if(!this.method){ throw new Error("Missing HTTP METHOD"); }
  }

  async send(){
    var logger = new Log();
    try{
      // validate all parameters are ready
      this._validate();
      logger.debug("Calling... " + this.uri, "REQUEST");
      let response = await request(this);
      return Promise.resolve(response);
    } catch(err) {
      logger.error(err, "REQUEST");
      return Promise.reject(err);
    }
  }

};



