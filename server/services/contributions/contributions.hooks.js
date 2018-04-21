const { authenticate } = require('feathers-authentication').hooks;
const { when, unless, isProvider, populate } = require('feathers-hooks-common');
const {
  //queryWithCurrentUser,
  associateCurrentUser,
  restrictToOwner
} = require('feathers-authentication-hooks');
const { isVerified } = require('feathers-authentication-management').hooks;
const createSlug = require('../../hooks/create-slug');
const saveRemoteImages = require('../../hooks/save-remote-images');
const createExcerpt = require('../../hooks/create-excerpt');
const search = require('feathers-mongodb-fuzzy-search');
const thumbnails = require('../../hooks/thumbnails');
const isModerator = require('../../hooks/is-moderator-boolean');
const excludeDisabled = require('../../hooks/exclude-disabled');
const getAssociatedCanDos = require('./hooks/get-associated-can-dos');
const createMentionNotifications = require('./hooks/create-mention-notifications');
const isSingleItem = require('../../hooks/is-single-item');
const xss = require('../../hooks/xss');

const userSchema = {
  include: {
    service: 'users',
    nameAs: 'user',
    parentField: 'userId',
    childField: '_id'
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
      $select: ['_id']
    },
    asArray: true
    //,
    //include: {
    //  service: 'users',
    //  nameAs: 'user',
    //  parentField: 'userId',
    //  childField: '_id'
    //}
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
      xss({ fields: xssFields })
    ],
    find: [
      unless(isModerator(),
        excludeDisabled()
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
      unless(isProvider('server'),
        isVerified()
      ),
      associateCurrentUser(),
      createSlug({ field: 'title' }),
      saveRemoteImages(['teaserImg']),
      createExcerpt()
    ],
    update: [
      authenticate('jwt'),
      unless(isProvider('server'),
        isVerified()
      ),
      unless(isModerator(),
        excludeDisabled(),
        restrictToOwner()
      ),
      saveRemoteImages(['teaserImg']),
      createExcerpt()
    ],
    patch: [
      authenticate('jwt'),
      unless(isProvider('server'),
        isVerified()
      ),
      unless(isModerator(),
        excludeDisabled(),
        restrictToOwner()
      ),
      saveRemoteImages(['teaserImg']),
      createExcerpt()
    ],
    remove: [
      authenticate('jwt'),
      isVerified(),
      unless(isModerator(),
        excludeDisabled(),
        restrictToOwner()
      )
    ]
  },

  after: {
    all: [
      xss({ fields: xssFields }),
      populate({ schema: userSchema }),
      populate({ schema: categoriesSchema }),
      populate({ schema: candosSchema }),
      populate({ schema: commentsSchema })
    ],
    find: [
      when(isSingleItem(),
        getAssociatedCanDos()
      ),
      thumbnails(thumbs)
    ],
    get: [
      getAssociatedCanDos(),
      thumbnails(thumbs)
    ],
    create: [
      createMentionNotifications(),
      thumbnails(thumbs)
    ],
    update: [
      createMentionNotifications(),
      thumbnails(thumbs)
    ],
    patch: [
      createMentionNotifications(),
      thumbnails(thumbs)
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
