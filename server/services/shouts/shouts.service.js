// Initializes the `shouts` service on path `/shouts`
const createService = require('feathers-mongoose');
const createModel = require('../../models/shouts.model');
const hooks = require('./shouts.hooks');
const filters = require('./shouts.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'shouts',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/shouts', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('shouts');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
