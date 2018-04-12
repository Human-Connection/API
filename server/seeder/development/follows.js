const seedHelpers = require('../../helper/seed-helpers');

module.exports = (seederstore) => {
  return {
    services: [
      {
        count: () => seederstore.users.length * 5,
        path: 'follows',
        template: {
          userId: () => seedHelpers.randomItem(seederstore.users)._id,
          foreignId: () => seedHelpers.randomItem(seederstore.users)._id,
          foreignService: 'users',
          wasSeeded: true
        }
      },
      {
        count: () => seederstore.users.length,
        path: 'follows',
        template: {
          userId: () => seedHelpers.randomItem(seederstore.users)._id,
          foreignId: () => seedHelpers.randomItem(seederstore.projects)._id,
          foreignService: 'projects',
          wasSeeded: true
        }
      },
      {
        count: () => seederstore.users.length,
        path: 'follows',
        template: {
          userId: () => seedHelpers.randomItem(seederstore.users)._id,
          foreignId: () => seedHelpers.randomItem(seederstore.organizations)._id,
          foreignService: 'organizations',
          wasSeeded: true
        }
      }
    ]
  };
};
