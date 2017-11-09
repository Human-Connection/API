/* eslint-disable no-unused-vars */
const { GeneralError, NotFound } = require('feathers-errors');
const mongoose = require('mongoose');

const populateUserWithFollows = (data, service) => {
  return data.follows.map((item) => {
    let model = service[item.type] || {}
    if (model.findById) {
      return new Promise((resolve) => {
        model.findById(item.id).then((follower) => {
          if (Array.isArray(data[item.type])) {
            data[item.type].push(follower);
          } else {
            data[item.type] = [follower];
          }
          resolve();
        });
      });
    } else {
      return Promise.reject(`item has no or invalid type ${item.type}`);
    }
  });
};

class Service {
  constructor (options) {
    this.options = options || {};
    if (!options.app) {
      throw new Error('follows services missing option.app');
    }
    this.users = mongoose.model('users');
    this.ngos = mongoose.model('ngos');
    this.projects = mongoose.model('projects');
  }

  find (params) {
    return Promise.resolve([]);
  }

  get (id, params) {
    let query = params.query || {};

    return new Promise((resolve) => {
      this.users.findById(id).then((data) => {
        if (!data || data.follows.length === 0) {
          throw new NotFound();
        }
        //return resolve(data);
        data = data.toObject();
        let follows = populateUserWithFollows(data, this);
        return Promise.all(follows).then(() => {
          resolve(data);
        });
      }).catch((e) => {
        throw new GeneralError(e);
      });
    });
  }

  create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current)));
    }

    return Promise.resolve(data);
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
