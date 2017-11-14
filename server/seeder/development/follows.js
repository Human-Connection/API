const seedHelpers = require('../../helper/seed-helpers');

module.exports = (seederstore) => {
  return {
    services: [
      {
        count: 150,
        path: 'follows',
        template: {
          userId: () => seedHelpers.randomItem(seederstore.users)._id,
          followingId: () => seedHelpers.randomItem(seederstore.users)._id,
          type: 'users'
        }
      },
      {
        count: 150,
        path: 'follows',
        template: {
          userId: () => seedHelpers.randomItem(seederstore.users)._id,
          followingId: () => seedHelpers.randomItem(seederstore.projects)._id,
          type: 'projects'
        }
      },
      {
        count: 150,
        path: 'follows',
        template: {
          userId: () => seedHelpers.randomItem(seederstore.users)._id,
          followingId: () => seedHelpers.randomItem(seederstore.organizations)._id,
          type: 'organizations'
        }
      }
    ]
  };
};