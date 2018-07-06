const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
// const helmet = require('helmet');
const bodyParser = require('body-parser');

const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const configuration = require('@feathersjs/configuration');
const rest = require('@feathersjs/express/rest');
const socketio = require('@feathersjs/socketio');
const seeder = require('./seeder');
const channels = require('./channels');

const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const authentication = require('./authentication');
const mongoose = require('./mongoose');
const Raven = require('raven');
const logger = require('./logger');
const { profiler }  = require('feathers-profiler');

const app = express(feathers());

app.configure(require('feathers-logger')(logger));

// Load app configuration
app.configure(configuration(path.join(__dirname, '..')));

if (app.get('sentry') && app.get('sentry').dns !== undefined && app.get('sentry').dns !== 'SENTRY_DNS') {
  // LOGGING IS ENABLED
  app.info('SENTRY LOGGING IS ENABLED');

  // Must configure Raven before doing anything else with it
  Raven.config(app.get('sentry').dns, app.get('sentry').options).install();

  // The request handler must be the first middleware on the app
  app.use(Raven.requestHandler());
  // The error handler must be before any other error middleware
  app.use(Raven.errorHandler());
}

// Enable CORS, security, compression, favicon and body parsing
app.use(cors());
// app.use(helmet());
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
app.use('/', express.static(app.get('public')));

app.configure(mongoose);
app.configure(rest());

app.configure(socketio());

// Configure Database Seeder
app.configure(seeder());

app.configure(authentication);

// Set up our services (see `services/index.js`)
app.configure(services);
app.configure(channels);

if (process.env.NODE_ENV !== 'production') {
  app.configure(profiler({
    stats: 'detail',
    logger: { log: payload => app.debug(payload.slice(9)) }
  })); // must be configured after all services
}

// Configure middleware (see `middleware/index.js`) - always has to be last
app.configure(middleware);
app.hooks(appHooks);

module.exports = app;
