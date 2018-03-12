const seedHelpers = require('../../helper/seed-helpers');

// eslint-disable-next-line no-unused-vars
module.exports = (seederstore) => {
  return {
    services: [{
      path: 'invites',
      count: 10,
      template: {
        email: '{{internet.email}}',
        code: () => seedHelpers.genInviteCode(),
        badgeIds: () => seedHelpers.randomItems(seederstore.badges, '_id', 0, seederstore.badges.length),
        language: () => seedHelpers.randomItems(['de', 'en']),
        wasSeeded: true
      }
    }]
  };
};