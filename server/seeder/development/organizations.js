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
        website: '{{internet.url}}',
        publicEmail: '{{internet.email}}',
        addresses: () => seedHelpers.randomAddresses(),
        type: () => seedHelpers.randomItem(['ngo', 'npo', 'goodpurpose', 'ev', 'eva']),
        description: '{{lorem.text}}',
        deletedAt: null,
        isEnabled: true,
        reviewedBy: null,
        createdAt: '{{date.recent}}',
        updatedAt: '{{date.recent}}',
        wasSeeded: true
      }
    }]
  };
};
