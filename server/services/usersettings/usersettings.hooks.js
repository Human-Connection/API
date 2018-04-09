const { restrictToOwner } = require('feathers-authentication-hooks');
const mapCreateToUpsert = require('../../hooks/map-create-to-upsert');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      mapCreateToUpsert(context => {
        const { data } = context;
        return { userId: data.userId };
      })
    ],
    update: [
      restrictToOwner()
    ],
    patch: [
      restrictToOwner()
    ],
    remove: [
      restrictToOwner()
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
