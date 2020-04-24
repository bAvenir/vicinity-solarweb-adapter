/**
* services.js
* Methods and functionality for the persistance module
*/

const redis = require('./_modules/redis');
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

fun.getInteractionObject = async function(type, oid){
    let logger = new Log();
    try{ 
        let obj = await redis.hget(type + ":" + oid, "body");
        return Promise.resolve(obj);
    } catch(err) {
        logger.error(err, "PERSISTANCE")
        return Promise.reject(false)
    }
}

// Private functions

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
            throw new Error("Object with oid " + data.oid + " misses some fields, its credentials could not be stored...");
        }
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
        return Promise.resolve(true);
    } catch(err) {
        logger.warn(err, "PERSISTANCE")
        return Promise.resolve(false)
    }
}

// Export module
module.exports = fun;