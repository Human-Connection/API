const seedHelpers = require('../../helper/seed-helpers');

module.exports = (seederstore) => {
  return {
    services: [{
      // Create test user
      path: 'users',
      randomize: false,
      templates: [{
        email: 'test@test.de',
        password: '1234',
        name: 'Peter',
        isnothere: true,
        timezone: 'Europe/Berlin',
        avatar: '{{internet.avatar}}',
        coverImg: 'https://source.unsplash.com/random/1250x280',
        badgesIds: () => [seedHelpers.randomItem(seederstore.badges)._id],
        doiToken: null,
        confirmedAt: null,
        deletedAt: null
      },
      {
        email: 'test2@test2.de',
        password: '1234',
        name: 'Greg',
        isnothere: true,
        timezone: 'Europe/Berlin',
        avatar: 'https://www.dropbox.com/s/svd9y6hkkgwkgoc/avatar.jpg?dl=1',
        coverImg: 'https://www.dropbox.com/s/vzv05ffc0nelra9/header.png?dl=1',
        badgesIds: [],
        doiToken: null,
        confirmedAt: null,
        deletedAt: null
      }]
    }]
  };
};