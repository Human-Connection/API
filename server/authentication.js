const authentication = require('feathers-authentication');
const jwt = require('feathers-authentication-jwt');
const local = require('feathers-authentication-local');
const { lowerCase } = require('feathers-hooks-common');

module.exports = function () {
  const app = this;
  const config = app.get('authentication');

  // Set up authentication with the secret
  app.configure(authentication(config));
  app.configure(jwt());
  app.configure(local(config.local));

  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service('authentication').hooks({
    before: {
      create: [
        lowerCase('email', 'username'),
        authentication.hooks.authenticate(config.strategies)
      ],
      remove: [
        authentication.hooks.authenticate('jwt')
      ]
    }
  });

  app.on('login', (result, meta) => {
    try {
      if (meta.connection && meta.connection.user) {
        // update last active timestamp on loggedin user
        app.service('users').patch(meta.connection.user, {
          lastActiveAt: new Date()
        });
      }
    } catch (err) {
      app.error(err);
    }
  });
};
