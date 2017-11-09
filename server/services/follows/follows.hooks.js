const hooks = require('feathers-authentication-hooks');
const { isProvider, when, discard, remove, deleteByDot } = require('feathers-hooks-common');
const { authenticate } = require('feathers-authentication').hooks;

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [
      when(isProvider('external'), [
        hooks.queryWithCurrentUser()
      ])
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
