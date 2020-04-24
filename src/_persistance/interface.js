/**
* interfaces.js
* Interface to interact with the persistance layer
* @interface
*/ 

const Log = require('../_classes/logger');
const fileMgmt = require('./_modules/fileMgmt');
const redis = require('./_modules/redis');
const services = require('./services');

/**
 * Loads in memory configuration files
 */
module.exports.loadConfigurationFile = async function(fileType){
    let logger = new Log();
    try{ 
        let file = await fileMgmt.read(`./agent/${fileType}.json`);
        let array = JSON.parse(file);
        let countRows = array.length;
        if(countRows>0){
            await services.storeInMemory(fileType, array);
            return Promise.resolve(array);
        } else {
            logger.info(`There are no ${fileType} available to load`, "PERSISTANCE");
            return Promise.resolve(array);
        }
    } catch(err) {
        logger.error(err, "PERSISTANCE")
        return Promise.reject(false)
    }
}

/**
 * Get configuration file
 * From file system
 */
module.exports.getConfigurationFile = async function(fileType){
    let logger = new Log();
    try{ 
        let file = await fileMgmt.read(`./agent/${fileType}.json`);
        let array = JSON.parse(file);
        return Promise.resolve(array);
    } catch(err) {
        logger.error(err, "PERSISTANCE")
        return Promise.reject(false)
    }
}


/**
 * Save registrations or interactions to file
 */
module.exports.saveConfigurationFile = async function(fileType, data){
    let logger = new Log();
    try{ 
        await services.storeInMemory(fileType, data);
        await fileMgmt.write(`./agent/${fileType}.json`, JSON.stringify(data));
        return Promise.resolve(true);
    } catch(err) {
        logger.error(err, "PERSISTANCE")
        return Promise.reject(false)
    }
}

/**
 * Get credentials
 * From memory
 */
module.exports.getCredentials = async function(oid){
    let logger = new Log();
    try{ 
        let credentials = await redis.hget(oid, 'credentials');
        return Promise.resolve(credentials);
    } catch(err) {
        logger.error(err, "PERSISTANCE")
        return Promise.reject(false)
    }
}


/**
 * Add new OIDs - VICINTY OBJECTS
 * To memory
 */
module.exports.addCredentials = async function(oids){
    let logger = new Log();
    try{ 
        for(let i = 0, l = oids.length; i<l; i++){
            await services.addOid(oids[i]);
        }
        return Promise.resolve(true);
    } catch(err) {
        logger.error(err, "PERSISTANCE")
        return Promise.reject(false)
    }
}

/**
 * Remove old OIDs - VICINTY OBJECTS
 * From memory
 * @param {array} oids VICINITY IDs
 */
module.exports.removeCredentials = async function(oids){
    let logger = new Log();
    try{ 
        for(let i = 0, l = oids.length; i<l; i++){
            await services.removeOid(oids[i]);
        }
        return Promise.resolve(true);
    } catch(err) {
        logger.error(err, "PERSISTANCE")
        return Promise.reject(false)
    }
}

/**
 * Get interaction object
 * From memory
 */
module.exports.getInteractionObject = async function(type, id){
    let logger = new Log();
    try{ 
        let obj = await services.getInteractionObject(type, id);
        return Promise.resolve(obj);
    } catch(err) {
        logger.error(err, "PERSISTANCE")
        return Promise.reject(false)
    }
}

/**
 * Check if incoming request is valid
 * Oid exists in infrastructure and has pid 
 */
module.exports.combinationExists = async function(oid, pid){
    // TBD if(config.db === "redis") await findOidPid(fileType, array);
    return(true)
}
