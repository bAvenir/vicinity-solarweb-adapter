/**
 * Gateway request class
 * This class inherits from the server request class
 * @class
 */

const Request = require('../_classes/request');
const config = require('./configuration');

 module.exports = class gtwRequest extends Request{

    constructor(oid) {
        super();
        this.options.timeout = { request: config.timeout || 5000 };
        this.options.headers =  {
            'Content-Type' : 'application/json; charset=utf-8',
            'Accept' : 'application/json',
            'simple': false
          };
        this.url = "http://" + config.host + ":" + config.port + "/" + config.route + "/";
        this.oid = oid || null;
        this._setAuthorization(this.oid);
      }

    setUri(endpoint){
        /**
        * Overrides parent setUri method
        * @override
        */ 
        this.uri = this.url + endpoint;
    }

    _setAuthorization(oid){
      if(oid){
        // TBD search for device pwd
      } else {
        this.addHeader("Authorization", config.gatewayCredentials);
      }
    }

 }