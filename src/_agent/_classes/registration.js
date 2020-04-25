/**
 * Thing Description class
 * This class validates TD input and generates registration form
 * @class
 */

const config = require('../configuration');
const persistance = require('../../_persistance/interface');
const interactions = {
    "properties" : {"id": "pid", "does": "monitors"},
    "actions" : {"id": "aid", "does": "affects"},
    "events" : {"id": "eid", "does": "monitors"}
}

 module.exports = class Registration{

    /**
     * Receives Object from registration endpoint
     * @param {object} data 
     */
    constructor() {
        this.td = {};
        this.td['adapter-id'] = null;
        this.td.name =  null;
        this.td.type = "core:Device";
        this.td['located-in'] = []; 
        this.td.actions = [];
        this.td.events = [];
        this.td.properties = [];
      }

    // Public Methods

    /**
     * @returns object ready to be registered
     */
    async buildTD(data){
        try{
            this._validate(data);
            this.td['adapter-id'] = data.adapterId;
            this.td.name = data.name;
            this.td.type = data.type;
            if(data.version) this.td.version = data.version;
            if(data.description) this.td.description = data.description;
            if(data.locatedIn) this.td['located-in'] = data.locatedIn;
            this.td.actions = data.actions ? await this._checkInteractionPatterns(data.actions, 'actions') : [];
            this.td.events = data.events ? await this._checkInteractionPatterns(data.events, 'events') : [];
            this.td.properties = data.properties ? await this._checkInteractionPatterns(data.properties, 'properties') : [];
            return Promise.resolve({
                agid: config.gatewayId,
                thingDescriptions: [ this.td ]
            });
        } catch(err) {
            return Promise.reject(err);
        }
    }

    /**
     * Receives newly registered objects in the platform
     * They need to be added to the agent too
     * @param {object} registration
     */
    async storeCredentials(registration){
        try{
            let localRegistrations = await persistance.getConfigurationFile('registrations');
            localRegistrations.push({
                oid: registration.oid,
                name: this.td.name,
                password: registration.password,
                adapterId: this.td['adapter-id'],
                type: this.td.type,
                properties: this._getInteractionId(this.td.properties, 'properties'),
                actions: this._getInteractionId(this.td.actions, 'actions'),
                events: this._getInteractionId(this.td.events, 'events'),
                credentials: 'Basic ' +  Buffer.from(registration.oid + ":" + registration.password).toString('base64')
            });
            await persistance.saveConfigurationFile('registrations', localRegistrations);
            return Promise.resolve(true);
        } catch(err) {
            return Promise.reject(err);
        }
    }

    // Static Methods

    /**
     * Receives many valid TD inside an array
     * Creates an object for multiple registration
     * @param {array} arrayOfTDs 
     */
    static addRegistrationWrapper(arrayOfTDs){
        return {
            agid: config.gatewayId,
            thingDescriptions: arrayOfTDs
        }
    }

    /**
     * Receives many valid OIDs inside an array
     * Creates an object for multiple removal
     * @param {array} arrayOfOIDs 
     */
    static addRemovalWrapper(arrayOfOids){
        return {
            agid: config.gatewayId,
            oids: arrayOfOids
        }
    }

    /**
     * Receives all oids that were removed form the platform
     * They need to be removed from the agent too
     * @param {array} unregistrations 
     */
    static async removeCredentials(unregistrations){
        let newRegistrations = [];
        try{
            let localRegistrations = await persistance.getConfigurationFile('registrations');
            localRegistrations.filter((item) => {
                if(unregistrations.indexOf(item.oid) === -1) newRegistrations.push(item);
            })
            await persistance.removeCredentials(unregistrations); // Remove from memory unregistered objects
            await persistance.saveConfigurationFile('registrations', newRegistrations);
            return Promise.resolve(true);
        } catch(err) {
            return Promise.reject(err);
        }
    }

    // Private Methods

    async _checkInteractionPatterns(interactions, type){
        let interactionsArray = [];
        try{
            if(!Array.isArray(interactions)) throw new Error(`REGISTRATION ERROR: ${type} is not a valid array`);
            let uniqueInteractions = [ ...new Set(interactions)]; // Ensure interaction ids registered are unique 
            for(let i = 0, l = uniqueInteractions.length; i < l; i++){
                let aux = await persistance.getInteractionObject(type, uniqueInteractions[i]);
                if(aux == null) throw new Error(`REGISTRATION ERROR: Interaction: ${uniqueInteractions[i]} could not be found in ${type}`); 
                interactionsArray.push(JSON.parse(aux));
            }
            // TBD If there are events --> Create the channel!!!
            return Promise.resolve(interactionsArray);
        } catch(err) {
            return Promise.reject(err);
        }
    }

    _validate(data){
        if(!data.name) throw new Error('REGISTRATION ERROR: Missing name');
        if(!data.type) throw new Error('REGISTRATION ERROR: Missing type');
        if(!data.adapterId) throw new Error('REGISTRATION ERROR: Missing adapterId');
    }

    /**
     * Return only pid/aid/eid of interactions
     * @param {array} array 
     */
    _getInteractionId(array, type){
        let id = interactions[type]['id'];
        let result = [];
        for(let i=0, l=array.length; i<l; i++){
            result.push(array[i][id]);
        }
        return result;
    }
 }