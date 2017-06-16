const { authenticate } = require('feathers-authentication').hooks;
const { populate } = require('feathers-hooks-common');
const {
  //queryWithCurrentUser,
  associateCurrentUser,
  restrictToOwner
} = require('feathers-authentication-hooks');
const createSlug = require('./hooks/create-slug');
const createExcerpt = require('./hooks/create-excerpt');

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
      createSlug(),
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
