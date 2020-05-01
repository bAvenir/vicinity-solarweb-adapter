/**
* controllers.js
* Process simple incoming from admin API
* Send to other modules for advanced processing 
*/ 

const Log = require('../_classes/logger');
const persistance =  require('../_persistance/interface');
const agent = require('../_agent/agent');
const gateway = require('../_agent/interface');
const fronius = require('../_adapters/_modules/fronius/fronius');

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

// REGISTRATIONS monitoring

/**
 * Get registered items in local infrastructure
 */
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

// INTERACTIONS management

/**
 * MANAGE registered properties in local infrastructure
 * GET
 * POST
 * DELETE
 */
module.exports.propertiesGet = function(req, res){
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

module.exports.propertiesPost = function(req, res){
    let logger = new Log();
    let body = req.body;
    persistance.addInteractionObject('properties', body)
    .then((response) => {
        if(response){
            logger.info(`New property ${body.pid} posted`, "ADMIN");
            res.json({error: false, message: "Success"});
        } else {
            logger.info(`New property ${body.pid} could not be posted`, "ADMIN");
            res.json({error: false, message: "Problem adding, please check logs"});
        }
    })
    .catch((err) => {
        logger.error(err, "ADMIN");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    })
}

module.exports.propertiesDelete = function(req, res){
    let id = req.params.id || null; // If null => Use gtw credentials
    let logger = new Log();
    persistance.removeInteractionObject('properties', id)
    .then((response) => {
        logger.info(`Property ${id} removed`, "ADMIN");
        res.json({error: false, message: response})
    })
    .catch((err) => {
        logger.error(err, "ADMIN");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    })
}

/**
 * MANAGE registered actions in local infrastructure
 * GET
 * POST
 * DELETE
 */
module.exports.actionsGet = function(req, res){
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

module.exports.actionsPost = function(req, res){
    let logger = new Log();
    let body = req.body;
    persistance.addInteractionObject('actions', body)
    .then((response) => {
        if(response){
            logger.info(`New action ${body.aid} posted`, "ADMIN");
            res.json({error: false, message: "Success"});
        } else {
            logger.info(`New action ${body.aid} could not be posted`, "ADMIN");
            res.json({error: false, message: "Problem adding, please check logs"});
        }
    })
    .catch((err) => {
        logger.error(err, "ADMIN");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    })
}

module.exports.actionsDelete = function(req, res){
    let id = req.params.id || null; // If null => Use gtw credentials
    let logger = new Log();
    persistance.removeInteractionObject('actions', id)
    .then((response) => {
        logger.info(`Action ${id} removed`, "ADMIN");
        res.json({error: false, message: response})
    })
    .catch((err) => {
        logger.error(err, "ADMIN");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    })
}

/**
 * MANAGE registered events in local infrastructure
 * GET
 * POST
 * DELETE
 */
module.exports.eventsGet = function(req, res){
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

module.exports.eventsPost = function(req, res){
    let logger = new Log();
    let body = req.body;
    persistance.addInteractionObject('events', body)
    .then((response) => {
        if(response){
            logger.info(`New event ${body.eid} posted`, "ADMIN");
            res.json({error: false, message: "Success"});
        } else {
            logger.info(`New event ${body.eid} could not be posted`, "ADMIN");
            res.json({error: false, message: "Problem adding, please check logs"});
        }
    })
    .catch((err) => {
        logger.error(err, "ADMIN");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    })
}

module.exports.eventsDelete = function(req, res){
    let id = req.params.id || null; // If null => Use gtw credentials
    let logger = new Log();
    persistance.removeInteractionObject('events', id)
    .then((response) => {
        logger.info(`Event ${id} removed`, "ADMIN");
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

// FRONIUS endpoints

module.exports.froniusDiscover = function(req, res){
    let id = req.params.id;
    let logger = new Log();
    fronius.discover(id)
    .then((response) => {
        res.json(response)
    })
    .catch((err) => {
        logger.error(err, "ADMIN");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    })
}

module.exports.froniusRegister = function(req, res){
    let id = req.params.id;
    let logger = new Log();
    fronius.register(id)
    .then(() => {
        res.json({error: false, message: 'DONE'})
    })
    .catch((err) => {
        logger.error(err, "ADMIN");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    })
}

module.exports.froniusUnregister = function(req, res){
    let id = req.params.id;
    let logger = new Log();
    fronius.unRegister(id)
    .then(() => {
        res.json({error: false, message: 'DONE'})
    })
    .catch((err) => {
        logger.error(err, "ADMIN");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    })
}

