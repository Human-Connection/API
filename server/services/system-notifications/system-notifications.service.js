// Initializes the `system-notifications` service on path `/system-notifications`
const createService = require('feathers-mongoose');
const createModel = require('../../models/system-notifications.model');
const hooks = require('./system-notifications.hooks');
const filters = require('./system-notifications.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'system-notifications',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/system-notifications', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('system-notifications');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
