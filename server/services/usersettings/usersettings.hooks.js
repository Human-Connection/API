const { associateCurrentUser, restrictToOwner } = require('feathers-authentication-hooks');
const {authenticate} = require('@feathersjs/authentication').hooks;

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create:  [
      authenticate('jwt'),
      associateCurrentUser()
    ],
    update: [
      authenticate('jwt'),
      restrictToOwner()
    ],
    patch: [
      authenticate('jwt'),
      restrictToOwner()
    ],
    remove: [
      authenticate('jwt'),
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
