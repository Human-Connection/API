const { authenticate } = require('feathers-authentication').hooks;
const {populate} = require('feathers-hooks-common');
const userSchema = {
  include: {
    service: 'users',
    nameAs: 'user',
    parentField: 'userId',
    childField: '_id'
  }
};
const followerSchema = {
  include: {
    service: 'users',
    nameAs: 'user',
    parentField: 'followerIds',
    childField: '_id'
  }
};

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [
      populate({ schema: userSchema }),
      populate({ schema: followerSchema })
    ],
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
