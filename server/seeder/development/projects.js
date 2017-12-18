const seedHelpers = require('../../helper/seed-helpers');

module.exports = (seederstore) => {
  return {
    services: [{
      path: 'projects',
      count: 30,
      template: {
        name: '{{lorem.slug}}',
        followerIds: [],
        categoryIds: () => seedHelpers.randomCategories(seederstore),
        userId: () => seedHelpers.randomItem(seederstore.users)._id,
        addresses: () => seedHelpers.randomAddresses(),
        description: '{{lorem.text}}',
        content: '{{lorem.text}} {{lorem.text}} {{lorem.text}} {{lorem.text}}',
        wasSeeded: true
      }
    }]
  };
};