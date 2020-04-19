/**
 * ADAPTER configuration parameters
 * Included in .env (at project root)
 */

const dotenv = require('dotenv');

// Read configuration      
dotenv.config();

// Configuration object to export
let config = module.exports = {};

// Argument passed to node when starting app
config.responseMode = process.env.ADAPTER_RESPONSE_MODE || "dummy";
config.proxyUrl = process.env.ADAPTER_PROXY_URL || "http://localhost:8000";
