// Application hooks that run for every service
// const logger = require('./hooks/logger');
const { discard } = require('feathers-hooks-common');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      discard('_id', '__v')
    ],
    update: [
      discard('_id', '__v')
    ],
    patch: [
      discard('_id', '__v')
    ],
    remove: []
  },

  after: {
    all: [
      // logger()
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [
      // logger()
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
