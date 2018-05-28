const seedHelpers = require('../../helper/seed-helpers');
const _ = require('lodash');

module.exports = (seederstore) => {
  return {
    services: [
      {
        count: Math.round(Math.min((_.size(seederstore.users) * (_.size(seederstore.contributions) * 0.7)), 100)),
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
