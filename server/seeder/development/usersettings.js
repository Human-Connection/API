const seedHelpers = require('../../helper/seed-helpers');

// eslint-disable-next-line no-unused-vars
module.exports = (seederstore) => {
  return {
    services: [{
      path: 'usersettings',
      count: 500,
      template: {
        userId: () => seedHelpers.randomItem(seederstore.users)._id,
        uiLanguage: 'de',
        contributionLanguages: ['German']
      }
    }]
  };
};