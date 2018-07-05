// Initializes the `user-invites` service on path `/user-invites`
const createService = require('./user-invites.class.js');
const hooks = require('./user-invites.hooks');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    paginate,
    app
  };

  // Initialize our service with any options it requires
  app.use('/user-invites', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('user-invites');

  service.hooks(hooks);
};
