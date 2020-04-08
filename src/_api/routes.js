/**
 * routes.js
 * Express server router interface
 * @interface
 */
const express = require('express');
let router = express.Router();
let controller = require('./controller');

router
  .get('/', controller.get);

  module.exports = router;
