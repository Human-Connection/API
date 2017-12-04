// Initializes the `users` service on path `/users`
const ElasticsearchWrapper = require('./elasticsearch.wrapper');

module.exports = function () {
  const app = this;
  
  // contribution mode
  const searchAppContribution = new ElasticsearchWrapper(app);
  const contributionService = app.service('contributions');
  searchAppContribution.setForwardingService(contributionService);
  app.use('/search_contribution', searchAppContribution);


  // another entity mode
  const searchAppContribution2 = new ElasticsearchWrapper(app);
  searchAppContribution2.setForwardingService(contributionService);
  app.use('/search_contribution2', searchAppContribution2);

};
