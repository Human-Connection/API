const { authenticate } = require('feathers-authentication').hooks;
const { isProvider, when, discard } = require('feathers-hooks-common');
const { restrictToOwner } = require('feathers-authentication-hooks');
const { addVerification, removeVerification } = require('feathers-authentication-management').hooks;

const sendVerificationEmail = require('../../hooks/send-verification-email');

const { hashPassword } = require('feathers-authentication-local').hooks;
const restrict = [
  authenticate('jwt'),
  restrictToOwner({
    idField: '_id',
    ownerField: '_id'
  })
];


module.exports = {
  before: {
    all: [],
    find: [],
    get: [ ...restrict ],
    create: [
      hashPassword(),
      addVerification(),
      // We don't need email verification
      // for server generated users
      when(isProvider('server'),
        hook => {
          hook.data.isVerified = true;
          return hook;
        }
      )
    ],
    update: [ ...restrict, hashPassword() ],
    patch: [ ...restrict, hashPassword() ],
    remove: [ ...restrict ]
  },

  after: {
    all: [
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
