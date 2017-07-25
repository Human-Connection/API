const isAdmin = require('../../hooks/is-admin');
const { when, isProvider } = require('feathers-hooks-common');
const createSlug = require('../../hooks/create-slug');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      // We don't need admin rights
      // for server generated categories
      when(isProvider('external'),
        isAdmin()
      ),
      createSlug({ field: 'title' })
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
