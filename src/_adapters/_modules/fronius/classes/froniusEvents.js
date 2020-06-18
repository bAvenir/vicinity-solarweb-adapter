/**
 * Fronius Events class
 * Sends events using the NodeJS built in timer
 * @class
 */

const vcntagent = require('bavenir-agent'); 
const redis = vcntagent.redis;
const gateway = vcntagent.gateway;
const fronius = require('../interface');
const config = require('../../../configuration');
const Log = vcntagent.classes.logger;

 module.exports = class froniusEvents{

    constructor() {}

    startEvents(){
        let logger = new Log();
        if(config.fronius.events === 'enabled'){
            this.event = setInterval(this._sendEvents, config.fronius.eventsInterval);
        } else {
            logger.warn('Events are disabled in configuration...', 'FRONIUS_EVENTS');
        }
    }

    stopEvents(){
        let logger = new Log();
        if(config.fronius.events === 'enabled'){
            clearInterval(this.event);
        } else {
            logger.warn('Events are disabled in configuration...', 'FRONIUS_EVENTS');
        }
    }

    async _sendEvents(){
        let logger = new Log();
        let oid, properties, events;
        try{
            let members = await redis.smembers("FRONIUSDEVICES");
            let eBattery = {}; // Event battery
            let ePv = {}; // Event PV
            for(let i=0, l=members.length; i<l; i++){
                oid = await redis.hget(members[i], 'oid');
                if(oid){
                    properties = await redis.hget(members[i], 'properties');
                    events = await redis.hget(members[i], 'events');
                    properties = properties.split(',');
                    events = events.split(',');
                    eBattery.name = ePv.name = await redis.hget(members[i], 'name');
                    eBattery.oid = ePv.oid = oid;
                    for(let j=0, k=properties.length; j<k; j++){
                        let aux = await fronius.getData(oid, properties[j]);
                        let type = await redis.hget(`map:${properties[j]}`, 'type');
                        if(type === 'pv') { ePv[properties[j]] = aux.value; }
                        else { eBattery[properties[j]] = aux.value; }
                    }
                    if(events.indexOf('pv') !== -1) await gateway.publishEvent(oid, 'pv', ePv); 
                    if(events.indexOf('battery') !== -1) await gateway.publishEvent(oid, 'battery', eBattery);
                }
            }
            logger.info('FRONIUS events published', 'FRONIUS_EVENTS');
        } catch(err) {
            logger.error(err, 'FRONIUS_EVENTS');
        }
    }
 }