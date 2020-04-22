var redis = require("redis");
var config = require('../../configuration');
var client = redis.createClient(config.dbPort, config.dbHost);
var Log = require('../../../_classes/logger');
var logger = new Log();

// Exposes functions for working with the cache db REDIS
module.exports = {
  // CACHE
  /**
   * Listens to incoming proerpty requests 
   * Acts as a middleware
   * If the key exists retrieve value from cache
   */
  getCached: (req, res, next) => {
    var redis_key = req.path;
    client.get(redis_key, function(err, reply) {
      if (err) {
        logger.error("Error reading cache", "REDIS");
        res.status(500).json({
          message: "Something Went Wrong"
        })
      }
      if (reply == null) {
        logger.debug("Cache miss " + redis_key, "REDIS");
        next();
      } else {
        logger.debug("Cache hit " + redis_key, "REDIS");
        res.status(200).json({"value": reply});
      }
    });
  },
  /**
   * Store value in cache after request to the source API
   * TTL is configurable
   */
  caching: (key, data) => {
    logger.debug("Cache adition " + key + ": " + data, "REDIS");
    client.set(key, JSON.stringify(data), 'EX', config.cacheTtl)
  },
  /**
   * Remove manually key stored for the cache
   */
  delCache: (key) => {
    client.del(key)
  },
  // INIT
  start: () => {
    client.on("error", function (err) {
        logger.error(err, "REDIS");
        process.exit(1);
    });
    client.on("connect", function() {
        logger.info("Connected successfully to Redis!!", "REDIS");
    });
  },
  // SETS
  /**
   * Adds item to set
   * item can be an array of items or a string
   */
  sadd: (key, item) => {
    client.sadd(key, item, function(err, reply) {
      if (err) {
        logger.error(err, "REDIS");
        return Promise.reject(false);
      } else {
        return Promise.resolve(reply);
      }
    });
  },
  /**
   * Remove item from set
   * item can be an array of items or a string
   */
  srem: (key, item) => {
    client.srem(key, item, function(err, reply) {
      if (err) {
        logger.error(err, "REDIS");
        return Promise.reject(false);
      } else {
        return Promise.resolve(reply);
      }
    });
  },
  /**
   * Check if item is a set member
   */
  sismember: (key, item) => {
    client.sismember(key, item, function(err, reply) {
      if (err) {
        logger.error(err, "REDIS");
        return Promise.reject(false);
      } else {
        return Promise.resolve(reply);
      }
    });
  },
  /**
   * Count of members in set
   */
  scard: (key) => {
    client.scard(key, function(err, reply) {
      if (err) {
        logger.error(err, "REDIS");
        return Promise.reject(false);
      } else {
        return Promise.resolve(reply);
      }
    });
  },
  /**
   * Retrieve all set members
   */
  smembers: (key) => {
    client.smembers(key, function(err, reply) {
      if (err) {
        logger.error(err, "REDIS");
        return Promise.reject(false);
      } else {
        return Promise.resolve(reply);
      }
    });
  },
  // HASH
  /**
   * Get value of a key in a hash
   * key can be array of keys
   */
  hget: (hkey, key) => {
    client.hget(hkey, key, function(err, reply) {
      if (err) {
        logger.error(err, "REDIS");
        return Promise.reject(false);
      } else {
        return Promise.resolve(reply);
      }
    });
  },
  /**
   * Set value of a key in a hash
   * @param {object} obj {key1:val1, key2:val2, ...}
   */
  hset: (hkey, obj) => {
    client.hset(hkey, obj, function(err, reply) {
      if (err) {
        logger.error(err, "REDIS");
        return Promise.reject(false);
      } else {
        return Promise.resolve(reply);
      }
    });  
  },
  /**
   * Remove key in a hash
   * key can be array of keys
   */
  hdel: (hkey, key) => {
    client.hdel(hkey, key, function(err, reply) {
      if (err) {
        logger.error(err, "REDIS");
        return Promise.reject(false);
      } else {
        return Promise.resolve(reply);
      }
    });
  },
  /**
   * Check if key exists in hash
   */
  hexists: (hkey, key) => {
    client.hexists(hkey, key, function(err, reply) {
      if (err) {
        logger.error(err, "REDIS");
        return Promise.reject(false);
      } else {
        return Promise.resolve(reply);
      }
    });
  },
  /**
   * Get all key:value in a hash
   */
  hgetall: (hkey) => {
    client.hgetall(hkey, function(err, reply) {
      if (err) {
        logger.error(err, "REDIS");
        return Promise.reject(false);
      } else {
        return Promise.resolve(reply);
      }
    });
  }
}
