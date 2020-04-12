/**
* controllers.js
* Process simple incoming requests
* Send to services.js for advanced processing 
*/ 

const Log = require('../_classes/logger');
const Resp = require('../_classes/response');
const gtwInterface = require('./interface');

module.exports.login = function(req, res){
    let oid = req.params.oid || null; // If null => Use gtw credentials
    let logger = new Log();
    gtwInterface.login(oid)
    .then(() => {
        let resp = new Resp(200, "Login successful");
        logger.info("Successful login", "AGENT");
        res.json(resp)
    })
    .catch((err) => {
        let resp = new Resp(err.code, err.message);
        logger.info(err.message, "AGENT");
        res.json(resp)
    }) 

}

module.exports.logout = function(req, res){
}

module.exports.getRegistrations = function(req, res){
}

module.exports.postRegistrations = function(req, res){
}

module.exports.removeRegistrations = function(req, res){
}

module.exports.discovery = function(req, res){
}

module.exports.consumption = function(req, res){

}
