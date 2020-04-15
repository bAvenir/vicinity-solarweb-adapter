/**
 * services.js
 * Implements support functionality
 * Can be used by agent.js and controllers.js
 */

const Log = require('../_classes/logger');
const gateway = require('./interface');

let services = {};

/**
 * Get a configuration file and store its contents in memory (REDIS)
 */
services.processConfig = async function(file, type){
    let logger = new Log();
    try{
        let countRows = file.length;
        if(countRows>0){
            //TBD store in memory during runtime
            return Promise.resolve(true);
        } else {
            logger.info("There are no " + type + " available", "AGENT_SERVICES");
            return Promise.resolve(true);
        }
    } catch(err) {
        logger.error(err, "AGENT_SERVICES");
        return Promise.reject("Problem processing configuration file: " + type);
    }
}

/**
 * Perform login of all registered objects
 */
services.doLogins = async function(array){
    let logger = new Log();
    try{
        let actions = [];
        actions.push(gateway.login())
        for(var i = 0, l = array.length; i < l; i++){
            actions.push(gateway.login(array[i].oid));
        }
        let results = await Promise.all(actions);
        logger.info("All objects logged in platform", "AGENT_SERVICES");
        return Promise.resolve("Logins were successful", "AGENT_SERVICES");
    } catch(err) {
        logger.error(err, "AGENT_SERVICES");
        return Promise.reject("Problem login objects in platform...");
    }
}

module.exports = services;