const seedHelpers = require('../../helper/seed-helpers');
const _ = require('lodash');

module.exports = (seederstore) => {
  return {
    services: [{
      count: Math.min((_.size(seederstore.contributions) * 3), 100),
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
