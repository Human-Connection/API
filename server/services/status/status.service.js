// Initializes the `status` service on path `/status`
const createService = require('./status.class.js');
const createModel = require('../../models/status.model');
const hooks = require('./status.hooks');
const filters = require('./status.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    app,
    name: 'status',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/status', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('status');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
