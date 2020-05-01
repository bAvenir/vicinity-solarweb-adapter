/**
* interface.js
* Interface to interact with the FRONIUS API
* @interface
*/ 

const Request = require('./classes/froniusRequest');
const config = require('../../configuration');
const redis = require('../../../_persistance/_modules/redis');

// ***** AUTHENTICATION *****

/**
 * Login in FRONIUS
 * GET API key and store it
 * @return {boolean} success 
 */
module.exports.login = async function(){
    try{
        let req = new Request();
        req.setUri('/auth/login');
        req.setMethod('POST');
        req.setBody(_getBody());
        let token = await req.send();
        if(!token.AccessToken) throw new Error('Token was not received from FRONIUS API');
        await redis.set('FRONIUSTOKEN', token.AccessToken, 86400); // Expires in one day
        return Promise.resolve(token.AccessToken);
    } catch(err) {
        return Promise.reject(err);
    }
}

/**
 * Get metadata
 * Discover all devices in FRONIUS infrastructure
 * @return {array} Objects with info for registration 
 */
module.exports.metadata = async function(){
    try{
        let req = new Request();
        req.setUri('/metadata');
        let token = await redis.get('FRONIUSTOKEN');
        if(!token) token = await this.login(); // If token expired, refresh it
        req.addHeader("AccessToken", token);
        let metadata = await req.send();
        return Promise.resolve(metadata);
    } catch(err) {
        return Promise.reject(err);
    }
}

/**
 * Get Cummulated energy
 * @return {object} value requested
 */
module.exports.realtime = async function(oid, pid){
    try{
        let req = new Request();
        let id = await redis.hget(oid, "adapterId");
        req.setUri(`/realtime/${id}`);
        let token = await redis.get('FRONIUSTOKEN');
        if(!token) token = await this.login(); // If token expired, refresh it
        req.addHeader("AccessToken", token);
        let data = await req.send();
        let result = _processRealtimeData(data, pid);
        return Promise.resolve(result);
    } catch(err) {
        return Promise.reject(err);
    }
}

/**
 * Get energyflow values
 * @return {object} value requested
 */
module.exports.energyflow = async function(oid, pid){
    try{
        let req = new Request();
        let id = await redis.hget(oid, "adapterId");
        req.setUri(`/realtime/${id}`);
        let token = await redis.get('FRONIUSTOKEN');
        if(!token) token = await this.login(); // If token expired, refresh it
        req.addHeader("AccessToken", token);
        let data = await req.send();
        let result = _processEnergyflowData(data, pid);
        return Promise.resolve(result);
    } catch(err) {
        return Promise.reject(err);
    }
}

// Private functions 

/**
 * Builds login request body
 */
function _getBody() {
    return {
        "Username": config.username,
        "Password": config.password,
        "ApiKey": config.apikey,
        "DeviceId": config.deviceid,
        "DeviceDescription": config.devicedescription,
        "AppVersion": config.appversion,
        "OsVersion": config.osversion
    };
}

/**
 * Maps FRONIUS response with the VICINITY values
 * For realtime endpoint
 * Returns requested pid and caches the rest
 * @param {object} data 
 * @param {string} pid 
 * @returns {object} pid:value
 */
function _processRealtimeData(data, pid){
    return {"value": true}
}

/**
 * Maps FRONIUS response with the VICINITY values
 * For energyflow endpoint
 * Returns requested pid and caches the rest
 * @param {object} data 
 * @param {string} pid 
 * @returns {object} pid:value
 */
function _processEnergyflowData(data, pid){
    return {"value": true}
}
