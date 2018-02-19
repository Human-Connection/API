const { authenticate } = require('feathers-authentication').hooks;
const { unless, isProvider } = require('feathers-hooks-common');
const isModerator = require('../../hooks/is-moderator-boolean');
const setShoutCount = require('./hooks/set-shout-count');
const {
  associateCurrentUser,
  restrictToOwner
} = require('feathers-authentication-hooks');
const { isVerified } = require('feathers-authentication-management').hooks;

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      authenticate('jwt'),
      unless(isProvider('server'),
        isVerified(),
        associateCurrentUser()
      )
    ],
    update: [
      authenticate('jwt'),
      unless(isModerator(),
        restrictToOwner()
      )
    ],
    patch: [
      authenticate('jwt'),
      unless(isModerator(),
        restrictToOwner()
      )
    ],
    remove: [
      authenticate('jwt'),
      unless(isModerator(),
        restrictToOwner()
      )
    ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      setShoutCount()
    ],
    update: [
      setShoutCount()
    ],
    patch: [
      setShoutCount()
    ],
    remove: [
      setShoutCount()
    ]
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
