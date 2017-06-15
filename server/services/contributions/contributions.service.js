// Initializes the `contributions` service on path `/contributions`
const createService = require('feathers-rethinkdb');
const hooks = require('./contributions.hooks');
const filters = require('./contributions.filters');

// ToDo: Schema und Validierung
// https://github.com/BenZed/feathers-schema

module.exports = function () {
  const app = this;
  const Model = app.get('rethinkdbClient');
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
