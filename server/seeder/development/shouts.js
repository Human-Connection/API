const seedHelpers = require('../../helper/seed-helpers');

module.exports = (seederstore) => {
  return {
    services: [{
      count: 240,
      path: 'shouts',
      templates: [
        {
          userId: () => seedHelpers.randomItem(seederstore.users)._id,
          foreignId: () => seedHelpers.randomItem(seederstore.contributions)._id,
          foreignService: 'contributions',
          wasSeeded: true
        }
      ]
    }]
  };
};