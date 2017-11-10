const _ = require('lodash');
const randomItem = require('../../helper/seed-helpers')().randomItem;
const randomCategories = require('../../helper/seed-helpers')().randomCategories;

module.exports = (seederstore) => {
  return {
    services: [{
      path: 'projects',
      count: 30,
      template: {
        name: '{{lorem.slug}}',
        followerIds: [],
        categoryIds: () => randomCategories(seederstore),
        userId: () => randomItem(seederstore.users)._id,
        description: '{{lorem.text}}',
        content: '{{lorem.text}} {{lorem.text}} {{lorem.text}} {{lorem.text}}',
      }
    }]
  };
};