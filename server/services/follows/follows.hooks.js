const { authenticate } = require('feathers-authentication').hooks;
const { unless, isProvider, populate } = require('feathers-hooks-common');
const mapCreateToUpsert = require('../../hooks/map-create-to-upsert');
const isModerator = require('../../hooks/is-moderator-boolean');
const setFollowCount = require('./hooks/set-follow-count');
const {
  associateCurrentUser,
  restrictToOwner
} = require('feathers-authentication-hooks');
const { isVerified } = require('feathers-authentication-management').hooks;

const userSchema = {
  include: {
    service: 'users',
    nameAs: 'user',
    parentField: 'foreignId',
    childField: '_id',
    query: {
      $select: ['_id', 'name', 'slug', 'avatar', 'createdAt']
    }
  }
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      authenticate('jwt'),
      unless(isProvider('server'),
        isVerified(),
        associateCurrentUser()
      ),
      mapCreateToUpsert(context => {
        const { data } = context;
        return { userId: data.userId, foreignId: data.foreignId, foreignService: data.foreignService };
      })
    ],
    update: [
      authenticate('jwt'),
      unless(isModerator(),
        restrictToOwner()
      )
    ],
    patch: [
      authenticate('jwt'),
      unless(isModerator(),
        restrictToOwner()
      )
    ],
    remove: [
      authenticate('jwt'),
      unless(isModerator(),
        restrictToOwner()
      )
    ]
  },

  after: {
    all: [],
    find: [
      populate({ schema: userSchema })
    ],
    get: [],
    create: [
      setFollowCount()
    ],
    update: [
      setFollowCount()
    ],
    patch: [
      setFollowCount()
    ],
    remove: [
      setFollowCount()
    ]
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
