/**
 * agent.js
 * Implements processes available to the main adapter program
 * Can make use of agent support services and interface to gateway
 */

const config = require('./configuration');
const gateway = require('./interface');
const services = require('./services');
const Log = require('../_classes/logger');
const registrationsFile = require('../../agent/registrations.json');
const propertiesFile = require('../../agent/properties.json');
const actionsFile = require('../../agent/actions.json');
const eventsFile = require('../../agent/events.json');

/**
 * Initialization process of the agent module
 */
module.exports.initialize = async function(){
    let logger = new Log();

    try{
        logger.info('Agent startup initiated...', 'AGENT');
        // Check current configuration
        if(!config.gatewayId || !config.gatewayPwd) throw new Error('Missing gateway id or credentials...');
        let todo = [];
        todo.push(services.processConfig(registrationsFile, "registrations"));
        todo.push(services.processConfig(propertiesFile, "properties"));
        todo.push(services.processConfig(actionsFile, "actions"));
        todo.push(services.processConfig(eventsFile, "events"));
        await Promise.all(todo);
        let objectsInPlatform = await gateway.getRegistrations();
        // Compare local regitrations with platform registrations
        // TBD Important to control discrepancies!!
        // Login objects
        await services.doLogins(registrationsFile);
        // End of initialization
        logger.info('Agent startup completed!', 'AGENT');
        return Promise.resolve(true);
    } catch(err) {
        logger.error(err, 'AGENT');
        return Promise.reject(false);
    }

}