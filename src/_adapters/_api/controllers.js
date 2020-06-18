/**
* controllers.js
* Process simple incoming from adapter API
* Send to other modules for advanced processing 
*/ 


const mqttServices = require('../_modules/mqtt');
const adapter = require('../interface')
const fronius = require('../_modules/fronius/fronius');
const Log = require('bavenir-agent').classes.logger;
let logger = new Log();


// MQTT Controllers

/**
 * MQTT controller
 * For subscribe and unsubscribe add body
 * @param {object} {"topic": "", "event": ""}
 */
module.exports.mqttController = function(req, res){
    let path = req.path;
    let body = req.body || null;
    let topic = body ? body : null;
    let n = path.lastIndexOf('/');
    let action = path.substring(n + 1);
    try{
        mqttServices[action](topic);
        res.json({error: false, message: action + ' DONE'});
    } catch(err) {
        res.json({error: true, message: action + ' FAILED, find more info in the logs...'});
    }
}

    // Get all properties automatically (in mapper.json)

    module.exports.getAutoPropertiesEnable = function(req, res){
        adapter.startPropertiesCollection();
        res.send('Automatic data collection enabled');
    }

    module.exports.getAutoPropertiesDisable = function(req, res){
        adapter.stopPropertiesCollection();
        res.send('Automatic data collection disabled');
    }

// FRONIUS endpoints

module.exports.froniusDiscover = function(req, res){
    let id = req.params.id;
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
    fronius.unRegister(id)
    .then(() => {
        res.json({error: false, message: 'DONE'})
    })
    .catch((err) => {
        logger.error(err, "ADMIN");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    })
}

module.exports.froniusStartEvents = function(req, res){
    fronius.activateEvents()
    .then(() => {
        res.json({error: false, message: 'DONE'})
    })
    .catch((err) => {
        logger.error(err, "ADMIN");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    })
}

module.exports.froniusStopEvents = function(req, res){
    fronius.deactivateEvents()
    .then(() => {
        res.json({error: false, message: 'DONE'})
    })
    .catch((err) => {
        logger.error(err, "ADMIN");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    })
}
