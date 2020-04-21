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
