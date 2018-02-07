const seedHelpers = require('../../helper/seed-helpers');

module.exports = (seederstore) => {
  let filter = ({role}) => role === 'admin';
  return {
    services: [{
      path: 'organizations',
      count: 30,
      template: {
        slug: '{{lorem.slug}}',
        name: '{{lorem.text}}',
        followerIds: [],
        logo: () => seedHelpers.randomLogo(),
        coverImg: () => seedHelpers.randomUnsplashUrl(),
        categoryIds: () => seedHelpers.randomCategories(seederstore),
        userId: () => seedHelpers.randomAdmin(seederstore.users, filter)._id,
        addresses: () => seedHelpers.randomAddresses(),
        description: '{{lorem.text}}',
        content: '{{lorem.text}} {{lorem.text}} {{lorem.text}} {{lorem.text}}',
        isVerified : true,
        role : 'user',
        doiToken: null,
        confirmedAt: null,
        deletedAt: null,
        wasSeeded: true
      }
    }]
  };
};