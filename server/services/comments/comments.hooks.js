const { authenticate } = require('feathers-authentication').hooks;
const { populate } = require('feathers-hooks-common');
const {
  //queryWithCurrentUser,
  associateCurrentUser,
  restrictToOwner
} = require('feathers-authentication-hooks');
const createExcerpt = require('../../hooks/create-excerpt');
const associateContribution = require('../../hooks/associate-contribution');

const userSchema = {
  include: {
    service: 'users',
    nameAs: 'user',
    parentField: 'userId',
    childField: '_id'
  }
}

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      authenticate('jwt'),
      associateCurrentUser(),
      associateContribution(),
      createExcerpt()
    ],
    update: [
      authenticate('jwt'),
      restrictToOwner(),
      createExcerpt()
    ],
    patch: [
      authenticate('jwt'),
      restrictToOwner(),
      createExcerpt()
    ],
    remove: [
      authenticate('jwt'),
      restrictToOwner()
    ]
  },

  after: {
    all: [
      populate({ schema: userSchema })
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
