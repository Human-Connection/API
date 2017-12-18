const seedHelpers = require('../../helper/seed-helpers');

module.exports = (seederstore) => {
  return {
    services: [
      {
        count: 50,
        path: 'follows',
        template: {
          userId: () => seedHelpers.randomItem(seederstore.users)._id,
          followingId: () => seedHelpers.randomItem(seederstore.users)._id,
          type: 'users',
          wasSeeded: true
        }
      },
      {
        count: 50,
        path: 'follows',
        template: {
          userId: () => seedHelpers.randomItem(seederstore.users)._id,
          followingId: () => seedHelpers.randomItem(seederstore.projects)._id,
          type: 'projects',
          wasSeeded: true
        }
      },
      {
        count: 50,
        path: 'follows',
        template: {
          userId: () => seedHelpers.randomItem(seederstore.users)._id,
          followingId: () => seedHelpers.randomItem(seederstore.organizations)._id,
          type: 'organizations',
          wasSeeded: true
        }
      }
    ]
  };
};