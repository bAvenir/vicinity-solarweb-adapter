/**
 * Thing Description class
 * This class validates TD input and generates registration form
 * @class
 */

const config = require('../configuration');

 module.exports = class Registration{

    /**
     * Receives Object from registration endpoint
     * @param {object} data 
     */
    constructor(data) {
        this['td.adapter-id'] = null;
        this.td.name =  null;
        this.td.type = "core:Device";
        this['td.located-in'] = []; 
        this.td.actions = [];
        this.td.events = [];
        this.td.properties = [];
        this._buildTD(data);
      }

    // Public Methods

    /**
     * @returns object ready to be registered
     */
    get registrationObject(){
        return {
            adid: config.gatewayId,
            thingDescriptions: [ this.td ]
        }
    }

    storeCredentials(){
        // TBD store credentials returned after registration in a file
    }

    // Static Methods

    /**
     * Receives many valid TD inside an array
     * Creates an object for multiple registration
     * @param {array} arrayOfTDs 
     */
    static manyRegistrationObjects(arrayOfTDs){
        return {
            adid: config.gatewayId,
            thingDescriptions: arrayOfTDs
        }
    }

    // Private Methods

    _buildTD(data){
        try{
            this._validate(data);
            // TBD
        } catch(err){

        }
    }

    _validate(data){
        // TBD
        throw new error('Missing parameters');
    }

 }