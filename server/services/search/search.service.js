// Initializes the `users` service on path `/users`
const ElasticsearchWrapper = require('./elasticsearch.wrapper');

module.exports = function () {
  const app = this;

  var searchApp = new ElasticsearchWrapper();
  searchApp.setApp(app);
  // Initialize our service with any options it requires
  app.use('/search', searchApp);

  // Get our initialized service so that we can register hooks and filters
  app.service('search');


};
