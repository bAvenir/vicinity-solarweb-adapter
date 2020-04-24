/**
* controllers.js
* Process simple incoming from admin API
* Send to other modules for advanced processing 
*/ 

const Log = require('../_classes/logger');
const persistance =  require('../_persistance/interface');

// ADMINISTRATION endpoints

/**
 * Returns last configuration status
 */
module.exports.getConfiguration = function(req, res){
    let logger = new Log();
    res.send('Under development')
    // gtwInterface.login()
    // .then(() => {
    //     logger.info("Login successful", "ADMIN");
    //     res.json({error: false, message: "Login successful"})
    // })
    // .catch((err) => {
    //     logger.error(err, "ADMIN");
    //     res.json({error: true, message: "Something went wrong, check the logs for more info"})
    // }) 
}

/**
 * Reload configuration files
 */
module.exports.reloadConfiguration = function(req, res){
    let logger = new Log();
    res.send('Under development')
}

module.exports.registrations = function(req, res){
    let id = req.params.id || null; // If null => Use gtw credentials
    let logger = new Log();
    res.send('Under development')
}

module.exports.properties = function(req, res){
    let id = req.params.id || null; // If null => Use gtw credentials
    let logger = new Log();
    res.send('Under development')
}

module.exports.actions = function(req, res){
    let id = req.params.id || null; // If null => Use gtw credentials
    let logger = new Log();
    res.send('Under development')
}

module.exports.events = function(req, res){
    let id = req.params.id || null; // If null => Use gtw credentials
    let logger = new Log();
    res.send('Under development')
}

// HEALTHCHECK endpoints

  module.exports.healthcheck = function(req, res){
    let logger = new Log();
    res.send('Under development')
}