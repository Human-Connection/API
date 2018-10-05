const { restrictToOwner } = require('feathers-authentication-hooks');
const mapCreateToUpsert = require('../../hooks/map-create-to-upsert');
const validateBlacklist = require('./hooks/validate-blacklist');
const { authenticate } = require('@feathersjs/authentication').hooks;

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create:  [
      authenticate('jwt'),
      validateBlacklist(),
      mapCreateToUpsert(context => {
        const { data } = context;
        return { userId: data.userId };
      })
    ],
    update: [
      authenticate('jwt'),
      validateBlacklist(),
      restrictToOwner()
    ],
    patch: [
      authenticate('jwt'),
      validateBlacklist(),
      restrictToOwner()
    ],
    remove: [
      authenticate('jwt'),
      validateBlacklist(),
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
