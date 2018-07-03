// Initializes the `search` service on path `/search`
const createService = require('./search.class.js');
const hooks = require('./search.hooks');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'search',
    paginate,
    app
  };

  // Initialize our service with any options it requires
  app.use('/search', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('search');

  service.hooks(hooks);
};
