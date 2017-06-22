const { authenticate } = require('feathers-authentication').hooks;
const { disallow, populate } = require('feathers-hooks-common');
const {
  restrictToOwner
} = require('feathers-authentication-hooks');
const restrict = [
  authenticate('jwt'),
  restrictToOwner()
];

const commentSchema = {
  include: {
    service: 'comments',
    nameAs: 'comment',
    parentField: 'relatedCommentId',
    childField: '_id'
  }
}

const contributionSchema = {
  include: {
    service: 'contributions',
    nameAs: 'contribution',
    parentField: 'relatedContributionId',
    childField: '_id'
  }
}

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [ ...restrict ],
    get: [ ...restrict ],
    create: [ disallow('external') ],
    update: [ ...restrict ],
    patch: [ ...restrict ],
    remove: [ ...restrict ]
  },

  after: {
    all: [
      populate({ schema: contributionSchema }),
      populate({ schema: commentSchema })
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
