const { unless, isProvider } = require('feathers-hooks-common');
const { isVerified } = require('feathers-authentication-management').hooks;
const { authenticate } = require('@feathersjs/authentication').hooks;
const isAdmin = require('../../hooks/is-admin');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      authenticate('jwt'),
      unless(isProvider('server'),
        isVerified(),
        isAdmin()
      )
    ],
    update: [
      authenticate('jwt'),
      unless(isProvider('server'),
        isVerified(),
        isAdmin()
      )
    ],
    patch: [
      authenticate('jwt'),
      unless(isProvider('server'),
        isVerified(),
        isAdmin()
      )
    ],
    remove: [
      authenticate('jwt'),
      isVerified(),
      isAdmin()
    ]
  },

  after: {
    all: [
    ],
    find: [
    ],
    get: [
    ],
    create: [
    ],
    update: [
    ],
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
