const hooks = require('feathers-authentication-hooks');
const { isProvider, when } = require('feathers-hooks-common');
const { authenticate } = require('feathers-authentication').hooks;

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      authenticate('jwt'),
      when(isProvider('external'), [
        hooks.queryWithCurrentUser()
      ])
    ],
    update: [
      authenticate('jwt')
    ],
    patch: [
      authenticate('jwt')
    ],
    remove: [
      authenticate('jwt')
    ]
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
