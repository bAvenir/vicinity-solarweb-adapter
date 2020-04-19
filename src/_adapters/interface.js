/**
* interface.js
* Process incoming requests coming from the gateway
* The behaviour of this module depends on the properties set on the configuration file:
* - response_mode and data_collection
* The incoming messages can be:
* - Request to send property value
* - Request to update property value
* - Receive event from subscribed value
*/ 

// Import logger
const Log = require('../_classes/logger');
// Configuration Modes
const config = require('./configuration');
const globalMode = config.responseMode;
const proxyUrl = config.proxyUrl;
// Modules
const dummyModule = require('./_modules/dummy');
const proxyModule = require('./_modules/proxy');

// TBD Include other adapter modules when available
// TBD Handle events and actions sent by gtw

module.exports.proxyGetProperty = async function(oid, pid){
    let logger = new Log();
    let result;
    try{
        // TBD Check if combination of oid + pid exists

        switch (globalMode) {
            case 'dummy':
                result = dummyModule.getProperty(oid, pid);
                break;
            case 'proxy':
                result = await proxyModule.getProperty(oid, pid, proxyUrl, proxyEndpoint);
                break;
            default:
                throw new Error('ADAPTER ERROR: Selected module could not be found');
        }

        logger.debug(`Responded to get property ${pid} of ${oid} in mode ${globalMode}`, "ADAPTER");
        return Promise.resolve(result);
    } catch(err) {
        logger.error(err, "ADAPTER")
        return Promise.reject({error: true, message: err})
    }
}

module.exports.proxySetProperty = async function(oid, pid){
    let logger = new Log();
    let result;
    try{ 
        // TBD Check if combination of oid + pid exists

        switch (globalMode) {
            case 'dummy':
                result = dummyModule.setProperty(oid, pid);
                break;
            case 'proxy':
                result = await proxyModule.setProperty(oid, pid, proxyUrl, proxyEndpoint);
                break;
            default:
                throw new Error('ADAPTER ERROR: Selected module could not be found');
        }

        logger.debug(`Responded to set property ${pid} of ${oid} in mode ${globalMode}`, "ADAPTER");
        return Promise.resolve(result);
    } catch(err) {
        logger.error(err, "ADAPTER")
        return Promise.reject({error: true, message: err})
    }
}
