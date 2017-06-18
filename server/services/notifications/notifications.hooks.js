const { authenticate } = require('feathers-authentication').hooks;
const { populate } = require('feathers-hooks-common');
const {
  associateCurrentUser,
  restrictToOwner
} = require('feathers-authentication-hooks');
const restrict = [
  authenticate('jwt'),
  restrictToOwner()
];

const userSchema = {
  include: {
    service: 'users',
    nameAs: 'user',
    parentField: 'relatedUserId',
    childField: '_id'
  }
}

const commentSchema = {
  include: {
    service: 'comments',
    nameAs: 'comments',
    parentField: 'relatedCommentId',
    childField: '_id'
  }
}

const contributionSchema = {
  include: {
    service: 'contributions',
    nameAs: 'contributions',
    parentField: 'relatedContributionId',
    childField: '_id'
  }
}

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [ ...restrict ],
    get: [ ...restrict ],
    create: [],
    update: [ ...restrict ],
    patch: [ ...restrict ],
    remove: [ ...restrict ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [
      populate({ schema: userSchema }),
      populate({ schema: contributionSchema }),
      populate({ schema: commentSchema })
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
