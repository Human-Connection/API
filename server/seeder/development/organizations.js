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
        isVerified: () => seedHelpers.randomItem([true, false]),
        deletedAt: null,
        isEnabled: true,
        createdAt: '{{date.recent}}',
        updatedAt: '{{date.recent}}',
        wasSeeded: true
      }
    }]
  };
};