/**
 * routes.js
 * Administration router interface
 * Endpoint 'api'
 * User requests information about the system configuration and local infrastructure
 * @interface
 */
const express = require('express');
let router = express.Router();
let controller = require('./controllers');

router
  // ADMINISTRATION endpoints
  .get('/configuration', controller.getConfiguration)
  .post('/configuration', controller.reloadConfiguration)
  // .put('/configuration', controller.updateConfiguration)
  // .delete('/configuration', controller.removeConfiguration)
  .get('/registrations', controller.registrations)
  .get('/registrations/:id', controller.registrations)
  .get('/properties', controller.properties)
  .get('/properties/:id', controller.properties)
  .get('/actions', controller.actions)
  .get('/actions/:id', controller.actions)
  .get('/events', controller.events)
  .get('/events/:id', controller.events)
  // HEALTHCHECK endpoints
  .get('/healthcheck', controller.healthcheck);

  module.exports = router;
