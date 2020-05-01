/**
 * Fronius request class
 * This class inherits from the server request class
 * @class
 */

const Request = require('../../../../_classes/request');
const config = require('../../../configuration');

 module.exports = class froniusRequest extends Request{

    constructor() {
        super();
        this.options.timeout = { request: config.timeout || 10000 };
        this.options.headers =  {
            'Content-Type' : 'application/json; charset=utf-8',
            'Accept' : 'application/json',
            'simple': false
          };
        this.url = config.host + config.baseURL;
      }

    setUri(endpoint){
        /**
        * Overrides parent setUri method
        * @override
        */ 
        this.uri = this.url + endpoint;
    }

 }