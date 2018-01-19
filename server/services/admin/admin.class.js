/* eslint-disable no-unused-vars */

const { asyncForEach } = require('../../helper/seed-helpers');
const { keyBy } = require('lodash');

class Service {
  constructor (options) {
    this.options = options || {};
    if (!options.app) {
      throw new Error('admin services missing option.app');
    }
    this.app = options.app;
    this.seederstore = {};
  }
  
  async _fillSeederStore(services = []) {
    console.debug('###Filling seeder store...');
    await asyncForEach(services, async (service) => {
      const res = await this.app.service(service).find({ query: { $limit: 100 }});
      this.seederstore[service] = keyBy(res.data, '_id');
    });
  }

  find (params) {
    return Promise.resolve([]);
  }

  get (id, params) {
    return Promise.resolve({
      id, text: `A new message with ID: ${id}!`
    });
  }

  create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current)));
    }
    
    return new Promise(async (resolve, reject) => {

      try {
        await this._fillSeederStore(['users', 'categories']);
      } catch (err) {
        reject(err);
      }

      if (data.seedFakeData) {
        // run the seeder
        console.log('seedFakeData...');
        require('../../seeder')(this.app, this.seederstore);
        try {
          await this.app.seed(require('../../seeder/development')());
          resolve();
        } catch (err) {
          reject(err);
        }
      }
      if (data.seedDemoData) {
        // run the seeder
        console.log('seedDemoData...');
        require('../../seeder')(this.app, this.seederstore);
        try {
          await this.app.seed(require('../../seeder/demo')());
          resolve();
        } catch (err) {
          reject(err);
        }
      }
    });
  }

  update (id, data, params) {
    return Promise.resolve(data);
  }

  patch (id, data, params) {
    return Promise.resolve(data);
  }

  remove (id, params) {
    return Promise.resolve({ id });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
