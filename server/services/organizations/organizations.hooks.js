const { authenticate } = require('feathers-authentication').hooks;
const createSlug = require('../../hooks/create-slug');
const saveRemoteImages = require('../../hooks/save-remote-images');
const saveAvatar = require('./hooks/save-avatar');
const thumbnails = require('../../hooks/thumbnails');

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

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      authenticate('jwt'),
      createSlug({ field: 'name' }),
      saveRemoteImages(['logo', 'coverImg']),
      saveAvatar()
    ],
    update: [
      authenticate('jwt'),
      createSlug({ field: 'name' }),
      saveRemoteImages(['logo', 'coverImg']),
      saveAvatar()
    ],
    patch: [
      authenticate('jwt'),
      createSlug({ field: 'name' }),
      saveRemoteImages(['logo', 'coverImg']),
      saveAvatar()
    ],
    remove: [ authenticate('jwt') ]
  },

  after: {
    all: [
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
