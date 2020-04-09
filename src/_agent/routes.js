/**
 * routes.js
 * Agent router interface
 * Endpoint 'agent'
 * Gateway calls endpoint agent to send data collected from the network to the agent
 * @interface
 */
const express = require('express');
let router = express.Router();
let controller = require('./controller');

router
    // ***** Agent endpoints *****
  .get('/login/:oid', controller.login)
  .get('/logout/:oid', controller.logout)
  .get('/registration', controller.getRegistrations)
  .post('/registration', controller.postRegistrations)
  .post('/registration/remove', controller.removeRegistrations)
  .get('/discovery/:oid', controller.discovery)
    // ***** Gateway callback *****
  .get('/objects/:oid/properties/:pid', controller.consumption) // get property requested to gtw
//   .put('/objects/:oid/properties/:pid') // set property requested to gtw
//   .post('/objects/:oid/actions/:aid') // start action
//   .delete('/objects/:oid/actions/:aid') // stop action
  .put('/objects/:oid/events/:eid', controller.consumption); // get event from channel where you are subscribed

  module.exports = router;
