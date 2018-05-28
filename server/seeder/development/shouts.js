const seedHelpers = require('../../helper/seed-helpers');
const _ = require('lodash');

module.exports = (seederstore) => {
  return {
    services: [{
      count: Math.round(_.size(seederstore.comments) * (_.size(seederstore.users) * 0.5)),
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
