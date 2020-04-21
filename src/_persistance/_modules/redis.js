var redis = require("redis");
var config = require('../configuration');
var client = redis.createClient(config.dbPort, config.dbHost);
var Log = require('../../_classes/logger');
var logger = new Log();

// Exposes functions for working with the cache db REDIS
module.exports = {
  getCached: (req, res, next) => {
    var redis_key = req.path;
    client.get(redis_key, function(err, reply) {
      if (err) {
        logger.error("Error reading cache", "CACHE");
        res.status(500).json({
          message: "Something Went Wrong"
        })
      }
      if (reply == null) {
        logger.debug("Cache miss " + redis_key, "CACHE");
        next();
      } else {
        logger.debug("Cache hit " + redis_key, "CACHE");
        res.status(200).json({"value": reply});
      }
    });
  },
  caching: (key, data) => {
    logger.debug("Cache adition " + key + ": " + data, "CACHE");
    client.set(key, JSON.stringify(data), 'EX', config.redisTtl)
  },
  delCache: (key) => {
    client.del(key)
  },
  start: () => {
    client.on("error", function (err) {
        logger.error("Error with Redis: " + err, "CACHE");
        process.exit(1);
    });
    client.on("connect", function() {
        logger.info("Connected successfully to Redis!!", "CACHE");
    });
  }
}
