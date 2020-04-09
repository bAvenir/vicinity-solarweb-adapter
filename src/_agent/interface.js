/**
* interfaces.js
* Interface to interact with the gateway API 
* @interface
*/ 

// ***** AUTHENTICATION *****

/**
 * Login an object in VICINITY
 * @param {user: string, password: string}
 * @return {error: boolean, message: string} 
 */

module.exports.login = async function(user, password){}

/**
 * Logout an object in VICINITY
 * @param {user: string, password: string}
 * @return {error: boolean, message: string} 
 */

module.exports.logout = async function(user, password){}

// ***** REGISTRATION *****

/**
 * Get list of objects registered under your gateway
 * (Using the access point credentials generated for it)
 * @param {}
 * @return {error: boolean, message: array of TDs} 
 */

module.exports.getRegistrations = async function(){}


/**
 * Register object/s under your gateway
 * (Using the access point credentials generated for it)
 * @param {body: Array of TDs}
 * @return {error: boolean, message: array of TDs} 
 */

module.exports.postRegistrations = async function(body){}

/**
 * Remove object/s under your gateway
 * (Using the access point credentials generated for it)
 * @param {body: Array of OIDs}
 * @return {error: boolean, message: [{value: string, result: string, error: string}]} 
 */

module.exports.removeRegistrations = async function(body){}

/**
 * @TBD:
 * Soft update
 * Hard update
 */

 // ***** DISCOVERY *****

 /**
 * Retrieve all objects that your object can see
 * (Understand object as gateway, service or device instance)
 * (Using the credentials of a service or device)
 * @param {user: string, password: string}
 * @return {error: boolean, message: [oid: string]} 
 */

module.exports.discovery = async function(user, password){}

/**
 * @TBD:
 * SPARQL query
 */

 // ***** RESOURCE CONSUMPTION *****
 // Properties, events and actions

 /**
 * Get a property
 * (Using the credentials of a service or device)
 * @param {user: string, password: string, oid: string, pid: string}
 * @return {error: boolean, message: object} 
 */

module.exports.getProperty = async function(user, password, oid, pid){}

 /**
 * Activate the event channel
 * (Using the credentials of a service or device)
 * @param {user: string, password: string, eid: string}
 * @return {error: boolean, message: string} 
 */

module.exports.activateEventChannel = async function(user, password, eid){}

 /**
 * Publish event to channel
 * (Using the credentials of a service or device)
 * @param {user: string, password: string, eid: string, body: object}
 * @return {error: boolean, message: string} 
 */

module.exports.publishEvent = async function(user, password, eid, body){}

 /**
 * Deactivate event channel
 * (Using the credentials of a service or device)
 * @param {user: string, password: string, eid: string}
 * @return {error: boolean, message: string} 
 */

module.exports.deactivateEventChannel = async function(user, password, eid){}

 /**
 * Get status of remote event channel
 * (Using the credentials of a service or device)
 * @param {user: string, password: string, eid: string}
 * @return {error: boolean, message: string} 
 */

module.exports.statusRemoteEventChannel = async function(user, password, oid, eid){}

 /**
 * Subscribe to remote event channel
 * (Using the credentials of a service or device)
 * @param {user: string, password: string, eid: string}
 * @return {error: boolean, message: string} 
 */

module.exports.subscribeRemoteEventChannel = async function(user, password, oid, eid){}

 /**
 * Unsubscribe to remote event channel
 * (Using the credentials of a service or device)
 * @param {user: string, password: string, eid: string}
 * @return {error: boolean, message: string} 
 */

module.exports.unsubscribeRemoteEventChannel = async function(user, password, oid, eid){}

/**
 * @TBD:
 * Set a property
 * Execute action on remote object
 * Update status of a task
 * Retrieve the status or a return value of a given task
 * Cancel a task in progress
 */


