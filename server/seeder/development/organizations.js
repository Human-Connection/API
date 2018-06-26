const seedHelpers = require('../../helper/seed-helpers');

module.exports = (seederstore) => {
  let roleAdmin = ({role}) => role === 'admin';
  let roleModOrAdmin = ({role}) => ['admin', 'moderator'].includes(role);
  return {
    services: [{
      path: 'organizations',
      count: 3,
      template: {
        name: '{{company.companyName}}',
        followerIds: [],
        logo: () => seedHelpers.randomLogo(),
        coverImg: () => seedHelpers.randomUnsplashUrl(),
        categoryIds: () => seedHelpers.randomCategories(seederstore),
        creatorId: () => seedHelpers.randomItem(seederstore.users, roleAdmin)._id,
        userIds: () => [seedHelpers.randomItem(seederstore.users, roleAdmin)._id],
        url: '{{internet.url}}',
        phone: '{{phone.phoneNumber}}',
        publicEmail: '{{internet.email}}',
        addresses: () => seedHelpers.randomAddresses(),
        channels: () => seedHelpers.randomChannels(),
        type: () => seedHelpers.randomItem(['ngo', 'npo', 'goodpurpose', 'ev', 'eva', 'other']),
        description: '{{lorem.text}}',
        deletedAt: null,
        isEnabled: true,
        reviewedBy: () => seedHelpers.randomItem(seederstore.users, roleModOrAdmin)._id,
        createdAt: '{{date.recent}}',
        updatedAt: '{{date.recent}}',
        wasSeeded: true
      }
    },
    {
      path: 'organizations',
      count: 30,
      template: {
        name: '{{company.companyName}}',
        followerIds: [],
        logo: () => seedHelpers.randomLogo(),
        coverImg: () => seedHelpers.randomItem([seedHelpers.randomUnsplashUrl(), null]),
        categoryIds: () => seedHelpers.randomCategories(seederstore),
        creatorId: () => seedHelpers.randomItem(seederstore.users)._id,
        userIds: () => [seedHelpers.randomItem(seederstore.users)._id],
        url: '{{internet.url}}',
        phone: '{{phone.phoneNumber}}',
        publicEmail: '{{internet.email}}',
        addresses: () => seedHelpers.randomAddresses(),
        channels: () => seedHelpers.randomChannels(),
        type: () => seedHelpers.randomItem(['ngo', 'npo', 'goodpurpose', 'ev', 'eva', 'other']),
        description: '{{lorem.text}}',
        deletedAt: null,
        isEnabled: true,
        reviewedBy: () => seedHelpers.randomItem([seedHelpers.randomItem(seederstore.users, roleModOrAdmin)._id, null]),
        createdAt: '{{date.recent}}',
        updatedAt: '{{date.recent}}',
        wasSeeded: true
      }
    }]
  };
};
