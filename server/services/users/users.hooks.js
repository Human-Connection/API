// const { authenticate } = require('feathers-authentication').hooks;
const { isProvider, when, iff, populate, disableMultiItemChange, lowerCase } = require('feathers-hooks-common');
const { protect } = require('@feathersjs/authentication-local').hooks;
const { restrictToOwner } = require('feathers-authentication-hooks');
const { addVerification, removeVerification } = require('feathers-authentication-management').hooks;

const sendVerificationEmail = require('./hooks/send-verification-email');
const restrictUserRole = require('./hooks/restrict-user-role');
const createAdmin = require('./hooks/create-admin');
const createSlug = require('../../hooks/create-slug');
const thumbnails = require('../../hooks/thumbnails');
const isModerator = require('../../hooks/is-moderator-boolean');
const isSingleItem = require('../../hooks/is-single-item');
const inviteCode = require('./hooks/invite-code')();
const search = require('feathers-mongodb-fuzzy-search');
const isOwnEntry = require('./hooks/is-own-entry');
const removeAllRelatedUserData = require('./hooks/remove-all-related-user-data');

const { hashPassword } = require('@feathersjs/authentication-local').hooks;

const cleanupBasicData = protect('password', '_computed', 'verifyExpires', 'resetExpires', 'verifyChanges');
const cleanupPersonalData = protect('email', 'verifyToken', 'verifyShortToken', 'doiToken', 'systemNotificationsSeen');

const restrict = [
  restrictToOwner({
    idField: '_id',
    ownerField: '_id'
  })
];

const badgesSchema = {
  include: {
    service: 'badges',
    nameAs: 'badges',
    parentField: 'badgeIds',
    childField: '_id',
    asArray: true
  }
};

const candosSchema = {
  include: {
    service: 'users-candos',
    nameAs: 'candos',
    parentField: '_id',
    childField: 'userId',
    asArray: true
  }
};

const userSettingsPrivateSchema = {
  include: {
    service: 'usersettings',
    nameAs: 'userSettings',
    parentField: '_id',
    childField: 'userId',
    asArray: false,
    query: {
      $limit: 1
    }
  }
};

const userSettingsSchema = {
  include: {
    service: 'usersettings',
    nameAs: 'userSettings',
    parentField: '_id',
    childField: 'userId',
    query: {
      $select: ['uiLanguage', 'contentLanguages'],
      $limit: 1
    },
    asArray: false
  }
};

const saveRemoteImages = require('../../hooks/save-remote-images');

const thumbnailOptions = {
  avatar: {
    small: '72x72/smart',
    medium: '120x120/smart',
    large: '240x240/smart',
    placeholder: '36x36/smart/filters:blur(30)'
  },
  coverImg: {
    cover: '1102x/filters:fill(white,true):no_upscale()',
    coverPlaceholder: '243x/filters:fill(white,true):no_upscale():blur(30)'
  }
};

module.exports = {
  before: {
    all: [],
    find: [
      // authenticate('jwt'),
      search(),
      search({
        fields: ['name', 'email']
      })
    ],
    get: [],
    create: [
      hashPassword(),
      lowerCase('email', 'username'),
      when(isProvider('external'),
        inviteCode.before
      ),
      // We don't need email verification
      // for server generated users
      addVerification(),
      when(isProvider('server'),
        hook => {
          hook.data.isVerified = true;
          return hook;
        }
      ),
      when(isProvider('external'),
        restrictUserRole(),
        createAdmin()
      ),
      saveRemoteImages(['avatar', 'coverImg'])
    ],
    update: [
      ...restrict,
      hashPassword(),
      disableMultiItemChange(),
      lowerCase('email', 'username'),
      when(isProvider('external'),
        restrictUserRole()
      ),
      saveRemoteImages(['avatar', 'coverImg'])
    ],
    patch: [
      ...restrict,
      disableMultiItemChange(),
      lowerCase('email', 'username'),
      // Only set slug once
      when(
        hook => {
          return hook.params && hook.params.user && !hook.params.user.slug;
        },
        createSlug({ field: 'name' })
      ),
      when(isProvider('external'),
        restrictUserRole()
      ),
      saveRemoteImages(['avatar', 'coverImg'])
    ],
    remove: [
      ...restrict,
      disableMultiItemChange(),
      removeAllRelatedUserData()
    ]
  },

  after: {
    all: [
      cleanupBasicData
    ],
    find: [
      when(isModerator(),
        populate({ schema: userSettingsSchema })
      ),
      when(isSingleItem(),
        populate({ schema: badgesSchema }),
        populate({ schema: candosSchema }),
        populate({ schema: userSettingsSchema })
      ),
      thumbnails(thumbnailOptions),
      cleanupPersonalData
    ],
    get: [
      populate({ schema: badgesSchema }),
      populate({ schema: candosSchema }),
      populate({ schema: userSettingsSchema }),
      thumbnails(thumbnailOptions),
      // remove personal data if its not the current authenticated user
      iff(isOwnEntry(false),
        cleanupPersonalData
      ),
      iff(isOwnEntry(),
        populate({ schema: userSettingsPrivateSchema })
      )
    ],
    create: [
      when(isProvider('external'),
        sendVerificationEmail()
      ),
      when(isProvider('external'),
        removeVerification()
      ),
      thumbnails(thumbnailOptions),
      inviteCode.after
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
