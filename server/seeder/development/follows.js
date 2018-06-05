const seedHelpers = require('../../helper/seed-helpers');
const _ = require('lodash');

module.exports = (seederstore) => {
  return {
    services: [
      {
        count: _.size(seederstore.users) * 15,
        path: 'follows',
        templates: [
          {
            userId: () => seedHelpers.randomItem(seederstore.users)._id,
            foreignId: () => seedHelpers.randomItem(seederstore.users)._id,
            foreignService: 'users',
            wasSeeded: true
          },
          {
            userId: () => seedHelpers.randomItem(seederstore.users)._id,
            foreignId: () => seedHelpers.randomItem(seederstore.projects)._id,
            foreignService: 'projects',
            wasSeeded: true
          },
          {
            userId: () => seedHelpers.randomItem(seederstore.users)._id,
            foreignId: () => seedHelpers.randomItem(seederstore.organizations)._id,
            foreignService: 'organizations',
            wasSeeded: true
          }
        ]
      }
    ]
  };
};
