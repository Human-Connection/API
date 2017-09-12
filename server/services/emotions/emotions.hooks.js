const { authenticate } = require('feathers-authentication').hooks;
const emotionRatingHook = require('./hooks/emotion-rating');
const { isVerified } = require('feathers-authentication-management').hooks;
const hooks = require('feathers-hooks-common');


module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [isVerified()],
    update: [hooks.disallow()],
    patch: [hooks.disallow()],
    remove: [hooks.disallow('external')]
  },

  after: {
    all: [
     
    ],
    find: [],
    get: [],
    create: [emotionRatingHook()],
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
