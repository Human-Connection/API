const seedHelpers = require('../../helper/seed-helpers');

module.exports = (seederstore) => {
  let filter = ({role}) => role === 'admin';
  return {
    services: [{
      path: 'organizations',
      count: 30,
      template: {
        name: '{{company.companyName}}',
        followerIds: [],
        logo: () => seedHelpers.randomLogo(),
        coverImg: () => seedHelpers.randomUnsplashUrl(),
        categoryIds: () => seedHelpers.randomCategories(seederstore),
        userId: () => seedHelpers.randomItem(seederstore.users, filter)._id,
        addresses: () => seedHelpers.randomAddresses(),
        description: '{{lorem.text}}',
        content: '{{lorem.text}} {{lorem.text}} {{lorem.text}} {{lorem.text}}',
        isVerified: () => seedHelpers.randomItem([true, false]),
        deletedAt: null,
        createdAt: '{{date.recent}}',
        updatedAt: '{{date.recent}}',
        wasSeeded: true
      }
    }]
  };
};