const { authenticate } = require('feathers-authentication').hooks;
const { populate } = require('feathers-hooks-common');
const {
  //queryWithCurrentUser,
  associateCurrentUser,
  restrictToOwner
} = require('feathers-authentication-hooks');
const createExcerpt = require('../../hooks/create-excerpt');
const createNotifications = require('./hooks/create-notifications');

const userSchema = {
  include: {
    service: 'users',
    nameAs: 'user',
    parentField: 'userId',
    childField: '_id'
  }
}

//ToDo: Only let users create comments for contributions they are allowed to
module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      authenticate('jwt'),
      associateCurrentUser(),
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
    create: [
      createNotifications()
    ],
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
