// Initializes the `emotions` service on path `/emotions`
const createService = require('feathers-mongoose');
const createModel = require('../../models/emotions.model');
const hooks = require('./emotions.hooks');
const filters = require('./emotions.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'emotions',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/emotions', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('emotions');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
