const { associateCurrentUser } = require('feathers-authentication-hooks');
const { isProvider, when, discard, remove, deleteByDot } = require('feathers-hooks-common');
const { authenticate } = require('feathers-authentication').hooks;

module.exports = {
  before: {
    all: [],
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
