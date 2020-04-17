/**
 * Thing Description class
 * This class validates TD input and generates registration form
 * @class
 */

const config = require('../configuration');
const fileMgmt = require('../../_utils/fileMgmt');

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

    async storeCredentials(credentials){
        try{
            let localRegistrations = await fileMgmt.read('./agent/registrations.json');
            localRegistrations = JSON.parse(localRegistrations);
            for(let i = 0, l = credentials.length; i < l; i++){
                localRegistrations.push({
                    oid: credentials[i].oid,
                    name: credentials[i].name,
                    password: credentials[i].password,
                    adapterId: this.td['adapter-id'],
                    credentials: 'Basic ' +  Buffer.from(credentials[i].oid + ":" + credentials[i].password).toString('base64')
                });
            }
            let result = await fileMgmt.write('./agent/registrations.json', JSON.stringify(localRegistrations));
            return Promise.resolve(result);
        } catch(err) {
            return Promise.reject(err);
        }

        // TBD store credentials in memory also!!!
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


    static async removeCredentials(credentials){
        let newCredentials = [];
        try{
            let localRegistrations = await fileMgmt.read('./agent/registrations.json');
            localRegistrations = JSON.parse(localRegistrations);
            localRegistrations.filter((item) => {
                if(credentials.indexOf(item.oid) === -1) newCredentials.push(item);
            })
            let result = await fileMgmt.write('./agent/registrations.json', JSON.stringify(newCredentials));
            return Promise.resolve(result);
        } catch(err) {
            return Promise.reject(err);
        }

        // TBD remove credentials from memory also!!!
    }

    // Private Methods

    async _checkInteractionPatterns(interactions, type){
        let interactionsArray = [];
        let identifiers = {'properties': 'pid', 'events': 'eid', 'actions': 'aid'};
        let id = identifiers[type];
        try{
            if(!Array.isArray(interactions)) throw new Error(`REGISTRATION ERROR: ${type} is not a valid array`);
            let localInteractions = await fileMgmt.read('./agent/' + type + '.json');
            localInteractions = JSON.parse(localInteractions);
            // TBD get this from memory in future version !!!
            for(let i = 0, l = interactions.length; i < l; i++){
                let aux = localInteractions.filter((item) => { return item[id] === interactions[i] });
                if(aux[0] == null) throw new Error(`REGISTRATION ERROR: Interaction: ${interactions[i]} could not be found in ${type}`); 
                interactionsArray.push(aux[0]);
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

 }