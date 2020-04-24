/**
* services.js
* Methods and functionality for the persistance module
*/

const redis = require('./_modules/redis');
const gateway = require('../_agent/services');
const Log = require('../_classes/logger');
// Define possible interactions
const interactions = {
    "properties" : {"id": "pid", "does": "monitors"},
    "actions" : {"id": "aid", "does": "affects"},
    "events" : {"id": "eid", "does": "monitors"}
}

let fun = {};

// Public functions

/**
 * Stores interactions in memory
 * They are used to generate TDs during registrations
 */
fun.storeInMemory = async function(type, array){
    try{
        if(type === 'registrations'){
            for(let i = 0, l = array.length; i<l; i++){
                await _addOid(array[i]);
            }
        } else {
            await _storeInteractions(type, array);
        }
        return Promise.resolve(true);
    } catch(err) {
        return Promise.reject(err);
    }
}

fun.removeOid = async function(oid){
    let logger = new Log();
    try{ 
        let todo = [];
        todo.push(redis.srem('registrations', oid));
        todo.push(redis.hdel(oid, 'credentials'));
        todo.push(redis.hdel(oid, 'password'));
        todo.push(redis.hdel(oid, 'type'));
        todo.push(redis.hdel(oid, 'name'));
        todo.push(redis.hdel(oid, 'adapterId'));
        todo.push(redis.hdel(oid, 'properties'));
        todo.push(redis.hdel(oid, 'events'));
        todo.push(redis.hdel(oid, 'agents'));
        await Promise.all(todo);
        return Promise.resolve(true);
    } catch(err) {
        logger.error(err, "PERSISTANCE")
        return Promise.reject(false)
    }
}

/**
 * Get an interaction previously stored
 * Interactions are user defined
 * @param {string} type (preperties, actions, events)
 * @param {string} id interaction name
 * @returns {object} JSON with TD interaction schema
 */
fun.getInteractionObject = async function(type, id){
    let logger = new Log();
    try{ 
        let obj = await redis.hget(type + ":" + id, "body");
        return Promise.resolve(obj);
    } catch(err) {
        logger.error(err, "PERSISTANCE")
        return Promise.reject(false)
    }
}

/**
 * Adds configuration of agent info
 * To memory
 */
fun.addConfigurationInfo = async function(){
    let logger = new Log();
    try{ 
        let d = new Date();
        let numregis = await redis.scard('registrations');
        let numprops = await redis.scard('properties');
        let numactions = await redis.scard('actions');
        let numevents = await redis.scard('events');
        await redis.hset("configuration", "date", d.toISOString());
        await redis.hset("configuration", "registrations", numregis);
        await redis.hset("configuration", "properties", numprops);
        await redis.hset("configuration", "actions", numactions);
        await redis.hset("configuration", "events", numevents);
        return Promise.resolve(true);
    } catch(err) {
        logger.error(err, "PERSISTANCE")
        return Promise.reject(false)
    }
}

 /**
 * Removes configuration of agent info
 * From memory
 */
fun.removeConfigurationInfo = async function(){
    let logger = new Log();
    try{ 
        await redis.hdel("configuration", "date");
        await redis.hdel("configuration", "registrations");
        await redis.hdel("configuration", "properties");
        await redis.hdel("configuration", "actions");
        await redis.hdel("configuration", "events");
        return Promise.resolve(true);
    } catch(err) {
        logger.error(err, "PERSISTANCE")
        return Promise.reject(false)
    }
}

// Private functions

/**
 * Stores user defined interactions in memory
 * @param {string} type (preperties, actions, events)
 * @param {array} array interactions array with JSONs
 */
async function _storeInteractions(type, array){
    let logger = new Log();
    let interaction =  interactions[type];
    let id = interaction['id'];
    let does = interaction['does'];
    logger.debug(`Storing ${type}...`, "PERSISTANCE")
    for(let i=0, l=array.length; i<l; i++){
        try{
            let exists = await redis.sismember(type, array[i][id]);
            let notNull = (array[i][id] != null && array[i][does] != null);
            if(!exists && notNull){
                await redis.sadd(type, array[i][id]);
                await redis.hset(`${type}:${array[i][id]}`, 'body', JSON.stringify(array[i]));
                await redis.hset(`${type}:${array[i][id]}`, 'vicinity', array[i][does]);
                logger.debug(`${type} entry ${i} : ${array[i][id]} stored`, "PERSISTANCE");
            } else {
                if(exists) logger.warn(`${type} entry ${i} already exists`, "PERSISTANCE");
                if(!notNull) logger.warn(`${type} entry ${i} misses id or interaction`, "PERSISTANCE");
            }
        } catch(err) {
            Promise.reject(err);
        }
    }
}

async function _addOid(data){
    let logger = new Log();
    try{ 
        let todo = [];
        if(!data.credentials || !data.password || !data.adapterId || !data.name || !data.type ){
            throw new Error(`Object with oid ${data.oid} misses some fields, its credentials could not be stored...`);
        }
        let exists = await redis.sismember('registrations', data.oid);
        if(!exists){
            todo.push(redis.sadd('registrations', data.oid));
            todo.push(redis.hset(data.oid, 'credentials', data.credentials));
            todo.push(redis.hset(data.oid, 'password', data.password));
            todo.push(redis.hset(data.oid, 'adapterId', data.adapterId));
            todo.push(redis.hset(data.oid, 'name', data.name));
            todo.push(redis.hset(data.oid, 'type', data.type));
            if(data.properties.length) todo.push(redis.hset(data.oid, 'properties', data.properties.toString()));
            if(data.events.length) todo.push(redis.hset(data.oid, 'events', data.events.toString()));
            if(data.actions.length) todo.push(redis.hset(data.oid, 'agents', data.agents.toString()));
            await Promise.all(todo);
        }
        if(data.events.length) await gateway.activateEventChannels(data.oid, data.events);
        return Promise.resolve(true);
    } catch(err) {
        logger.warn(err, "PERSISTANCE")
        return Promise.resolve(false)
    }
}

// Export module
module.exports = fun;