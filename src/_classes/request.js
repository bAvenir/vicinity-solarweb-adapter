// Global packages
const Log = require('./logger');
const request = require('got');

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
    this.options = {};
    this.options.isStream = false;
    this.options.retry = 2; // Retries on failure N times
    this.options.throwHttpErrors = true; // Non 2XX is treated as error
    this.options.method = "GET"; // Default method
  }

  // Methods

  setBody(body){
    if(body && this.options.method !== "GET"){
      this.options.body = JSON.stringify(body);
    }
  }

  setUri(url, endpoint){
      this.uri = url + endpoint;
  }

  setMethod(method){
    this.options.method = method;
  }

  addQueryString(key, value){
    this.options.searchParams[key] = value;
  }

  addHeader(key, value){
      this.options.headers[key] = value;
  }

  _validate(){
    if(!this.uri){ throw new Error("Missing URI"); }
    if(!this.options.method){ throw new Error("Missing HTTP METHOD"); }
  }

  async send(){
    var logger = new Log();
    try{
      // validate all parameters are ready
      this._validate();
      logger.debug("Calling... " + this.uri, "REQUEST");
      let response = await request(this.uri, this.options);
      // logger.debug(JSON.parse(response.request)) // See original request
      // logger.debug(response.ip)
      // logger.debug(response.isFromCache)
      // logger.debug(response.statusCode)
      return Promise.resolve(response.body);
    } catch(err) {
      // logger.error(err, "REQUEST");
      return Promise.reject(err);
    }
  }

};



