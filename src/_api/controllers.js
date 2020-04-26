/**
* controllers.js
* Process simple incoming from admin API
* Send to other modules for advanced processing 
*/ 

const Log = require('../_classes/logger');
const persistance =  require('../_persistance/interface');
const agent = require('../_agent/agent');
const gateway = require('../_agent/interface');

// ADMINISTRATION endpoints

/**
 * Returns last configuration status
 */
module.exports.getConfiguration = function(req, res){
    let logger = new Log();
    persistance.getConfigInfo()
    .then((response) => {
        res.json({error: false, message: response})
    })
    .catch((err) => {
        logger.error(err, "ADMIN");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    }) 
}

/**
 * Reload configuration files
 */
module.exports.reloadConfiguration = function(req, res){
    let logger = new Log();
    agent.initialize()
    .then(() => {
        res.json({error: false, message: 'DONE'})
    })
    .catch((err) => {
        logger.error(err, "ADMIN");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    }) 
}

module.exports.registrations = function(req, res){
    let id = req.params.id || null; // If null => Use gtw credentials
    let logger = new Log();
    persistance.getConfigDetail('registrations', id)
    .then((response) => {
        res.json({error: false, message: response})
    })
    .catch((err) => {
        logger.error(err, "ADMIN");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    })
}

module.exports.properties = function(req, res){
    let id = req.params.id || null; // If null => Use gtw credentials
    let logger = new Log();
    persistance.getConfigDetail('properties', id)
    .then((response) => {
        res.json({error: false, message: response})
    })
    .catch((err) => {
        logger.error(err, "ADMIN");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    })
}

module.exports.actions = function(req, res){
    let id = req.params.id || null; // If null => Use gtw credentials
    let logger = new Log();
    persistance.getConfigDetail('actions', id)
    .then((response) => {
        res.json({error: false, message: response})
    })
    .catch((err) => {
        logger.error(err, "ADMIN");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    })
}

module.exports.events = function(req, res){
    let id = req.params.id || null; // If null => Use gtw credentials
    let logger = new Log();
    persistance.getConfigDetail('events', id)
    .then((response) => {
        res.json({error: false, message: response})
    })
    .catch((err) => {
        logger.error(err, "ADMIN");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    })
}

// IMPORT/EXPORT endpoints

module.exports.importFile = function(req, res){
    let path = req.path;
    let n = path.lastIndexOf('/');
    let type = path.substring(n + 1);
    let logger = new Log();
    agent.importFromFile(type)
    .then(() => {
        res.json({error: false, message: 'DONE'})
    })
    .catch((err) => {
        logger.error(err, "ADMIN");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    })
}

module.exports.exportFile = function(req, res){
    let path = req.path;
    let n = path.lastIndexOf('/');
    let type = path.substring(n + 1);
    let logger = new Log();
    agent.exportToFile(type)
    .then(() => {
        res.json({error: false, message: 'DONE'})
    })
    .catch((err) => {
        logger.error(err, "ADMIN");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    })
}

// HEALTHCHECK endpoints

  module.exports.healthcheck = async function(req, res){
    let redisHealth = await persistance.redisHealth();
    let gtwHealth = await gateway.health();
    res.json({error: false, message: {'Redis' : redisHealth, 'Gateway': gtwHealth, 'NodeApp': 'OK'} });
}