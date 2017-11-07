const _ = require('lodash');
const randomItem = require('../../helper/seed-helpers')().randomItem;

module.exports = (seederstore) => {
  return {
    services: [{
      count: _.keys(seederstore.contributions).length * 3,
      path: 'comments',
      templates: [
        {
          userId: () => randomItem(seederstore.users)._id,
          contributionId: () => randomItem(seederstore.contributions)._id,
          content: '{{lorem.text}} {{lorem.text}}',
          language: 'de_DE',
          createdAt: '{{date.recent}}',
          updatedAt: '{{date.recent}}'
        }
      ]
    }]
  };
};