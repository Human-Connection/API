const _ = require('lodash');
const randomItem = require('../../helper/seed-helpers')().randomItem;
const randomCategories = require('../../helper/seed-helpers')().randomCategories;

const randomFollowerIds = (items) => {
  const count = Math.round(Math.random() * _.keys(items).length);
  const userIds = _.shuffle(_.keys(items));
  let ids = [];
  for (let i = 0; i < count; i++) {
    ids.push(userIds.pop());
  }
  return ids;
};

module.exports = (seederstore) => {
  return {
    services: [{
      path: 'organizations',
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