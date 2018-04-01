const seedHelpers = require('../../helper/seed-helpers');
const _ = require('lodash');

let userKeys = [];

// eslint-disable-next-line no-unused-vars
module.exports = (seederstore) => {
  userKeys = _.keys(seederstore.users);
  return {
    services: [{
      path: 'usersettings',
      count: _.size(seederstore.users),
      template: {
        userId: () => {
          return userKeys.pop();
        },
        uiLanguage: 'de',
        contentLanguages: ['de']
      }
    }]
  };
};
