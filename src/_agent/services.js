/**
 * services.js
 * Implements support functionality
 * Can be used by agent.js and controllers.js
 */

const Log = require('../_classes/logger');
const gateway = require('./interface');
const Regis = require('./_classes/registration');

let services = {};

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
        await Promise.all(actions);
        logger.info('All logins were successful', "AGENT_SERVICES");
        return Promise.resolve("Logins were successful");
    } catch(err) {
        return Promise.reject(err);
    }
}

/**
 * Register object in platform
 * Only 1 by 1 - No multiple registration accepted
 */
services.registerObject = async function(body){
    let registration = new Regis();
    try{
        let td = await registration.buildTD(body);
        let result = await gateway.postRegistrations(td);
        if(result.message[0].error) throw new Error("Platform parsing failed, please revise error: " + JSON.stringify(result.message[0].error));
        await registration.storeCredentials(result.message[0]);
        // Login new objects
        let actions = [];
        for(var i = 0, l = result.message.length; i < l; i++){
            actions.push(gateway.login(result.message[i].oid));
        }
        await Promise.all(actions);
        registration = null;
        return Promise.resolve(result.message);
    } catch(err) {
        return Promise.reject(err);
    }
}

/**
 * Remove object from platform
 */
services.removeObject = async function(body){
    try{
        let wrapper = Regis.addRemovalWrapper(body.oids);
        let result = await gateway.removeRegistrations(wrapper);
        await Regis.removeCredentials(body.oids);
        return Promise.resolve(result.message.message);
    } catch(err) {
        return Promise.reject(err);
    }
}


module.exports = services;