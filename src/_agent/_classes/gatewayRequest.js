/**
 * Gateway request class
 * This class inherits from the server request class
 * @class
 */

const Request = require('../../_classes/request');
const config = require('../configuration');
const persistance = require('../../_persistance/interface');

 module.exports = class gtwRequest extends Request{

    constructor(oid) {
        super();
        this.options.timeout = { request: config.timeout || 10000 };
        this.options.headers =  {
            'Content-Type' : 'application/json; charset=utf-8',
            'Accept' : 'application/json',
            'simple': false
          };
        this.url = "http://" + config.host + ":" + config.port + "/" + config.route + "/";
      }

    setUri(endpoint){
        /**
        * Overrides parent setUri method
        * @override
        */ 
        this.uri = this.url + endpoint;
    }

    async setAuthorization(oid){
      try{
        if(oid){
          let credentials = await persistance.getCredentials(oid);
          if(!credentials) throw new Error(`Missing authorization for object ${oid}`)
          this.addHeader("Authorization", credentials);
          return Promise.resolve(true);
        } else {
          this.addHeader("Authorization", config.gatewayCredentials);
          return Promise.resolve(true);
        }
      } catch(err) {
        return Promise.reject(err);
      }
    }

 }