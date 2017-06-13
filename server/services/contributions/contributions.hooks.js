const { authenticate } = require('feathers-authentication').hooks;
const { populate } = require('feathers-hooks-common');
const {
  //queryWithCurrentUser,
  associateCurrentUser,
  restrictToOwner
} = require('feathers-authentication-hooks');

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
