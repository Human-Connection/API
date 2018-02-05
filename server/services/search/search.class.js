const _ = require('lodash');

/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
    this.app = this.options.app;
  }

  find (params) {
    let singleParams = _.cloneDeep(params);
    delete singleParams.query.$ressources;
    let search = params.query.$search;
    delete singleParams.query.$search;
    return new Promise((resolve, reject) => {
      let searchPromises = params.query.$ressources.map(ressource => {
        return this.ressourceQuery(ressource, singleParams, search);
      });
      return Promise.all(searchPromises)
        .then(groups => {
          let data = groups.map(group => {
            return {
              name: group.name,
              items: group.data
            };
          });
          resolve({ data });
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  /**
   * Create a query like
   * { name: { $search: 'searchtext' }
   * for given ressource
   */
  ressourceQuery (ressource, params, search) {
    return new Promise((resolve, reject) => {
      params.query.name = { $search: search };
      this.app.service(ressource).find(params)
        .then(result => {
          result.name = ressource;
          resolve(result);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
