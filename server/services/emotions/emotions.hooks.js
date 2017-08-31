const { authenticate } = require('feathers-authentication').hooks;
const emotionRatingHook = require('./hooks/emotion-rating-hook');
const { isVerified } = require('feathers-authentication-management').hooks;
const hooks = require('feathers-hooks-common');

const userSchema = {
  include: {
    service: 'users',
    nameAs: 'user',
    parentField: 'userId',
    childField: '_id'
  }
};
const contributionSchema = {
  include: {
    service: 'contributions',
    nameAs: 'contribution',
    parentField: 'contributionId',
    childField: '_id'
  }
};

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
      // populate({ schema: userSchema }),
      // populate({ schema: contributionSchema })
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
