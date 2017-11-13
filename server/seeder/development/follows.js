const seedHelpers = require('../../helper/seed-helpers');

module.exports = (seederstore) => {
  return {
    services: [{
      count: 120,
      path: 'follows',
      templates: [
        {
          userId: () => seedHelpers.randomItem(seederstore.users)._id,
          followingId: () => seedHelpers.randomItem(seederstore.users)._id,
          type: 'users'
        },
        {
          userId: () => seedHelpers.randomItem(seederstore.users)._id,
          followingId: () => seedHelpers.randomItem(seederstore.projects)._id,
          type: 'projects'
        },
        {
          userId: () => seedHelpers.randomItem(seederstore.users)._id,
          followingId: () => seedHelpers.randomItem(seederstore.organizations)._id,
          type: 'organizations'
        }
      ]
    }]
  };
};