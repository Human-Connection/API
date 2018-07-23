const alterItems = require('../helper/alter-items');

const defaults = {
  blacklist: [],
  data: {
    content: 'You have blacklisted this user'
  }
};

const handleItem = options => item => {
  if (options.blacklist){
    let found = options.blacklist.find((userId) => {
      return userId.toString() === item.userId;
    });
    if (found){
      item = {...item, ...options.data};
    }
  }
  return item;
};

module.exports = function concealBlacklistedData(options = defaults) {
  return async function(hook){
    if (hook.method === 'find' || hook.id === null) {
      const authenticatedUser = hook.params.user;
      if (!authenticatedUser){
        return hook;
      }
      const usersettings = await hook.app.service('usersettings').find({query: {userId: authenticatedUser._id}});
      if (usersettings.total <= 0){
        return hook;
      }
      options.blacklist = usersettings.data[0].blacklist;
      return alterItems(handleItem(options))(hook);
    }

    return hook;
  };
};

