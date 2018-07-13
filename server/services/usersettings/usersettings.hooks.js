const { iff, isProvider } = require('feathers-hooks-common');
const { restrictToOwner } = require('feathers-authentication-hooks');
const mapCreateToUpsert = require('../../hooks/map-create-to-upsert');
const auth = require('@feathersjs/authentication');

module.exports = {
  before: {
    all: [
      iff(isProvider('rest'), auth.hooks.authenticate('jwt'))
    ],
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
