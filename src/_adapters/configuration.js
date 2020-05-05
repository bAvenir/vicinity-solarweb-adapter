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
config.timeout = process.env.SERVER_TIMEOUT;
config.responseMode = process.env.ADAPTER_RESPONSE_MODE || "dummy";
config.dataCollectionMode = process.env.ADAPTER_DATA_COLLECTION_MODE || "dummy";
config.proxyUrl = process.env.ADAPTER_PROXY_URL || "http://localhost:8000";
config.host = process.env.FRONIUS_HOST;
config.baseURL = process.env.FRONIUS_BASEURL;
config.username = process.env.FRONIUS_Username;
config.password = process.env.FRONIUS_Password;
config.apikey = process.env.FRONIUS_ApiKey;
config.deviceid = process.env.FRONIUS_DeviceId;
config.devicedescription = process.env.FRONIUS_DeviceDescription;
config.appversion = process.env.FRONIUS_AppVersion;
config.osversion = process.env.FRONIUS_OsVersion;
config.events = process.env.FRONIUS_Events;
config.eventsInterval = process.env.FRONIUS_Events_Interval;

