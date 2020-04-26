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
  // IMPORT/EXPORT endpoints
  .get('/import/registrations', controller.importFile)
  .get('/import/properties', controller.importFile)
  .get('/import/actions', controller.importFile)
  .get('/import/events', controller.importFile)
  .get('/export/registrations', controller.exportFile)
  .get('/export/properties', controller.exportFile)
  .get('/export/actions', controller.exportFile)
  .get('/export/events', controller.exportFile)
  // HEALTHCHECK endpoints
  .get('/healthcheck', controller.healthcheck);

  module.exports = router;
