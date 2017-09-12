// Initializes the `users` service on path `/users`
const createService = require('feathers-mongoose');
const createModel = require('../../models/users.model');
const SearchService = require('./SearchService');

module.exports = function () {
    const app = this;

    var searchApp = new SearchService();
    searchApp.setApp(app);
    // Initialize our service with any options it requires
    app.use('/search', searchApp);

    // Get our initialized service so that we can register hooks and filters
    const service = app.service('search');


};
