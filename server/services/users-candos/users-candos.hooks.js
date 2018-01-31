const { authenticate } = require('feathers-authentication').hooks;
const { unless, isProvider } = require('feathers-hooks-common');
const isModerator = require('../../hooks/is-moderator-boolean');
const {
  associateCurrentUser,
  restrictToOwner
} = require('feathers-authentication-hooks');
const { isVerified } = require('feathers-authentication-management').hooks;
const setDoneDate = require('./hooks/set-done-date');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      unless(isProvider('server'),
        authenticate('jwt'),
        isVerified(),
        associateCurrentUser()
      ),
      setDoneDate()
    ],
    update: [
      authenticate('jwt'),
      unless(isModerator(),
        restrictToOwner()
      ),
      setDoneDate()
    ],
    patch: [
      authenticate('jwt'),
      unless(isModerator(),
        restrictToOwner()
      ),
      setDoneDate()
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
