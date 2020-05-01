/**
 * services.js
 * Implements support functionality
 * Can be used by fronius.js
 */

const Log = require('../../../_classes/logger');
const fronius = require('./interface');
const Obj = require('./classes/froniusObject');
const redis = require('../../../_persistance/_modules/redis');

let services = {};

/**
 * Perform login of all registered objects
 */
services.addMetadata = async function(){
    let logger = new Log();
    try{
        let metadata = await fronius.metadata();
        await _parseMetadata(metadata);
        logger.info('Metadata parsed...', "FRONIUS");
        return Promise.resolve(true);
    } catch(err) {
        return Promise.reject(err);
    }
}

/**
 * Perform login of all registered objects
 */
services.register = async function(id){
    let logger = new Log();
    try{
        await Obj.register(id);
        logger.info(`Object ${id} registered...`, "FRONIUS");
        return Promise.resolve(true);
    } catch(err) {
        return Promise.reject(err);
    }
}

/**
 * Perform login of all registered objects
 */
services.unRegister = async function(id){
    let logger = new Log();
    try{
        await Obj.unRegister(id);
        logger.info(`Object ${id} removed...`, "FRONIUS");
        return Promise.resolve(true);
    } catch(err) {
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
        return Promise.reject(err);
    }
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
            await newDevice.storeInMemory();
        }
        await redis.save();
        return Promise.resolve(true);
    }catch(err){
        return Promise.reject(err);
    }
}