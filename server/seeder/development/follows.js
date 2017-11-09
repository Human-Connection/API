const _ = require('lodash');
const randomItem = require('../../helper/seed-helpers')().randomItem;

module.exports = (seederstore) => {
  return {
    services: [{
      count: 120,
      path: 'follows',
      templates: [
        {
          userId: () => randomItem(seederstore.users)._id,
          followingId: () => randomItem(seederstore.users)._id,
          type: 'users'
        },
        {
          userId: () => randomItem(seederstore.users)._id,
          followingId: () => randomItem(seederstore.projects)._id,
          type: 'projects'
        },
        {
          userId: () => randomItem(seederstore.users)._id,
          followingId: () => randomItem(seederstore.organizations)._id,
          type: 'organizations'
        }
      ]
    }]
  };
};