/**
 * Fronius Object class
 * @class
 */

const redis = require('../../../../_persistance/_modules/redis');
const agent = require('../../../../_agent/agent');

 module.exports = class froniusObject{

    constructor(name, id, peakpower) {
        this.type = "adapters:ComboBatteryPV";
        this.name = name;
        this.adapterId = id;
        this.peakpower = peakpower;
      }

      async storeInMemory(){
        try{
            await redis.sadd("FRONIUSDEVICES", this.adapterId);
            await redis.hset(this.adapterId, "adapterId", this.adapterId);
            await redis.hset(this.adapterId, "name", this.name);
            await redis.hset(this.adapterId, "type", this.type);
            await redis.hset(this.adapterId, "peakpower", this.peakpower);
            return Promise.resolve(true);
          } catch(err) {
            return Promise.reject(err);
        }
      }

      // Static methods: Support management actions for FRONIUS objects

      static async register(id){
        try{
          let properties = await redis.smembers("properties");
          if(properties.length === 0) throw new Error("There are not properties register, is not possible to register objects...");
          let exists = await redis.sismember('FRONIUSDEVICES', id);
          if(!exists) throw new Error(`ID: ${id}is not in the FRONIUS infrastructure`);
          let oid = await redis.hget(id, 'oid');
          if(oid) throw new Error(`FRONIUS object ${id} is already register with VICINITY OID ${oid}`);
          let toRegister = await redis.hgetall(id);
          toRegister.properties = properties;
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
        try{
          let oid = await redis.hget(id, 'oid');
          if(!oid) throw new Error(`FRONIUS object ${id} is not registered in VICINITY...`);
          await agent.unRegister({oids: [oid]});
          await redis.hdel(id, 'oid');
          return Promise.resolve(true);
        }catch(err){
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