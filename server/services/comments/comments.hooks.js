const { authenticate } = require('feathers-authentication').hooks;
const { unless, isProvider, populate, discard, softDelete, setNow } = require('feathers-hooks-common');
const {
  //queryWithCurrentUser,
  associateCurrentUser,
  // restrictToAuthenticated,
  restrictToOwner
} = require('feathers-authentication-hooks');
const { isVerified } = require('feathers-authentication-management').hooks;
const createExcerpt = require('../../hooks/create-excerpt');
const nullDeletedData = require('../../hooks/null-deleted-data');
const keepDeletedDataFields = require('../../hooks/keep-deleted-data-fields');
const createNotifications = require('./hooks/create-notifications');
const createMentionNotifications = require('./hooks/create-mention-notifications');
const _ = require('lodash');
const xss = require('../../hooks/xss');

const userSchema = {
  include: {
    service: 'users',
    nameAs: 'user',
    parentField: 'userId',
    childField: '_id'
  }
};

const xssFields = ['content', 'contentExcerpt'];

//ToDo: Only let users create comments for contributions they are allowed to
module.exports = {
  before: {
    all: [
      xss({ fields: xssFields })
    ],
    find: [],
    get: [
      softDelete()
    ],
    create: [
      authenticate('jwt'),
      // Allow seeder to seed comments
      unless(isProvider('server'),
        isVerified()
      ),
      associateCurrentUser(),
      createExcerpt({ length: 180 }),
      softDelete()
    ],
    update: [
      authenticate('jwt'),
      isVerified(),
      unless(isProvider('server'),
        restrictToOwner()
      ),
      createExcerpt({ length: 180 }),
      softDelete(),
      setNow('updatedAt')
    ],
    patch: [
      authenticate('jwt'),
      isVerified(),
      unless(isProvider('server'),
        unless((hook) => {
          // TODO: change that to a more sane method by going through the server with an constum service
          // only allow upvoteCount increment for non owners
          // the data has to be the exact copy of the valid object
          const valid = {$inc: {upvoteCount: 1}};
          return (!_.difference(_.keys(valid), _.keys(hook.data)).length) &&
                (!_.difference(_.keys(valid.$inc), _.keys(hook.data.$inc)).length) &&
                (!_.difference(_.values(valid.$inc), _.values(hook.data.$inc)).length);
        }, restrictToOwner())
      ),
      createExcerpt({ length: 180 }),
      softDelete(),
      setNow('updatedAt'),
      // SoftDelete uses patch to delete items
      // Make changes to deleted items here
      nullDeletedData({ fields: [ 'content', 'contentExcerpt' ]})
    ],
    remove: [
      authenticate('jwt'),
      isVerified(),
      unless(isProvider('server'),
        restrictToOwner()
      ),
      softDelete()
    ]
  },

  after: {
    all: [
      populate({ schema: userSchema }),
      xss({ fields: xssFields }),
      keepDeletedDataFields()
    ],
    find: [
      discard('content', 'user.coverImg', 'badgeIds')
    ],
    get: [],
    create: [
      createMentionNotifications(),
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
