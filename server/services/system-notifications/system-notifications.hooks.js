const { unless, isProvider } = require('feathers-hooks-common');
const { isVerified } = require('feathers-authentication-management').hooks;
const { authenticate } = require('feathers-authentication').hooks;
const isModerator = require('../../hooks/is-moderator-boolean');

module.exports = {
  before: {
    all: [],
    find: [
      unless(isModerator())
    ],
    get: [
      unless(isModerator())
    ],
    create: [
      authenticate('jwt'),
      // Allow seeder to seed contributions
      unless(isProvider('server'),
        isVerified()
      ),
    ],
    update: [
      authenticate('jwt'),
      unless(isProvider('server'),
        isVerified()
      ),
      unless(isModerator())
    ],
    patch: [
      authenticate('jwt'),
      unless(isProvider('server'),
        isVerified()
      ),
      unless(isModerator())
    ],
    remove: [
      authenticate('jwt'),
      isVerified(),
      unless(isModerator())
    ]
  },

  after: {
    all: [
    ],
    find: [
    ],
    get: [
    ],
    create: [
    ],
    update: [
    ],
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
