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
config.rootPath = process.env.NODE_PATH || ".";
config.timeout = process.env.SERVER_TIMEOUT;
config.responseMode = process.env.ADAPTER_RESPONSE_MODE || "dummy";
config.dataCollectionMode = process.env.ADAPTER_DATA_COLLECTION_MODE || "dummy";
config.proxyUrl = process.env.ADAPTER_PROXY_URL || "http://localhost:8000";
config.serviceOid = process.env.ADAPTER_SERVICE_OID || null;
config.mqtt = {};
config.mqtt.host = process.env.ADAPTER_MQTT_HOST || null;
config.mqtt.user = process.env.ADAPTER_MQTT_USER || null;
config.mqtt.password = process.env.ADAPTER_MQTT_PASSWORD || null;
config.mqtt.infrastructureName = process.env.ADAPTER_MQTT_INFRASTRUCTURE_NAME|| null;
config.mqtt.itemsType = process.env.ADAPTER_MQTT_ITEMS_TYPE || null;
config.mqtt.itemsEvents = process.env.ADAPTER_MQTT_ITEMS_EVENTS.split(',') || "";
config.fronius = {};
config.fronius.host = process.env.FRONIUS_HOST;
config.fronius.baseURL = process.env.FRONIUS_BASEURL;
config.fronius.username = process.env.FRONIUS_Username;
config.fronius.password = process.env.FRONIUS_Password;
config.fronius.apikey = process.env.FRONIUS_ApiKey;
config.fronius.deviceid = process.env.FRONIUS_DeviceId;
config.fronius.devicedescription = process.env.FRONIUS_DeviceDescription;
config.fronius.appversion = process.env.FRONIUS_AppVersion;
config.fronius.osversion = process.env.FRONIUS_OsVersion;
config.fronius.events = process.env.FRONIUS_Events;
config.fronius.eventsInterval = process.env.FRONIUS_Events_Interval;

