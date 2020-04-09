/**
 * Gateway request class
 * This class inherits from the server request class
 * @class
 */

const Request = require('../_classes/request');
const config = require('./configuration');

 module.exports = class gtwRequest extends Request{

    constructor(...args) {
        super(...args);
        this.headers =  {
            'Content-Type' : 'application/json; charset=utf-8',
            'Accept' : 'application/json',
            'simple': false
          };
        this.url = "http://" + config.host + ":" + config.port + "/";
      }

    setUri(endpoint){
        /**
        * Overrides parent setUri method
        * @override
        */ 
        this.uri = this.url + endpoint;
    }

 }