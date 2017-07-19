const isAdmin = require('../../hooks/is-admin');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      isAdmin()
    ],
    update: [
      isAdmin()
    ],
    patch: [
      isAdmin()
    ],
    remove: [
      isAdmin()
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
