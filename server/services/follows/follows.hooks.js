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
      authenticate('jwt'),
      hooks.restrictToOwner()
    ],
    patch: [
      authenticate('jwt'),
      hooks.restrictToOwner()
    ],
    remove: [
      authenticate('jwt'),
      hooks.restrictToOwner()
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
