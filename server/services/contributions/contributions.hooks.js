const { authenticate } = require('feathers-authentication').hooks;
const { unless, isProvider, populate } = require('feathers-hooks-common');
const {
  //queryWithCurrentUser,
  associateCurrentUser,
  restrictToOwner
} = require('feathers-authentication-hooks');
const { isVerified } = require('feathers-authentication-management').hooks;
const createSlug = require('../../hooks/create-slug');
const createExcerpt = require('../../hooks/create-excerpt');

const userSchema = {
  include: {
    service: 'users',
    nameAs: 'user',
    parentField: 'userId',
    childField: '_id'
  }
}

const commentsSchema = {
  include: {
    service: 'comments',
    nameAs: 'comments',
    parentField: '_id',
    childField: 'contributionId',
    include: {
      service: 'users',
      nameAs: 'user',
      parentField: 'userId',
      childField: '_id'
    }
  }
}

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      authenticate('jwt'),
      // Allow seeder to seed contributions
      unless(isProvider('server'),
        isVerified()
      ),
      associateCurrentUser(),
      createSlug({ field: 'title' }),
      createExcerpt()
    ],
    update: [
      authenticate('jwt'),
      isVerified(),
      restrictToOwner(),
      createExcerpt()
    ],
    patch: [
      authenticate('jwt'),
      isVerified(),
      restrictToOwner(),
      createExcerpt()
    ],
    remove: [
      authenticate('jwt'),
      isVerified(),
      restrictToOwner()
    ]
  },

  after: {
    all: [
      populate({ schema: userSchema }),
      populate({ schema: commentsSchema })
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
