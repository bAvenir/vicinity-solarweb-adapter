/**
* controllers.js
* Process simple incoming requests to API
* DOES not receive calls from internal processes
* Send to services.js for advanced processing 
*/ 

const Log = require('../_classes/logger');
const gtwInterface = require('./interface');

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

module.exports.postRegistrations = function(req, res){
    let body = req.body;
    let logger = new Log();
    gtwInterface.postRegistrations(body)
    .then((response) => {
        logger.info("Objects registered", "AGENT");
        res.json({error: false, message: response})
    })
    .catch((err) => {
        logger.error(err, "AGENT");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    }) 
}

module.exports.removeRegistrations = function(req, res){
    let body = req.body;
    let logger = new Log();
    gtwInterface.removeRegistrations(body)
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
