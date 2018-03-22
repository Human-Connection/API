const seedHelpers = require('../../helper/seed-helpers');
const faker = require('faker');

// eslint-disable-next-line no-unused-vars
module.exports = (seederstore) => {
  return {
    services: [{
      path: 'users',
      count: 50,
      template: {
        email: '{{internet.email}}',
        password: '{{internet.password}}',
        name: '{{name.firstName}} {{name.lastName}}',
        slug: '{{lorem.slug}}',
        isnothere: true,
        timezone: 'Europe/Berlin',
        avatar: () => seedHelpers.randomItem([faker.internet.avatar(), null]),
        isVerified : true,
        role : 'user',
        badgeIds: () => seedHelpers.randomItems(seederstore.badges, '_id', 0, seederstore.badges.length),
        doiToken: null,
        confirmedAt: null,
        deletedAt: null,
        wasSeeded: true
      }
    }]
  };
};
