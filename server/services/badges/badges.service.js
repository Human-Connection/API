// Initializes the `badges` service on path `/badges`
const createService = require('feathers-mongoose');
const createModel = require('../../models/badges.model');
const hooks = require('./badges.hooks');
const filters = require('./badges.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');
  const options = {
    name: 'badges',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/badges', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('badges');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
