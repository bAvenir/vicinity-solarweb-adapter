/**
 * fronius.js
 * Implements processes for the FRONIUS adapter
 * Can make use of fronius interface&services and core agent&persistance
 */

const fronius = require('./interface');
const services = require('./services');
const vcntagent = require('bavenir-agent'); 
const persistance = vcntagent.persistance;
const Log = vcntagent.classes.logger;

/**
 * Initialization process of FRONIUS module
 * Loads to memory predifined interactions
 * Checks if any new devices need to be registered
 */
module.exports.initialize = async function(){
    let logger = new Log();
    try{
        logger.info('Starting initialization of FRONIUS adapter...', 'FRONIUS');
        await persistance.loadConfigurationFile('mappers');
        await fronius.login();
        await services.addMetadata();
        services.activateEvents();
        return Promise.resolve(true);
    }catch(err){
        logger.error(err, 'FRONIUS')
        return Promise.reject(false);
    }
}

/**
 * Registration process of FRONIUS module
 */
module.exports.register = async function(id){
    try{
        if(!id) throw new Error('Missing device id ...');
        await services.register(id);
        return Promise.resolve(true);
    }catch(err){
        return Promise.reject(err);
    }
}

/**
 * UnRegistration process of FRONIUS module
 */
module.exports.unRegister = async function(id){
    try{
        if(!id) throw new Error('Missing device id ...');
        await services.unRegister(id);
        return Promise.resolve(true);
    }catch(err){
        return Promise.reject(err);
    }
}

/**
 * Discovery process of FRONIUS module
 */
module.exports.discover = async function(id){
    try{
        let result = await services.discover(id);
        return Promise.resolve(result);
    }catch(err){
        return Promise.reject(err);
    }
}

/**
 * Activate events of FRONIUS module
 */
module.exports.activateEvents = async function(){
    try{
        services.activateEvents();
        return Promise.resolve(true);
    }catch(err){
        return Promise.reject(err);
    }
}

/**
 * Deactivate events of FRONIUS module
 */
module.exports.deactivateEvents = async function(){
    try{
        services.deactivateEvents();
        return Promise.resolve(true);
    }catch(err){
        return Promise.reject(err);
    }
}
