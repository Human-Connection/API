const { unless, when, isProvider, populate, softDelete, stashBefore } = require('feathers-hooks-common');
const { isVerified } = require('feathers-authentication-management').hooks;
const { authenticate } = require('feathers-authentication').hooks;
const { associateCurrentUser } = require('feathers-authentication-hooks');
const createSlug = require('../../hooks/create-slug');
const saveRemoteImages = require('../../hooks/save-remote-images');
const createExcerpt = require('../../hooks/create-excerpt');
const isModerator = require('../../hooks/is-moderator-boolean');
// const excludeDisabled = require('../../hooks/exclude-disabled');
const thumbnails = require('../../hooks/thumbnails');
const restrictToOwnerOrModerator = require('../../hooks/restrictToOwnerOrModerator');
const restrictReviewAndEnableChange = require('../../hooks/restrictReviewAndEnableChange');
const xss = require('../../hooks/xss');

const thumbnailOptions = {
  logo: {
    small: '72x72/smart',
    medium: '120x120/smart',
    large: '240x240/smart',
    placeholder: '36x36/smart/filters:blur(30)'
  },
  coverImg: {
    cover: '1102x312/smart',
    coverPlaceholder: '243x100/smart/filters:blur(30)'
  }
};

const xssFields = ['description', 'descriptionExcerpt'];

const reviewerSchema = {
  include: {
    service: 'users',
    nameAs: 'reviewer',
    parentField: 'reviewedBy',
    childField: '_id'
  }
};

module.exports = {
  before: {
    all: [
      softDelete(),
      xss({ fields: xssFields })
    ],
    find: [
      restrictToOwnerOrModerator({ isEnabled: true, reviewedBy: { $ne: null } })
    ],
    get: [
      restrictToOwnerOrModerator({ isEnabled: true, reviewedBy: { $ne: null } })
    ],
    create: [
      authenticate('jwt'),
      // Allow seeder to seed contributions
      unless(isProvider('server'),
        isVerified()
      ),
      when(isModerator(),
        hook => {
          hook.data.reviewedBy = hook.params.user.userId;
          return hook;
        }
      ),
      associateCurrentUser(),
      createSlug({ field: 'name' }),
      createExcerpt({ field: 'description' }),
      saveRemoteImages(['logo', 'coverImg'])
    ],
    update: [
      authenticate('jwt'),
      unless(isProvider('server'),
        isVerified()
      ),
      stashBefore(),
      restrictReviewAndEnableChange(),
      restrictToOwnerOrModerator({ isEnabled: true }),
      createSlug({ field: 'name', overwrite: true }),
      createExcerpt({ field: 'description' }),
      saveRemoteImages(['logo', 'coverImg'])
    ],
    patch: [
      authenticate('jwt'),
      unless(isProvider('server'),
        isVerified()
      ),
      stashBefore(),
      restrictReviewAndEnableChange(),
      restrictToOwnerOrModerator({ isEnabled: true }),
      createSlug({ field: 'name', overwrite: true }),
      createExcerpt({ field: 'description' }),
      saveRemoteImages(['logo', 'coverImg'])
    ],
    remove: [
      authenticate('jwt'),
      isVerified(),
      stashBefore(),
      restrictToOwnerOrModerator({ isEnabled: true })
    ]
  },

  after: {
    all: [
      xss({ fields: xssFields }),
      populate({ schema: reviewerSchema }),
      // populate({ schema: userSchema }),
      // populate({ schema: followerSchema })
    ],
    find: [
      thumbnails(thumbnailOptions)
    ],
    get: [
      thumbnails(thumbnailOptions)
    ],
    create: [
      thumbnails(thumbnailOptions)
    ],
    update: [
      thumbnails(thumbnailOptions)
    ],
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
