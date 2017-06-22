/*
  Needs a /config/local.json configuration with
  proper SMTP settings in order to work
  see /config/local.example.json

  More information on SMTP settings:
  https://nodemailer.com/smtp/

  Could also use a custom mail transporter:
  https://github.com/feathersjs/feathers-mailer
*/

const hooks = require('./emails.hooks');
const Mailer = require('feathers-mailer');

module.exports = function () {
  const app = this;
  const smtpConfig = app.get('smtpConfig');

  // Initialize our service with any options it requires
  app.use('/emails', Mailer(smtpConfig));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('emails');

  service.hooks(hooks);
};
