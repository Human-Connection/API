// Initializes the `invites` service on path `/invites`
const createService = require('feathers-mongoose');
const createModel = require('../../models/invites.model');
const hooks = require('./invites.hooks');
const filters = require('./invites.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'invites',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/invites', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('invites');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
