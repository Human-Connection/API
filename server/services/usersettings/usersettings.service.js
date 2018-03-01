// Initializes the `users` service on path `/users`
const createService = require('feathers-mongoose');
const createModel = require('../../models/usersettings.model');
const hooks = require('./usersettings.hooks');
const filters = require('./usersettings.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'usersettings',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/usersettings', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('usersettings');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
