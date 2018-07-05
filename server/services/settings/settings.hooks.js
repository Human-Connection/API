const isAdmin = require('../../hooks/is-admin');
const mapCreateToUpsert = require('../../hooks/map-create-to-upsert');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      isAdmin(),
      mapCreateToUpsert(context => {
        const { data } = context;
        return { key: data.key || 'system' };
      })
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
