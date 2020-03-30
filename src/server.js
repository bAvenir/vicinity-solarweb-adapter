/*
SERVER configuration module
- Middlewares
- API
- Handling errors
*/

// Global settings and packages
const express = require('express'),
  server = express(),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  cookieParser = require('cookie-parser'),
//   rateLimit = require('express-rate-limit'), // Consider adding or use NGINX
  helmet = require('helmet');

// Configure express to work with proxy and rate-limit
// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

// Load loggers
const morgan = require('morgan'),
logger = require('./_utils/logger');

// Load configuration
const config = require('./_configuration/configuration');

// Load API
var api = require('./_api/routes');

// Middlewares
server.use(cors())
        .use(bodyParser.urlencoded({ extended: true, limit: config.maxPayload}))
        .use(bodyParser.json({limit: config.maxPayload}))
        .use(cookieParser())
        .use(helmet())
        .use(morgan(':status - :date[iso] - :method - :url - :response-time - :remote-addr', { "stream": logger.stream}));

// API 
// If status code > 400, forwards to next middleware for handling
// @TODO set up IP rate-limiter for necessary endpoints (NGINX alternative)
server.use('/api', api);

// error handler 
// @TODO Build in separate module

// Not found request response
server.use(function(req, res) {
    logger.warn('URL not found ' + req.originalUrl, "SERVER");
    res.status(404).send({error: true, 'url': req.originalUrl + ' not found'});
});

// Export my server
module.exports = server;