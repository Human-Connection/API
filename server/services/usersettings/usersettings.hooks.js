const { restrictToOwner } = require('feathers-authentication-hooks');
const mapCreateToUpsert = require('../../hooks/map-create-to-upsert');
const auth = require('@feathersjs/authentication');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create:  [
      auth.hooks.authenticate('jwt'),
      mapCreateToUpsert(context => {
        const { data } = context;
        return { userId: data.userId };
      })
    ],
    update: [
      auth.hooks.authenticate('jwt'),
      restrictToOwner()
    ],
    patch: [
      auth.hooks.authenticate('jwt'),
      restrictToOwner()
    ],
    remove: [
      auth.hooks.authenticate('jwt'),
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
