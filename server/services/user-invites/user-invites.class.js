/* eslint-disable no-unused-vars */
const errors = require('@feathersjs/errors');
const uuid = require('uuid/v1');
const { genInviteCode } = require('../../helper/seed-helpers');

class Service {
  constructor (options) {
    this.options = options || {};
    if (!options.app) {
      throw new Error('user-invites services missing option.app');
    }
    this.app = options.app;
  }

  async find (params) {
    if (!params.user._id) {
      throw new errors.Forbidden('no user id found');
    }
    const res = await this.app.service('invites').find(Object.assign(params.query || {}, {
      query: {
        $limit: 30,
        invitedByUserId: params.user._id
      }
    }));
    return res;
  }

  async get (id, params) {
    throw new errors.NotImplemented();
  }

  async create (data, params) {
    // 1. check user
    if (!params.user._id) {
      throw new errors.Forbidden('no used id found');
    }
    // 2. get system settings for max invite count
    let settings = await this.app.service('settings').find({query: {key: 'system'}});
    settings = settings.pop();
    // do cancel of the settings prohibit it
    if (!settings || !settings.invites || !settings.invites.userCanInvite || !settings.invites.maxInvitesByUser) {
      throw new errors.Forbidden('system settings not valid');
    }
    // 3. get user invite count
    const maxInvitesByUser = settings.invites.maxInvitesByUser;
    // 4. check if the user has still free invites
    const myInvites = await this.find(Object.assign(params, {query: { $limit: -1 }}));
    let remainingInvites = maxInvitesByUser - myInvites.total;
    if (remainingInvites <= 0) {
      throw new errors.Forbidden('no invites left');
    }
    // 5. generate one remaining free invites
    let output = [];
    while (remainingInvites--) {
      const res = await this.app.service('invites').create({
        email: uuid(),
        code: genInviteCode(),
        invitedByUserId: params.user._id,
        role: 'user'
      });
      output.push(res);
    }

    return output;
  }

  async update (id, data, params) {
    throw new errors.NotImplemented();
  }

  async patch (id, data, params) {
    throw new errors.NotImplemented();
  }

  async remove (id, params) {
    throw new errors.NotImplemented();
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
