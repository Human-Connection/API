const { authenticate } = require('@feathersjs/authentication').hooks;
const { iff, unless, isProvider, populate, discard, softDelete, setNow } = require('feathers-hooks-common');
const { protect } = require('@feathersjs/authentication-local').hooks;
const {
  //queryWithCurrentUser,
  associateCurrentUser,
  // restrictToAuthenticated,
  restrictToOwner
} = require('feathers-authentication-hooks');
const { isVerified } = require('feathers-authentication-management').hooks;
const createExcerpt = require('../../hooks/create-excerpt');
const patchDeletedData = require('../../hooks/patch-deleted-data');
const concealBlacklistedData = require('../../hooks/conceal-blacklisted-data');
const keepDeletedDataFields = require('../../hooks/keep-deleted-data-fields');
const createNotifications = require('./hooks/create-notifications');
const createMentionNotifications = require('./hooks/create-mention-notifications');
const isModerator = require('../../hooks/is-moderator-boolean');
const _ = require('lodash');
const xss = require('../../hooks/xss');

const userSchema = {
  include: {
    service: 'users',
    nameAs: 'user',
    parentField: 'userId',
    childField: '_id',
    query: {
      $limit: 1,
      $select: ['_id', 'name', 'slug', 'avatar', 'lastActiveAt', 'termsAndConditionsAccepted', 'thumbnails']
    }
  }
};

const xssFields = ['content', 'contentExcerpt'];

//ToDo: Only let users create comments for contributions they are allowed to
module.exports = {
  before: {
    all: [
      softDelete(),
      xss({ fields: xssFields })
    ],
    find: [
      // We want to deleted comments to show up
      iff(
        hook => hook.params.headers && hook.params.headers.authorization,
        authenticate('jwt')
      ),
      hook => {
        delete hook.params.query.deleted;
        return hook;
      }
    ],
    get: [
      iff(
        hook => hook.params.headers && hook.params.headers.authorization,
        authenticate('jwt')
      )
    ],
    create: [
      authenticate('jwt'),
      // Allow seeder to seed comments
      unless(isProvider('server'),
        isVerified()
      ),
      associateCurrentUser(),
      createExcerpt({ length: 180 })
    ],
    update: [
      authenticate('jwt'),
      unless(isProvider('server'),
        isVerified(),
        restrictToOwner()
      ),
      createExcerpt({ length: 180 }),
      setNow('updatedAt')
    ],
    patch: [
      authenticate('jwt'),
      unless(isProvider('server'),
        isVerified(),
        unless((hook) => {
          // TODO: change that to a more sane method by going through the server with an custom service
          // only allow upvoteCount increment for non owners
          // the data has to be the exact copy of the valid object
          const valid = {$inc: {upvoteCount: 1}};
          return (!_.difference(_.keys(valid), _.keys(hook.data)).length) &&
                (!_.difference(_.keys(valid.$inc), _.keys(hook.data.$inc)).length) &&
                (!_.difference(_.values(valid.$inc), _.values(hook.data.$inc)).length);
        }, restrictToOwner())
      ),
      createExcerpt({ length: 180 }),
      setNow('updatedAt'),
      // SoftDelete uses patch to delete items
      // Make changes to deleted items here
      patchDeletedData({
        data: {
          content: 'DELETED',
          contentExcerpt: 'DELETED'
        }
      })
    ],
    remove: [
      authenticate('jwt'),
      unless(isProvider('server'),
        unless(isModerator(),
          isVerified(),
          restrictToOwner()
        )
      )
    ]
  },

  after: {
    all: [
      xss({ fields: xssFields }),
      keepDeletedDataFields(),
      discard('wasSeeded')
    ],
    find: [
      populate({ schema: userSchema }),
      protect('content', 'badgeIds'),
      concealBlacklistedData({
        data: {
          content: 'Comments of this blacklisted user are not visible.',
          contentExcerpt: 'Comments of this blacklisted user are not visible.',
          isBlacklisted: true,
          hasMore: false
        }
      })
    ],
    get: [
      populate({ schema: userSchema }),
      concealBlacklistedData({
        data: {
          content: 'Comments of this blacklisted user are not visible.',
          contentExcerpt: 'Comments of this blacklisted user are not visible.',
          isBlacklisted: true,
          hasMore: false
        }
      })
    ],
    create: [
      populate({ schema: userSchema }),
      createMentionNotifications(),
      createNotifications()
    ],
    update: [
      // createMentionNotifications()
    ],
    patch: [
      // createMentionNotifications()
    ],
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
