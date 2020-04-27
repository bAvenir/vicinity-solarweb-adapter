/**
 * PERSISTANCE configuration parameters
 * Included in .env (at project root)
 */

const dotenv = require('dotenv');

// Read configuration      
dotenv.config();

// Configuration object to export
let config = module.exports = {};

// Argument passed to node when starting app
config.db = process.env.PERSISTANCE_DB || "none";
config.dbHost = process.env.PERSISTANCE_DB_HOST || "cache-db";
config.dbPort = process.env.PERSISTANCE_DB_PORT || 6379;
config.cache = process.env.PERSISTANCE_CACHE === 'enabled';
config.cacheTtl = process.env.PERSISTANCE_CACHE_TTL || 1000;
