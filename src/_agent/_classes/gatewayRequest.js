/**
 * Gateway request class
 * This class inherits from the server request class
 * @class
 */

const Request = require('../../_classes/request');
const config = require('../configuration');
const fileMgmt = require('../../_utils/fileMgmt');

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
          // TBD load credentials from memory
          let localRegistrations = await fileMgmt.read('./agent/registrations.json');
          localRegistrations = JSON.parse(localRegistrations);
          let item = localRegistrations.filter((item) => { return item.oid === oid });
          this.addHeader("Authorization", item[0].credentials);
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