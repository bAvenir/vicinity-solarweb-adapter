// Global packages
import Log from './logger';
import request from 'request-promise';
import { timeout, gateway } from '../_configuration/configuration';

// Private

// Public Constructor

/*
External API request service
When invoked requires 3 obligatory parameters:
url - String - Addreses the right external service -- http://.../
      The url will also point to the right header to be included in the request
endpoint - String - Endpoint where the request must be addressed
method - String - POST, GET, PUT, DELETE
payload - Object - Contains payload and may be an empty object  if not required {}
headers - i.e. Vicinity x-access-token
destination - Allows choosing the url (nm or gtw)
The headers are preconfigured and the token is stored under /configuration
*/
export default Request;

function Request() {
  this.timeout = timeout || 5000;
  this.url = gateway.url || 'localhost';
  this.method = "GET";
  this.headers =  {
      'Content-Type' : 'application/json; charset=utf-8',
      'Accept' : 'application/json',
      'simple': false
    };
}

// Methods

Request.prototype.setOptions = function(options) {
  if (options) {
    this.options = options;
  }
};

Request.prototype.setBody = function(body){
  if(body && this.method !== "GET"){
    this.body = JSON.stringify(body);
  }
};

Request.prototype.setUri = function(credentials, endpoint, url){
    if(credentials){
      this.headers.Authorization = credentials;
    }
    if(!url){
      this.uri = this.url + endpoint;
    } else {
      this.uri = url + endpoint;
    }
};

Request.prototype.setMethod = function(method){
  this.method = method;
};

Request.prototype.addHeader = function(key, value){
    this.headers[key] = value;
};

Request.prototype.send = function(){
  var logger = new Log();
  var uri = this.uri;
  // if (this.body){
  //   logger.debug(JSON.stringify(this.body, null, 2));
  // }

  return request(this, function(err, response, body) {

    if(err){
      logger.error(err.stack, "gateway");
      return Promise.reject(err);
    } else {
      logger.debug("Calling... " + uri, "gateway");
      return Promise.resolve(response);
    }
  });
};
