/**
 * agent.js
 * Implements processes available to the main adapter program
 * Can make use of agent support services and interface to gateway
 */

const config = require('./configuration');
const gateway = require('./interface');
const services = require('./services');
const Log = require('../_classes/logger');
const fileMgmt = require('../_utils/fileMgmt');
const registrationsFilePath = './agent/registrations.json';
const propertiesFilePath = './agent/properties.json';
const actionsFilePath = './agent/actions.json';
const eventsFilePath = './agent/events.json';

/**
 * Initialization process of the agent module
 */
module.exports.initialize = async function(){
    let logger = new Log();

    try{
        logger.info('Agent startup initiated...', 'AGENT');
        // Check current configuration 
        if(!config.gatewayId || !config.gatewayPwd) throw new Error('Missing gateway id or credentials...');
        // Load registrations and interaction pattern files
        let todo = [];
        todo.push(fileMgmt.read(registrationsFilePath));
        todo.push(fileMgmt.read(propertiesFilePath));
        todo.push(fileMgmt.read(actionsFilePath));
        todo.push(fileMgmt.read(eventsFilePath));
        // Parse agent files
        let files = await Promise.all(todo); // Stores agent files during init
        let registrationsFile = JSON.parse(files[0]);
        let propertiesFile = JSON.parse(files[1]);
        let actionsFile = JSON.parse(files[2]);
        let eventsFile = JSON.parse(files[3]);
        files = null; // To be collected by GC
        // Process loaded files
        todo = [];
        todo.push(services.processConfig(registrationsFile, "registrations"));
        todo.push(services.processConfig(propertiesFile, "properties"));
        todo.push(services.processConfig(actionsFile, "actions"));
        todo.push(services.processConfig(eventsFile, "events"));
        await Promise.all(todo);
        // Get status of registrations in platform
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