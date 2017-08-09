// Initializes the `ngos` service on path `/ngos`
const createService = require('feathers-mongoose');
const createModel = require('../../models/ngos.model');
const hooks = require('./ngos.hooks');
const filters = require('./ngos.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'ngos',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/ngos', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('ngos');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
