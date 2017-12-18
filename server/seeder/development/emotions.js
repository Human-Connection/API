const seedHelpers = require('../../helper/seed-helpers');
const _ = require('lodash');

module.exports = (seederstore) => {
  return {
    services: [
      {
        count: _.size(seederstore.contributions) * 5,
        path: 'emotions',
        template: {
          contributionId: () => seedHelpers.randomItem(seederstore.contributions)._id.toString(),
          userId: () => seedHelpers.randomItem(seederstore.users)._id.toString(),
          rated: () => seedHelpers.randomItem(['funny', 'happy', 'surprised', 'cry', 'angry']),
          wasSeeded: true
        }
      }
    ]
  };
};