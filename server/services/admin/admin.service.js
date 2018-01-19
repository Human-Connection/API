// Initializes the `admin` service on path `/admin`
const createService = require('./admin.class.js');
const hooks = require('./admin.hooks');
const filters = require('./admin.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    app,
    name: 'admin',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/admin', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('admin');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
