// Initializes the `users-candos` service on path `/users-candos`
const createService = require('feathers-mongoose');
const createModel = require('../../models/users-candos.model');
const hooks = require('./users-candos.hooks');
const filters = require('./users-candos.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'users-candos',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/users-candos', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('users-candos');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
