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
 */
module.exports.initialize = async function(){
    let logger = new Log();

    try{
        logger.info('Agent startup initiated...', 'AGENT');
        // Check current configuration 
        if(!config.gatewayId || !config.gatewayPwd) throw new Error('Missing gateway id or credentials...');
        
        // Loads and stores registrations and interaction pattern files
        let todo = [];
         // IF YOU REMOVE THE LINE BELOW, REMEMBER TO INIT EVENT CHANNELS SOME OTHER WAY
        todo.push(persistance.loadConfigurationFile("registrations"));
        todo.push(persistance.loadConfigurationFile("properties"));
        // todo.push(persistance.loadConfigurationFile("actions"));
        todo.push(persistance.loadConfigurationFile("events"));
        let results = await Promise.all(todo);
        let registrations = results[0];

        // Get status of registrations in platform
        let objectsInPlatform = await gateway.getRegistrations();

        // Compare local regitrations with platform registrations
        services.compareLocalAndRemote(registrations, objectsInPlatform);
        
        // Login objects
        await services.doLogins(registrations);

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