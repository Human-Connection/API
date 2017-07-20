// Initializes the `images` service on path `/images`
const createService = require('feathers-mongoose');
const createModel = require('../../models/images.model');
const hooks = require('./images.hooks');
const filters = require('./images.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'images',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/images', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('images');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
