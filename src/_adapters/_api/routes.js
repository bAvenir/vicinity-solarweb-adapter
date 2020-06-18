/**
 * Adapter routes
 * Define routes for your adapter actions
 * @interface
 */
const express = require('express');
let router = express.Router();
let controller = require('./controllers');

router
  // ADMINISTRATION endpoints
  .get('/mqtt/connect', controller.mqttController)
  .get('/mqtt/disconnect', controller.mqttController)
  .post('/mqtt/subscribe', controller.mqttController)
  .post('/mqtt/unsubscribe', controller.mqttController)
  .get('/properties/autorequest', controller.getAutoPropertiesEnable)
  .delete('/properties/autorequest',controller.getAutoPropertiesDisable)
  // FRONIUS endpoints
  .get('/fronius/discover', controller.froniusDiscover)
  .get('/fronius/discover/:id', controller.froniusDiscover)
  .post('/fronius/register/:id', controller.froniusRegister)
  .delete('/fronius/register/:id', controller.froniusUnregister)
  // FRONIUS Events
  .post('/fronius/events', controller.froniusStartEvents)
  .delete('/fronius/events', controller.froniusStopEvents);

  module.exports = router;
