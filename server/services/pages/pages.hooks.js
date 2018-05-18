const { unless, isProvider } = require('feathers-hooks-common');
const { isVerified } = require('feathers-authentication-management').hooks;
const { authenticate } = require('feathers-authentication').hooks;
const isAdmin = require('../../hooks/is-admin');
const createSlug = require('../../hooks/create-slug');

const cleanupHTML = () => {
  return (hook) => {
    hook.data.content = hook.data.content
      .replace(/<[a-z]>[\s]*<\/[a-z]>/igm, '')
      .replace(/<p>[\s]*(<br ?\/?>)+[\s]*<\/p>/igm, '<br />')
      .replace(/(<br ?\/?>){2,}/igm, '<br />')
      .replace(/[\n]{3,}/igm, '\n\n');
  };
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      authenticate('jwt'),
      unless(isProvider('server'),
        isVerified(),
        isAdmin()
      ),
      createSlug({ field: 'key', unique: false }),
      cleanupHTML()
    ],
    update: [
      authenticate('jwt'),
      unless(isProvider('server'),
        isVerified(),
        isAdmin()
      ),
      cleanupHTML()
    ],
    patch: [
      authenticate('jwt'),
      unless(isProvider('server'),
        isVerified(),
        isAdmin()
      ),
      cleanupHTML()
    ],
    remove: [
      authenticate('jwt'),
      isVerified(),
      isAdmin()
    ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
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
