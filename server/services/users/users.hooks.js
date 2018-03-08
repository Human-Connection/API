const { authenticate } = require('feathers-authentication').hooks;
const { isProvider, when, discard, populate, disableMultiItemChange, lowerCase } = require('feathers-hooks-common');
const { restrictToOwner } = require('feathers-authentication-hooks');
const { addVerification, removeVerification } = require('feathers-authentication-management').hooks;

const sendVerificationEmail = require('./hooks/send-verification-email');
const restrictUserRole = require('./hooks/restrict-user-role');
const createAdmin = require('./hooks/create-admin');
const createSlug = require('../../hooks/create-slug');
const thumbnails = require('../../hooks/thumbnails');
const inviteCode = require('./hooks/invite-code')();
const search = require('feathers-mongodb-fuzzy-search');

const { hashPassword } = require('feathers-authentication-local').hooks;

const cleanupBasicData = when(isProvider('external'),
  discard('password', '_computed', 'verifyExpires', 'resetExpires', 'verifyChanges')
);
const cleanupPersonalData = when(isProvider('external'),
  discard('email', 'verifyToken', 'verifyShortToken', 'doiToken')
);

const restrict = [
  authenticate('jwt'),
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

const saveRemoteImages = require('../../hooks/save-remote-images');

const thumbnailOptions = {
  avatar: {
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

module.exports = {
  before: {
    all: [
      search(),
      search({  // regex search on given fields
        fields: ['name', 'email']
      })
    ],
    find: [],
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
        restrictUserRole()
      ),
      createAdmin(),
      saveRemoteImages(['avatar', 'coverImg'])
    ],
    update: [
      ...restrict,
      hashPassword(),
      disableMultiItemChange(),
      when(isProvider('external'),
        restrictUserRole()
      ),
      saveRemoteImages(['avatar', 'coverImg'])
    ],
    patch: [
      ...restrict,
      hashPassword(),
      disableMultiItemChange(),
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
    remove: [ ...restrict, disableMultiItemChange() ]
  },

  after: {
    all: [
      populate({ schema: badgesSchema }),
      populate({ schema: candosSchema }),
      cleanupBasicData
    ],
    find: [
      thumbnails(thumbnailOptions),
      cleanupPersonalData
    ],
    get: [
      thumbnails(thumbnailOptions),
      // remove personal data if its not the current autenticated user
      when(hook => {
        const itemBelongsToAuthenticatedUser = hook.params.user && hook.result && hook.params.user._id.toString() === hook.result._id.toString();
        // console.log('hook.params', hook.params);
        // console.log('currentId', hook.params.user ? hook.params.user._id : null);
        // console.log('foundId', hook.result ? hook.result._id : null);
        // console.log('identical', (hook.params.user && hook.result ) ? hook.params.user._id.toString() === hook.result._id.toString() : null);
        return itemBelongsToAuthenticatedUser !== true;
        // return (!hook.params.user || !hook.result.data || hook.params.user._id !== hook.result.data._id);
      }, discard('email', 'verifyToken', 'verifyShortToken', 'doiToken'))
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
