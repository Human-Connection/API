// Initializes the `contributions` service on path `/contributions`
const createService = require('feathers-mongoose');
const createModel = require('../../models/contributions.model');
const hooks = require('./contributions.hooks');
const filters = require('./contributions.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'contributions',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/contributions', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('contributions');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
