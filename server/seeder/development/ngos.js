const _ = require('lodash');
const randomItem = require('../../helper/seed-helpers')().randomItem;

module.exports = (seederstore) => {
  return {
    services: [{
      path: 'ngos',
      count: 10,
      template: {
        name: '{{lorem.slug}}',
        followerIds: [],
        userId: () => randomItem(seederstore.users)._id,
        text: '{{lorem.sentence}}'
      }
    }]
  };
};