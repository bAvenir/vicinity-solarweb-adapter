/**
* interfaces.js
* Interface to interact with the gateway API
* Used from external (API) and internal requests
* @interface
*/ 

const Req = require('./_classes/gatewayRequest');
const config = require('./configuration');

// ***** AUTHENTICATION *****

/**
 * Login an object in VICINITY
 * @param {oid: string}
 * @return {error: boolean, message: string} 
 */

module.exports.login = async function(oid){
    try{
        let request = new Req();
        await request.setAuthorization(oid);
        request.setUri('objects/login');
        let result = await request.send();
        request = null;
        return Promise.resolve(result);
    } catch(err) {
        return Promise.reject(err)
    }
}

/**
 * Logout an object in VICINITY
 * @param {oid: string}
 * @return {error: boolean, message: string} 
 */

module.exports.logout = async function(oid){
    try{
        let request = new Req();
        await request.setAuthorization(oid);
        request.setUri('objects/logout');
        let result = await request.send();
        request = null;
        return Promise.resolve(result);
    } catch(err) {
        return Promise.reject(err)
    }
}

// ***** REGISTRATION *****

/**
 * Get list of objects registered under your gateway
 * (Using the access point credentials generated for it)
 * @param {}
 * @return {error: boolean, message: array of TDs} 
 */

module.exports.getRegistrations = async function(){
    try{
        let request = new Req();
        await request.setAuthorization(null);
        request.setUri('agents/' + config.gatewayId + '/objects');
        let result = await request.send();
        request = null;
        return Promise.resolve(result);
    } catch(err) {
        return Promise.reject(err)
    }
}


/**
 * Register object/s under your gateway
 * (Using the access point credentials generated for it)
 * @param {body: Array of TDs}
 * @return {error: boolean, message: array of TDs} 
 */

module.exports.postRegistrations = async function(body){
    try{
        let request = new Req();
        await request.setAuthorization();
        request.setMethod("POST");
        request.setBody(body);
        request.setUri('agents/' + config.gatewayId + '/objects');
        let result = await request.send();
        request = null;
        return Promise.resolve(result);
    } catch(err) {
        return Promise.reject(err)
    }
}

/**
 * Remove object/s under your gateway
 * (Using the access point credentials generated for it)
 * @param {body: Array of OIDs}
 * @return {error: boolean, message: [{value: string, result: string, error: string}]} 
 */

module.exports.removeRegistrations = async function(body){
    try{
        let request = new Req();
        await request.setAuthorization();
        request.setMethod("POST");
        request.setBody(body);
        request.setUri('agents/' + config.gatewayId + '/objects/delete');
        let result = await request.send();
        request = null;
        return Promise.resolve(result);
    } catch(err) {
        return Promise.reject(err)
    }
}

/**
 * @TBD:
 * Soft update
 * Hard update
 */

 // ***** DISCOVERY *****

 /**
 * Retrieve all objects that your object can see
 * (Understand object as gateway, service or device instance)
 * (Using the credentials of a service or device)
 * @param {oid: string}
 * @return {error: boolean, message: [oid: string]} 
 */

module.exports.discovery = async function(oid){
    try{
        let request = new Req();
        await request.setAuthorization(oid);
        request.setUri('objects');
        let result = await request.send();
        request = null;
        return Promise.resolve(result);
    } catch(err) {
        return Promise.reject(err)
    }
}

/**
 * @TBD:
 * SPARQL query
 */

 // ***** RESOURCE CONSUMPTION *****
 // Properties, events and actions

 /**
 * Get a property
 * (Using the credentials of a service or device)
 * @param {oid: string, remote_oid: string, pid: string}
 * @return {error: boolean, message: object} 
 */

module.exports.getProperty = async function(oid, remote_oid, pid){
    try{
        let request = new Req();
        await request.setAuthorization(oid);
        request.setUri('objects/' + remote_oid + '/properties/' + pid);
        let result = await request.send();
        request = null;
        return Promise.resolve(result);
    } catch(err) {
        return Promise.reject(err)
    }
}

 /**
 * Activate the event channel
 * (Using the credentials of a service or device)
 * @param {oid: string, eid: string}
 * @return {error: boolean, message: string} 
 */

module.exports.activateEventChannel = async function(oid, eid){
    try{
        let request = new Req();
        await request.setAuthorization(oid);
        request.setMethod("POST");
        request.setUri('events/' + eid);
        let result = await request.send();
        request = null;
        return Promise.resolve(result);
    } catch(err) {
        return Promise.reject(err)
    }
}

 /**
 * Publish event to channel
 * (Using the credentials of a service or device)
 * @param {oid: string, eid: string, body: object}
 * @return {error: boolean, message: string} 
 */

module.exports.publishEvent = async function(oid, eid, body){
    try{
        let request = new Req();
        await request.setAuthorization(oid);
        request.setMethod("PUT");
        request.setBody(body);
        request.setUri('events/' + eid);
        let result = await request.send();
        request = null;
        return Promise.resolve(result);
    } catch(err) {
        return Promise.reject(err)
    }
}

 /**
 * Deactivate event channel
 * (Using the credentials of a service or device)
 * @param {oid: string, eid: string}
 * @return {error: boolean, message: string} 
 */

module.exports.deactivateEventChannel = async function(oid, eid){
    try{
        let request = new Req();
        await request.setAuthorization(oid);
        request.setMethod("DELETE");
        request.setUri('events/' + eid);
        let result = await request.send();
        request = null;
        return Promise.resolve(result);
    } catch(err) {
        return Promise.reject(err)
    }
}

 /**
 * Get status of remote event channel
 * (Using the credentials of a service or device)
 * @param {oid: string, eid: string}
 * @return {error: boolean, message: string} 
 */

module.exports.statusRemoteEventChannel = async function(oid, remote_oid, eid){
    try{
        let request = new Req();
        await request.setAuthorization(oid);
        request.setUri('objects/' + remote_oid + '/events/' + eid);
        let result = await request.send();
        request = null;
        return Promise.resolve(result);
    } catch(err) {
        return Promise.reject(err)
    }
}

 /**
 * Subscribe to remote event channel
 * (Using the credentials of a service or device)
 * @param {oid: string, eid: string}
 * @return {error: boolean, message: string} 
 */

module.exports.subscribeRemoteEventChannel = async function(oid, remote_oid, eid){
    try{
        let request = new Req();
        await request.setAuthorization(oid);
        request.setMethod('POST');
        request.setUri('objects/' + remote_oid + '/events/' + eid);
        let result = await request.send();
        request = null;
        return Promise.resolve(result);
    } catch(err) {
        return Promise.reject(err)
    }
}

 /**
 * Unsubscribe to remote event channel
 * (Using the credentials of a service or device)
 * @param {oid: string, eid: string}
 * @return {error: boolean, message: string} 
 */

module.exports.unsubscribeRemoteEventChannel = async function(oid, remote_oid, eid){
    try{
        let request = new Req();
        await request.setAuthorization(oid);
        request.setMethod('DELETE');
        request.setUri('objects/' + remote_oid + '/events/' + eid);
        let result = await request.send();
        request = null;
        return Promise.resolve(result);
    } catch(err) {
        return Promise.reject(err)
    }
}

/**
 * @TBD:
 * Set a property
 * Execute action on remote object
 * Update status of a task
 * Retrieve the status or a return value of a given task
 * Cancel a task in progress
 */


