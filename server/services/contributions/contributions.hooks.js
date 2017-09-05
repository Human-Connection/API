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
const search = require('feathers-mongodb-fuzzy-search');

const userSchema = {
  include: {
    service: 'users',
    nameAs: 'user',
    parentField: 'userId',
    childField: '_id'
  }
}

const categoriesSchema = {
  include: {
    service: 'categories',
    nameAs: 'categories',
    parentField: 'categoryIds',
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
    all: [search()],
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
      unless(isProvider('server'),
        isVerified()
      ),
      restrictToOwner(),
      createExcerpt()
    ],
    patch: [
      authenticate('jwt'),
      unless(isProvider('server'),
        isVerified()
      ),
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
      populate({ schema: categoriesSchema }),
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
