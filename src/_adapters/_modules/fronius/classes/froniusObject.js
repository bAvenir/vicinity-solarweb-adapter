/**
 * Fronius Object class
 * @class
 */

const Log = require('../../../../_classes/logger');
const redis = require('../../../../_persistance/_modules/redis');
const agent = require('../../../../_agent/agent');

 module.exports = class froniusObject{

    constructor(name, id, peakpower) {
        this.type = "adapters:ComboBatteryPV";
        this.name = name;
        this.adapterId = id;
        this.PeakPower = peakpower;
      }

      getDevices(obj){
        this.pvs = 0;
        this.batteries = 0;
        this.NominalAcPower = 0; // AC power of all PVS under accumulator
        this.Capacity = 0; // Capacity of all batteries under accumulator
        let keys = Object.keys(obj);
        for(let i=0, l=keys.length; i<l; i++){
          if(obj[keys[i]].InverterInfo){
            this.pvs += obj[keys[i]].InverterInfo.length;
            this.NominalAcPower += obj[keys[i]].InverterInfo.reduce((acc, item) => acc + item.NominalAcPower, 0);
          }
          if(obj[keys[i]].BatteryInfo){
            this.batteries += obj[keys[i]].BatteryInfo.length;
            this.Capacity += obj[keys[i]].BatteryInfo.reduce((acc, item) => acc + item.Capacity, 0);
          }
        }
      }

      /** 
       * Add properties during registration
       * Battery and/or pv properties based on FRONIUS metadata
       */
      async getProperties(){
        let newProperties = []; // Device properties to be added to metadata
        let properties = await redis.smembers('properties');
        let batteryProperties = [];
        let pvProperties = [];
        let aux;
        for(let i=0, l=properties.length; i<l; i++){
          aux = await redis.hget(`map:${properties[i]}`, 'type');
          if(aux === 'pv'){
            pvProperties.push(properties[i]);
          } else {
            batteryProperties.push(properties[i]);
          }
        }          
        if(this.pvs > 0) newProperties = [...pvProperties];
        if(this.batteries > 0) newProperties.push(...batteryProperties);
        this.properties = newProperties;
      }

        /** 
       * Add events during registration
       * Battery and/or pv events based on FRONIUS metadata
       */
      getEvents(){     
        let events = [];   
        if(this.pvs > 0) events.push('pv');
        if(this.batteries > 0) events.push('battery');
        this.events = events;
      }

      /**
       * Store FRONIUS metadata info in adapter memory
       */
      async storeInMemory(){
        try{
            await redis.sadd("FRONIUSDEVICES", this.adapterId);
            await redis.hset(this.adapterId, "adapterId", this.adapterId);
            await redis.hset(this.adapterId, "name", this.name);
            await redis.hset(this.adapterId, "type", this.type);
            await redis.hset(this.adapterId, "PeakPower", this.PeakPower);
            await redis.hset(this.adapterId, "NominalAcPower", this.NominalAcPower);
            await redis.hset(this.adapterId, "pvs", this.pvs);
            await redis.hset(this.adapterId, "Capacity", this.Capacity);
            await redis.hset(this.adapterId, "batteries", this.batteries);
            if(this.properties.length > 0){
              await redis.hset(this.adapterId, "properties", this.properties.toString());
            } else {
              await redis.hdel(this.adapterId, "properties");
            }
            if(this.events.length > 0){
              await redis.hset(this.adapterId, "events", this.events.toString());
            } else {
              await redis.hdel(this.adapterId, "events");
            }            return Promise.resolve(true);
          } catch(err) {
            return Promise.reject(err);
        }
      }

      // Static methods: Support management actions for FRONIUS objects

      static async register(id){
        try{
          let exists = await redis.sismember('FRONIUSDEVICES', id);
          if(!exists) throw new Error(`ID: ${id}is not in the FRONIUS infrastructure`);
          let oid = await redis.hget(id, 'oid');
          if(oid) throw new Error(`FRONIUS object ${id} is already register with VICINITY OID ${oid}`);
          let toRegister = await redis.hgetall(id);
          toRegister.properties = toRegister.properties ? toRegister.properties.split(',') : [];
          toRegister.events = toRegister.events ? toRegister.events.split(',') : [];
          if(toRegister.properties.length === 0 && toRegister.events.length === 0) throw new Error("There are not properties register, is not possible to register object...");
          await agent.register(toRegister);
          // Add oid to FRONIUS OBJECT
          let flag = false;
          let oids = await redis.smembers("registrations");
          let aux;
          for(let i=0, l=oids.length; i<l; i++){
            aux = await redis.hget(oids[i], 'adapterId');
            if(aux === id) {
              await redis.hset(id, 'oid', oids[i]);
              flag = true; 
            }
          }
          if(!flag) throw new Error('Could not find FRONIUS object ' + id + ' in registrations array... Consider re-registering');
          // End adding oid
          await redis.save();
          return Promise.resolve(true);
        } catch(err) {
          return Promise.reject(err);
        }      
      }

      static async unRegister(id){
        let logger = new Log();
        let oid;
        try{
          oid = await redis.hget(id, 'oid');
          if(!oid) throw new Error(`FRONIUS object ${id} is not registered in VICINITY...`);
          await redis.hdel(id, 'oid');
          await agent.unRegister({oids: [oid]});
          return Promise.resolve(true);
        }catch(err){
          // Notify case local object unregistered but not removed in platform
          if(oid) logger.error(`Issue unregistering, please try to remove OID: ${oid} manually`, 'FRONIUS')
          return Promise.reject(err);
        }
      }

      static async discover(id){
        try{
          let result;
          if(id){
            let exists = await redis.sismember('FRONIUSDEVICES', id);
            if(!exists) throw new Error(`ID: ${id}is not in the FRONIUS infrastructure`);
            result = await redis.hgetall(id);
          } else {
            result = await redis.smembers('FRONIUSDEVICES');
          }
          return Promise.resolve(result);
        } catch(err) {
          return Promise.reject(err);
        }
      }

 }