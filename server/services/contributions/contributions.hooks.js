const {authenticate} = require('@feathersjs/authentication').hooks;
const {iff, discard, when, unless, isProvider, populate, softDelete, setNow} = require('feathers-hooks-common');
const {
  //queryWithCurrentUser,
  associateCurrentUser,
  restrictToOwner
} = require('feathers-authentication-hooks');
const {isVerified} = require('feathers-authentication-management').hooks;
const createSlug = require('../../hooks/create-slug');
const saveRemoteImages = require('../../hooks/save-remote-images');
const createExcerpt = require('../../hooks/create-excerpt');
const patchDeletedData = require('../../hooks/patch-deleted-data');
const includeAll = require('../../hooks/include-all');
const cleanupRelatedItems = require('../../hooks/cleanup-related-items');
const keepDeletedDataFields = require('../../hooks/keep-deleted-data-fields');
const search = require('feathers-mongodb-fuzzy-search');
const thumbnails = require('../../hooks/thumbnails');
const isModerator = require('../../hooks/is-moderator-boolean');
const excludeDisabled = require('../../hooks/exclude-disabled');
const excludeBlacklisted = require('../../hooks/exclude-blacklisted');
const getAssociatedCanDos = require('./hooks/get-associated-can-dos');
const createMentionNotifications = require('./hooks/create-mention-notifications');
const notifyFollowers = require('./hooks/notify-followers');
const canEditOrganization = require('../organizations/hooks/can-edit-organization');
const isSingleItem = require('../../hooks/is-single-item');
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

const organizationSchema = {
  include: {
    service: 'organizations',
    nameAs: 'organization',
    parentField: 'organizationId',
    childField: '_id',
    query: {
      $select: ['_id', 'userId', 'name', 'slug', 'logo']
    }
  }
};

const categoriesSchema = {
  include: {
    service: 'categories',
    nameAs: 'categories',
    parentField: 'categoryIds',
    childField: '_id',
    asArray: true
  }
};

const candosSchema = {
  include: {
    service: 'users-candos',
    nameAs: 'candoUsers',
    parentField: '_id',
    childField: 'contributionId',
    query: {
      $select: ['_id', 'userId', 'done']
    },
    asArray: true
  }
};

const commentsSchema = {
  include: {
    service: 'comments',
    nameAs: 'comments',
    parentField: '_id',
    childField: 'contributionId',
    query: {
      $select: ['_id', 'contributionId']
    },
    asArray: true
  }
};

const thumbs = {
  teaserImg: {
    cardS: '300x0/filters:background_color(fff):upscale()',
    cardM: '400x0/filters:background_color(fff):upscale()',
    cardL: '740x0/filters:background_color(fff):upscale()',
    placeholder: '100x0/filters:blur(30):background_color(fff)',
    zoom: '0x1024/filters:background_color(fff)',
    cover: '729x300/smart/filters:background_color(fff):upscale()',
    coverPlaceholder: '243x100/smart/filters:blur(30):background_color(fff)'
  }
};

const xssFields = ['content', 'contentExcerpt', 'cando.reason'];

module.exports = {
  before: {
    all: [
      softDelete(),
      xss({fields: xssFields})
    ],
    find: [
      unless(isModerator(),
        excludeDisabled()
      ),
      iff(
        hook => hook.params.headers && hook.params.headers.authorization,
        authenticate('jwt')
      ),
      excludeBlacklisted(),
      when(isProvider('server'),
        includeAll()
      ),
      search(),
      search({
        fields: ['title', 'content']
      })
    ],
    get: [
      unless(isModerator(),
        excludeDisabled()
      )
    ],
    create: [
      authenticate('jwt'),
      // Allow seeder to seed contributions
      associateCurrentUser(),
      unless(isProvider('server'),
        isVerified(),
        canEditOrganization()
      ),
      associateCurrentUser(),
      createSlug({field: 'title'}),
      saveRemoteImages(['teaserImg']),
      createExcerpt()
    ],
    update: [
      authenticate('jwt'),
      unless(isProvider('server'),
        isVerified(),
        canEditOrganization()
      ),
      unless(isModerator(),
        excludeDisabled(),
        restrictToOwner()
      ),
      saveRemoteImages(['teaserImg']),
      createExcerpt(),
      setNow('updatedAt')
    ],
    patch: [
      authenticate('jwt'),
      unless(isProvider('server'),
        isVerified(),
        canEditOrganization()
      ),
      unless(isModerator(),
        excludeDisabled(),
        restrictToOwner()
      ),
      saveRemoteImages(['teaserImg']),
      createExcerpt(),
      setNow('updatedAt'),
      // SoftDelete uses patch to delete items
      // Make changes to deleted items here
      patchDeletedData({
        data: {
          $set: {
            type: 'DELETED',
            content: 'DELETED',
            contentExcerpt: 'DELETED',
            categoryIds: undefined,
            teaserImg: undefined,
            shoutCount: 0,
            tags: undefined,
            emotions: undefined
          },
          $unset: {
            cando: '',
            meta: ''
          }
        }
      })
    ],
    remove: [
      authenticate('jwt'),
      unless(isModerator(),
        canEditOrganization(),
        excludeDisabled(),
        restrictToOwner()
      )
    ]
  },

  after: {
    all: [
      xss({fields: xssFields}),
      populate({schema: userSchema}),
      populate({schema: categoriesSchema}),
      populate({schema: candosSchema}),
      populate({schema: commentsSchema}),
      keepDeletedDataFields({
        fields: [
          '_id',
          'deleted',
          'createdAt',
          'updatedAt'
        ]
      }),
      discard('wasSeeded')
    ],
    find: [
      when(isSingleItem(),
        getAssociatedCanDos()
      ),
      populate({schema: organizationSchema}),
      thumbnails(thumbs)
    ],
    get: [
      getAssociatedCanDos(),
      populate({schema: organizationSchema}),
      thumbnails(thumbs)
    ],
    create: [
      createMentionNotifications(),
      notifyFollowers(),
      thumbnails(thumbs)
    ],
    update: [
      // createMentionNotifications(),
      thumbnails(thumbs)
    ],
    patch: [
      // createMentionNotifications(),
      thumbnails(thumbs)
    ],
    remove: [
      cleanupRelatedItems({
        connections: [
          {
            service: 'comments',
            parentField: '_id',
            childField: 'contributionId'
          },
          {
            service: 'emotions',
            parentField: '_id',
            childField: 'contributionId'
          },
          {
            service: 'shouts',
            parentField: '_id',
            childField: 'foreignId',
            query: {
              foreignService: 'contributions'
            }
          },
          {
            service: 'users-candos',
            parentField: '_id',
            childField: 'contributionId'
          }
        ]
      })
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
