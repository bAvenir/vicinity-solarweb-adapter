/**
 * GATEWAY configuration parameters
 * Included in .env (at project root)
 */

const dotenv = require('dotenv');

// Read configuration      
dotenv.config();

// Configuration object to export
let config = module.exports = {};

// Argument passed to node when starting app
config.host = process.env.GTW_HOST || "localhost";
config.port = process.env.GTW_PORT || '8181';
config.callbackRoute = process.env.GTW_CALLBACK_ROUTE || 'agent';
config.route = process.env.GTW_ROUTE || 'api';
config.timeout = process.env.GTW_TIMEOUT || '10000';
config.gatewayId = process.env.GTW_ID;
config.gatewayPwd = process.env.GTW_PWD;
config.gatewayCredentials = 'Basic ' +  Buffer.from(process.env.GTW_ID + ":" + process.env.GTW_PWD).toString('base64');
