/* eslint-disable no-unused-vars */
const { GeneralError, NotFound, NotAcceptable } = require('feathers-errors');
const mongoose = require('mongoose');
const _ = require('lodash');

const populateUserWithFollows = (data, app) => {
  let output = {};
  let follows = _.groupBy(data.follows, 'type');
  return _.keys(follows).map((service) => {
    return new Promise(async (resolve) => {
      const ids = _.values(_.mapValues(follows[service], 'id'));
      output[service] = await mongoose.model(service).find({
        _id: {
          $in: ids
        }
      }, {
        password: 0,
        email: 0,
        doiToken: 0,
        isVerified: 0,
        verifyExpires: 0,
        verifyToken: 0,
        verifyShortToken: 0,
        role: 0,
        __v: 0
      });
      resolve(output);
    });
  });
};

class Service {
  constructor (options) {
    this.options = options || {};
    if (!options.app) {
      throw new Error('follows services missing option.app');
    }
    this.app = options.app;
    this.users = mongoose.model('users');
    this.organizations = mongoose.model('organizations');
    this.projects = mongoose.model('projects');
    this.allowedServices = ['users', 'organizations', 'projects'];
  }

  /* find (params) {
    return Promise.resolve([]);
  } */

  /**
   * @param id
   * @param params
   * @returns {Promise}
   *
   * @todo use the services for retreiving data to not reveal sensitive data
   */
  async get (id, params) {
    let query = params.query || {};

    let user = await this.users.findById(id);
    if (_.isEmpty(user)) {
      throw new NotFound('user with the given id could not be found');
    }
    user = user.toObject();
    return new Promise((resolve) => {
      const follows = populateUserWithFollows(user, this.app);
      return Promise.all(follows).then((data) => {
        data = data.pop();
        resolve(data);
      });
    });
  }

  /**
   * @param data
   * @param params
   * @returns Promise
   * @example
   *  {
   *    "userId": "5a042f57a40ed49f79a328fb",
   *    "followingId": "5a042f5ca40ed49f79a32900",
   *    "type": "users"
   *  }
   *
   * @todo use the services for retreiving data to not reveal sensitive data
   * @todo do not allow another users then the logged in one to create a follow entry
   */
  async create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current)));
    }
    const user = params.user || await this.users.findById(data.userId);
    if (this.allowedServices.indexOf(data.type) < 0) {
      throw new NotAcceptable('following of the given service is not allowed, ' +
        'please use on of the following services: ' + this.allowedServices.join(', '));
    }
    const followingModel = this[data.type];
    const following = await followingModel.findById(data.followingId);

    if (_.isEmpty(user) || _.isEmpty(following)) {
      throw new NotFound('user with the given id could not be found');
    }
    if (_.isEmpty(user) || _.isEmpty(following)) {
      throw new NotFound(`${data.type} with the given id could not be found`);
    }

    const userFolowEntry = {
      type: data.type,
      id: data.followingId
    };

    if (_.findIndex(user.follows, userFolowEntry) < 0) {
      // push follow entry to user if not already present
      await this.users.findOneAndUpdate({ _id: user._id }, {
        $push: {
          follows: userFolowEntry
        }
      });
    }
    if (following.followerIds.indexOf(user._id) < 0) {
      // push follow entry to followingModel if not already present
      await followingModel.findOneAndUpdate({ _id: data.followingId }, {
        $push: {
          followerIds: user._id
        }
      });
    }

    return userFolowEntry;
  }

  /* update (id, data, params) {
    return Promise.resolve(data);
  } */

  /* patch (id, data, params) {
    return Promise.resolve(data);
  } */

  /* remove (id, params) {
    return Promise.resolve({ id });
  } */
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
