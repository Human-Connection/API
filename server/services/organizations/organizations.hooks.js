const { unless, when, isProvider, populate, softDelete, stashBefore, discard } = require('feathers-hooks-common');
const { isVerified } = require('feathers-authentication-management').hooks;
const { authenticate } = require('feathers-authentication').hooks;
const { associateCurrentUser } = require('feathers-authentication-hooks');
const createSlug = require('../../hooks/create-slug');
const saveRemoteImages = require('../../hooks/save-remote-images');
const createExcerpt = require('../../hooks/create-excerpt');
const isModerator = require('../../hooks/is-moderator-boolean');
// const excludeDisabled = require('../../hooks/exclude-disabled');
const thumbnails = require('../../hooks/thumbnails');
const isAdminOwnerOrModerator = require('../../hooks/is-adminowner-or-moderator-boolean');
const restrictToOwnerOrModerator = require('../../hooks/restrictToOwnerOrModerator');
const restrictReviewAndEnableChange = require('../../hooks/restrictReviewAndEnableChange');
const flagPrimaryAddress = require('./hooks/flag-primary-address');
const populateUsersData = require('./hooks/populate-users-data');
const search = require('feathers-mongodb-fuzzy-search');
const isSingleItem = require('../../hooks/is-single-item');
const xss = require('../../hooks/xss');

const thumbnailOptions = {
  logo: {
    small: 'fit-in/72x72/filters:fill(white,true)',
    medium: 'fit-in/120x120/filters:fill(white,true)',
    large: 'fit-in/240x240/filters:fill(white,true)',
    placeholder: 'fit-in/36x36/filters:fill(white,true):blur(30)'
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
    childField: '_id',
    query: {
      $limit: 1,
      $select: ['_id', 'name', 'slug', 'avatar', 'lastActiveAt', 'termsAndConditionsAccepted', 'thumbnails']
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

module.exports = {
  before: {
    all: [
      softDelete(),
      xss({ fields: xssFields })
    ],
    find: [
      restrictToOwnerOrModerator({ isEnabled: true, reviewedBy: { $ne: null } }),
      search(),
      search({
        fields: ['name', 'email']
      })
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
          hook.data.reviewedBy = hook.params.user._id;
          return hook;
        }
      ),
      // Add current user as creator and user
      associateCurrentUser({ as: 'creatorId' }),
      hook => {
        hook.data.users = [
          {
            id: hook.data.creatorId,
            role: 'admin'
          }
        ];
        return hook;
      },
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
      unless(isAdminOwnerOrModerator(),
        discard('users')
      ),
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
      unless(isAdminOwnerOrModerator(),
        discard('users')
      ),
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
      flagPrimaryAddress()
      // populate({ schema: userSchema }),
      // populate({ schema: followerSchema })
    ],
    find: [
      when(isSingleItem(),
        populate({schema: categoriesSchema})
      ),
      thumbnails(thumbnailOptions)
    ],
    get: [
      populateUsersData(),
      populate({schema: categoriesSchema}),
      thumbnails(thumbnailOptions)
    ],
    create: [
      populateUsersData(),
      thumbnails(thumbnailOptions)
    ],
    update: [
      populateUsersData(),
      thumbnails(thumbnailOptions)
    ],
    patch: [
      populateUsersData()
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
