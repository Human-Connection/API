const { size, keys } = require('lodash');

let userKeys = [];

// eslint-disable-next-line no-unused-vars
module.exports = (seederstore) => {
  userKeys = keys(seederstore.users);
  return {
    services: [{
      path: 'usersettings',
      count: size(seederstore.users),
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
