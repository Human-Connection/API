const _ = require('lodash');
const seedHelpers = require('../../helper/seed-helpers');

module.exports = (seederstore) => {
  return {
    services: [{
      count: _.size(seederstore.contributions) * 3,
      path: 'comments',
      templates: [
        {
          userId: () => seedHelpers.randomItem(seederstore.users)._id,
          contributionId: () => seedHelpers.randomItem(seederstore.contributions)._id,
          content: '{{lorem.text}} {{lorem.text}}',
          language: 'de',
          createdAt: '{{date.recent}}',
          updatedAt: '{{date.recent}}',
          wasSeeded: true
        }
      ]
    }]
  };
};
