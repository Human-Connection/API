module.exports = function excludeBlacklisted() {
  return async function (hook) {
    if (hook.type !== 'before') {
      throw new Error('The \'excludeBlacklisted\' hook should only be used as a \'before\' hook.');
    }

    if (hook.method === 'find' || hook.id === null) {
      const authenticatedUser = hook.params.user;
      if (!authenticatedUser){
        return hook;
      }
      const usersettings = await hook.app.service('usersettings').find({query: {userId: authenticatedUser._id}});
      if (usersettings.total <= 0){
        return hook;
      }
      const { blacklist } = usersettings.data[0];
      if (blacklist) {
        let { query } = hook.params;
        query.userId = query.userId || {};
        query.userId.$nin = blacklist;
      }
      return hook;
    }

    return hook;
  };
};
