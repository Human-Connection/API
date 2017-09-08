const { authenticate } = require('feathers-authentication').hooks;
const { isProvider, when, discard, populate, disableMultiItemChange, lowerCase } = require('feathers-hooks-common');
const { restrictToOwner } = require('feathers-authentication-hooks');
const { addVerification, removeVerification } = require('feathers-authentication-management').hooks;

const sendVerificationEmail = require('./hooks/send-verification-email');
const restrictUserRole = require('./hooks/restrict-user-role');
const createAdmin = require('./hooks/create-admin');
const saveAvatar = require('./hooks/save-avatar');
const createSlug = require('../../hooks/create-slug');

const { hashPassword } = require('feathers-authentication-local').hooks;

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
    parentField: 'badgesIds',
    childField: '_id'
  }
};

const saveRemoteImages = require('../../hooks/save-remote-images');
const createDefaultAvatar = require('../../hooks/create-default-avatar');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [ ...restrict ],
    create: [
      hashPassword(),
      addVerification(),
      lowerCase('email', 'username'),
      // We don't need email verification
      // for server generated users
      when(isProvider('server'),
        hook => {
          hook.data.isVerified = true;
          return hook;
        }
      ),
      restrictUserRole(),
      createAdmin(),
      createDefaultAvatar(),
      saveRemoteImages(['avatar', 'coverImg']),
      saveAvatar()
    ],
    update: [
      ...restrict,
      hashPassword(),
      disableMultiItemChange(),
      restrictUserRole(),
      saveRemoteImages(['avatar', 'coverImg']),
      saveAvatar()
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
      restrictUserRole(),
      saveRemoteImages(['avatar', 'coverImg']),
      saveAvatar()
    ],
    remove: [ ...restrict, disableMultiItemChange() ]
  },

  after: {
    all: [
      populate({ schema: badgesSchema }),
      when(isProvider('external'),
        discard('password', '_computed', 'verifyExpires', 'resetExpires', 'verifyChanges')
      )
    ],
    find: [],
    get: [],
    create: [
      when(isProvider('external'),
        sendVerificationEmail()
      ),
      removeVerification()
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
