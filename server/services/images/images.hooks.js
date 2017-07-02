const { authenticate } = require('feathers-authentication').hooks;
const uploadFile = require('./hooks/upload-file');
const {
  associateCurrentUser,
  restrictToOwner
} = require('feathers-authentication-hooks');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      authenticate('jwt'),
      associateCurrentUser(),
      uploadFile()
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
