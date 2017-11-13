const seedHelpers = require('../../helper/seed-helpers');

module.exports = (seederstore) => {
  return {
    services: [{
      // Create test user
      path: 'users',
      count: 1,
      template: {
        email: 'test@test.de',
        password: '1234',
        name: 'Peter Pan',
        slug: 'peter-pan',
        isnothere: true,
        timezone: 'Europe/Berlin',
        avatar: '{{internet.avatar}}',
        coverImg: 'https://source.unsplash.com/random/1250x280',
        badgesIds: () => [seedHelpers.randomItem(seederstore.badges)._id],
        doiToken: null,
        confirmedAt: null,
        deletedAt: null
      }
    }]
  };
};