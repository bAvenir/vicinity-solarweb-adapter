/**
* controllers.js
* Process simple incoming requests to API
* DOES not receive calls from internal processes
* Send to services.js for advanced processing 
*/ 

const Log = require('../_classes/logger');
const gtwInterface = require('./interface');
const services = require('./services');

module.exports.login = function(req, res){
    let oid = req.params.oid || null; // If null => Use gtw credentials
    let logger = new Log();
    gtwInterface.login(oid)
    .then(() => {
        logger.info("Login successful", "AGENT");
        res.json({error: false, message: "Login successful"})
    })
    .catch((err) => {
        logger.error(err, "AGENT");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    }) 
}

module.exports.logout = function(req, res){
    let oid = req.params.oid || null; // If null => Use gtw credentials
    let logger = new Log();
    gtwInterface.logout(oid)
    .then(() => {
        logger.info("Logout successful", "AGENT");
        res.json({error: false, message: "Logout successful"})
    })
    .catch((err) => {
        logger.error(err, "AGENT");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    }) 
}

module.exports.getRegistrations = function(req, res){
    let logger = new Log();
    gtwInterface.getRegistrations()
    .then((response) => {
        logger.info("Objects registered retrieved", "AGENT");
        res.json({error: false, message: response})
    })
    .catch((err) => {
        logger.error(err, "AGENT");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    }) 
}

/**
 * Registration endpoint
 * Body:
 * @param {STRING} name --> Object Human Readable Name
 * @param {STRING} type --> VICINITY valid type i.e. core:Device
 * @param {STRING} adapterId --> Id of the Object in your Infrastructure 
 * @param {STRING} version --> OPTIONAL 
 * @param {STRING} description --> OPTIONAL 
 * @param {OBJECT} locatedIn --> OPTIONAL 
 * @param {ARRAY} properties --> [name_prop1, ...] OPTIONAL 
 * @param {ARRAY} actions --> [name_action1, ...] OPTIONAL
 * @param {ARRAY} events --> [name_event1, ...] OPTIONAL
 */
module.exports.postRegistrations = function(req, res){
    let body = req.body;
    let logger = new Log();
    services.registerObject(body)
    .then((response) => {
        logger.info("Objects registered and credentials stored!", "AGENT");
        res.json({error: false, message: response})
    })
    .catch((err) => {
        logger.error(err, "AGENT");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    }) 
}

/**
 * Remove registered object endpoint
 * Body:
 * @param {OBJECT} oids --> {oids: [oid1, oid2, ...] }
 */
module.exports.removeRegistrations = function(req, res){
    let body = req.body;
    let logger = new Log();
    services.removeObject(body)
    .then((response) => {
        logger.info("Objects unregistered", "AGENT");
        res.json({error: false, message: response})
    })
    .catch((err) => {
        logger.error(err, "AGENT");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    }) 
}

module.exports.discovery = function(req, res){
    let oid = req.params.oid;
    let logger = new Log();
    gtwInterface.discovery(oid)
    .then((response) => {
        logger.info("Neighbours discovered", "AGENT");
        res.json({error: false, message: response})
    })
    .catch((err) => {
        logger.error(err, "AGENT");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    }) 
}

module.exports.consumption = function(req, res){
    // TBD Enable resource consumption through API
    // Properties, events and actions
    res.send('Endpoint under development');
}
