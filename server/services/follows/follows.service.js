// Initializes the `follows` service on path `/follows`
const createService = require('./follows.class.js');
const hooks = require('./follows.hooks');
const filters = require('./follows.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    app,
    name: 'follows',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/follows', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('follows');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
