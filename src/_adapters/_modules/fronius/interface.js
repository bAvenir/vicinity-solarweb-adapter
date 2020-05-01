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
module.exports.metadata = async function(id){
    try{
        let req = new Request();
        let href = (id == null) ? '/metadata/' : '/metadata/' + id;
        req.setUri(href);
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
 * Get data from Fronius adapter
 */
module.exports.getData = async function(oid, pid){
    try{
        let req = new Request();
        let result, data;
        let href = await redis.hget(`map:${pid}`, 'href');
        if(href == null) throw new Error('Property not defined in mapper.json');
        let id = await redis.hget(oid, "adapterId");
        if(href === 'metadata'){
            // Obtain value from local storage
            data = await redis.hget(id, pid);
            result = {value: data, property: pid};
        } else {
            // Obtain value calling API
            req.setUri(href.replace(":id", id));
            let token = await redis.get('FRONIUSTOKEN');
            if(!token) token = await this.login(); // If token expired, refresh it
            req.addHeader("AccessToken", token);
            data = await req.send();
            result = {value: data[pid], property: pid};
        }
        return Promise.resolve(result);
    }catch(err){
        await this.login();
        return Promise.reject(err);
    }
}

// /**
//  * Get Cummulated energy
//  * @return {object} value requested
//  */
// module.exports.realtime = async function(oid, pid){
//     try{
//         let req = new Request();
//         let id = await redis.hget(oid, "adapterId");
//         req.setUri(`/realtime/${id}`);
//         let token = await redis.get('FRONIUSTOKEN');
//         if(!token) token = await this.login(); // If token expired, refresh it
//         req.addHeader("AccessToken", token);
//         let data = await req.send();
//         let result = _processRealtimeData(data, pid);
//         return Promise.resolve(result);
//     } catch(err) {
//         return Promise.reject(err);
//     }
// }

// /**
//  * Get energyflow values
//  * @return {object} value requested
//  */
// module.exports.energyflow = async function(oid, pid){
//     try{
//         let req = new Request();
//         let id = await redis.hget(oid, "adapterId");
//         req.setUri(`/realtime/${id}`);
//         let token = await redis.get('FRONIUSTOKEN');
//         if(!token) token = await this.login(); // If token expired, refresh it
//         req.addHeader("AccessToken", token);
//         let data = await req.send();
//         let result = _processEnergyflowData(data, pid);
//         return Promise.resolve(result);
//     } catch(err) {
//         return Promise.reject(err);
//     }
// }

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

// /**
//  * Maps FRONIUS response with the VICINITY values
//  * For realtime endpoint
//  * Returns requested pid and caches the rest
//  * @param {object} data 
//  * @param {string} pid 
//  * @returns {object} pid:value
//  */
// function _processRealtimeData(data, pid){
//     return {"value": true}
// }

// /**
//  * Maps FRONIUS response with the VICINITY values
//  * For energyflow endpoint
//  * Returns requested pid and caches the rest
//  * @param {object} data 
//  * @param {string} pid 
//  * @returns {object} pid:value
//  */
// function _processEnergyflowData(data, pid){
//     return {"value": true}
// }
