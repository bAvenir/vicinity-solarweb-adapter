/**
 * agent.js
 * Implements processes available to the main adapter program
 * Can make use of agent support services and interface to gateway
 */

const config = require('./configuration');
const gateway = require('./interface');
const services = require('./services');
const Log = require('../_classes/logger');
const persistance = require('../_persistance/interface');


/**
 * Initialization process of the agent module
 * Loads from memory credentials of registered objects
 * Performs actions necessary to restart/init agent
 */
module.exports.initialize = async function(){
    let logger = new Log();

    try{
        logger.info('Agent startup initiated...', 'AGENT');
        // Check current configuration 
        if(!config.gatewayId || !config.gatewayPwd) throw new Error('Missing gateway id or credentials...');
        
        // Get objects OIDs stored locally
        let registrations = await persistance.getLocalObjects();

        // Login objects
        await services.doLogins(registrations);

        // Get status of registrations in platform
        let objectsInPlatform = await gateway.getRegistrations();

        // Compare local regitrations with platform registrations
        services.compareLocalAndRemote(registrations, objectsInPlatform);

        // Initialize event channels
        for(let i = 0, l = registrations.length; i<l; i++){
            let thing = await persistance.getLocalObjects(registrations[i]);
            let events = thing.events || [];
            if(events.length > 0) await services.activateEventChannels(registrations[i], events);
        }
        logger.info('All event channels created!', 'AGENT');

        // Store configuration info
        await persistance.reloadConfigInfo();

        // End of initialization
        logger.info('Agent startup completed!', 'AGENT');
        return Promise.resolve(true);
    } catch(err) {
        logger.error(err, 'AGENT');
        return Promise.reject(false);
    }
}

/**
 * Stops gateway connections before killing adapter app
 */
module.exports.stop = async function(){
    let logger = new Log();
    try{
        // Get objects OIDs stored locally
        let registrations = await persistance.getLocalObjects();
        // Do logouts
        await services.doLogouts(registrations);
        logger.info("Gateway connections closed", 'AGENT');
        return Promise.resolve(true);
    } catch(err) {
        logger.error(err, 'AGENT');
        return Promise.reject(false);
    }
}

/**
 * Import configuration files to memory
 * Does not overwrite, only loads interactions or registrations
 * not existing previously
 * Use delete endpoints to remove interactions or registrations 
 */    
module.exports.importFromFile = async function(type){
    try{
        await persistance.loadConfigurationFile(type);
        return Promise.resolve(true);
    }catch(err){
        return Promise.reject(err);
    }
}

/**
 * Saves to file all the memory
 * Additional backup possibility
 * Can create 4 different files: 1xRegistrations + 3xInteractions
 */
module.exports.exportToFile = async function(type){
    try{
        await persistance.saveConfigurationFile(type);
        return Promise.resolve(true);
    }catch(err){
        return Promise.reject(err);
    }
}

/**
 * Register one device
 */
module.exports.register = async function(body){
    try{
        await services.registerObject(body);
        return Promise.resolve(true);
    }catch(err){
        return Promise.reject(err);
    }
}

/**
 * Unregister one device
 * @param {object} {oids: []}
 */
module.exports.unRegister = async function(body){
    try{
        await services.removeObject(body);
        return Promise.resolve(true);
    }catch(err){
        return Promise.reject(err);
    }
}