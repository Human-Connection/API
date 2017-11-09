const _ = require('lodash');
const randomItem = require('../../helper/seed-helpers')().randomItem;

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
      path: 'ngos',
      count: 10,
      template: {
        name: '{{lorem.slug}}',
        followerIds: () => randomFollowerIds(seederstore.users),
        userId: () => randomItem(seederstore.users)._id,
        text: '{{lorem.text}}'
      }
    }]
  };
};