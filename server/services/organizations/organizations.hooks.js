const { authenticate } = require('feathers-authentication').hooks;
const createSlug = require('../../hooks/create-slug');
const saveRemoteImages = require('../../hooks/save-remote-images');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      authenticate('jwt'),
      createSlug({ field: 'name' }),
      saveRemoteImages(['logo'])
    ],
    update: [
      authenticate('jwt'),
      createSlug({ field: 'name' }),
      saveRemoteImages(['logo'])
    ],
    patch: [
      authenticate('jwt'),
      createSlug({ field: 'name' }),
      saveRemoteImages(['logo'])
    ],
    remove: [ authenticate('jwt') ]
  },

  after: {
    all: [
      // populate({ schema: userSchema }),
      // populate({ schema: followerSchema })
    ],
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
