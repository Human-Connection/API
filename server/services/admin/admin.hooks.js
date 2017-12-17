const { authenticate } = require('feathers-authentication').hooks;
const { when, isProvider } = require('feathers-hooks-common');
const isAdmin = require('../../hooks/is-admin');

module.exports = {
  before: {
    all: [
      authenticate('jwt'),
      when(isProvider('external'),
        isAdmin()
      ),
    ],
    find: [],
    get: [],
    create: [],
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
