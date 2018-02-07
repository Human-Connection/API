/* eslint-disable no-unused-vars */

const { keyBy, isEmpty } = require('lodash');
const mongoose = require('mongoose');
const errors = require('feathers-errors');

class Service {
  constructor (options) {
    this.options = options || {};
    if (!options.app) {
      throw new Error('status services missing option.app');
    }
    this.app = options.app;
    this.seederstore = {};
    this.status = mongoose.model('status');
  }

  async find (params) {
    const res = await this.status.findOne();
    if (!res) {
      return { maintenance: false };
    }

    let output = Object.assign({ maintenance: false }, res._doc);
    try {
      delete output['_id'];
      delete output['__v'];
    } catch (err) {
      return output;
    }
    return output;
  }

  get (id, params) {
    throw new errors.NotImplemented();
  }

  create (data, params) {
    throw new errors.NotImplemented();
  }

  async update (id, data, params) {
    const secret = !isEmpty(params.headers) ? params.headers.secret || null : params.secret || null;

    if (secret !== this.app.get('apiSecret')) {
      throw new errors.Forbidden('please provide the correct secret');
    }

    const res = await this.status.update({}, {
      $set: Object.assign({ updatedAt: Date.now() }, data)
    }, {
      upsert: true
    });
    return this.find();
  }

  patch (id, data, params) {
    throw new errors.NotImplemented();
  }

  remove (id, params) {
    throw new errors.NotImplemented();
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
