/**
 * services.js
 * Implements support functionality
 * Can be used by fronius.js
 */

const vcntagent = require('bavenir-agent'); 
const Log = vcntagent.classes.logger;
const Obj = require('./classes/froniusObject');
const Events = require('./classes/froniusEvents');
const fronius = require('./interface');
const redis = vcntagent.redis;
let logger = new Log();

// Create global events object
let froniusEvents = new Events();

let services = {};

/**
 * Perform login of all registered objects
 */
services.addMetadata = async function(){
    try{
        let metadata = await fronius.metadata();
        await _parseMetadata(metadata);
        logger.info('Metadata parsed...', "FRONIUS");
        return Promise.resolve(true);
    } catch(err) {
        logger.error(err, "FRONIUS_SERVICES");
        return Promise.reject(err);
    }
}

/**
 * Perform login of all registered objects
 */
services.register = async function(id){
    try{
        await Obj.register(id);
        logger.info(`Object ${id} registered...`, "FRONIUS");
        return Promise.resolve(true);
    } catch(err) {
        logger.error(err, "FRONIUS_SERVICES");
        return Promise.reject(err);
    }
}

/**
 * Perform login of all registered objects
 */
services.unRegister = async function(id){
    try{
        await Obj.unRegister(id);
        logger.info(`Object ${id} removed...`, "FRONIUS");
        return Promise.resolve(true);
    } catch(err) {
        logger.error(err, "FRONIUS_SERVICES");
        return Promise.reject(err);
    }
}

/**
 * Perform login of all registered objects
 */
services.discover = async function(id){
    try{
        let result = await Obj.discover(id);
        return Promise.resolve(result);
    } catch(err) {
        logger.error(err, "FRONIUS_SERVICES");
        return Promise.reject(err);
    }
}

/**
 * Activate events
 */
services.activateEvents = function(){
    froniusEvents.startEvents();
    logger.info('Start sending events!', "FRONIUS");
}

/**
 * Deactivate events
 */
services.deactivateEvents = function(){
    froniusEvents.stopEvents();
    logger.info('Stop sending events!', "FRONIUS");
}

module.exports = services;

// Private functions

async function _parseMetadata(metadata){
    try{
        for(let i=0, l=metadata.length; i<l; i++){
            let newDevice = new Obj(
                metadata[i].Name,
                metadata[i].Id,
                metadata[i].PeakPower,
                );
            // Need to get individual metadata, it contains more info
            let aux = await fronius.metadata(metadata[i].Id);
            newDevice.getDevices(aux.DaloDeviceInfo);
            await newDevice.getProperties();
            newDevice.getEvents();
            await newDevice.storeInMemory();
        }
        await redis.save();
        return Promise.resolve(true);
    }catch(err){
        logger.error(err, "FRONIUS_SERVICES");
        return Promise.reject(err);
    }
}

