module.exports = function excludeBlacklisted() {
  return async function (hook) {
    if (hook.type !== 'before') {
      throw new Error('The \'excludeBlacklisted\' hook should only be used as a \'before\' hook.');
    }
    // If it was an internal call then skip this hook
    if (!hook.params.provider) {
      return hook;
    }

    const authenticatedUser = hook.params.user;
    if (!authenticatedUser) return hook;

    let usersettings;
    let blacklist;

    if (hook.method === 'find' || hook.method === 'get' || hook.id === null) {
      usersettings = await hook.app.service('usersettings').find({query: {userId: authenticatedUser._id}});
      if (usersettings.total <= 0) return hook;
      blacklist = usersettings.data[0].blacklist;
      if (!blacklist || blacklist.length <= 0) return hook;
    }

    if (hook.method === 'find' || hook.id === null) {
      hook.params.query.userId = {$nin: blacklist};
      return hook
    }

    if (hook.method === 'get' && hook.id && hook.provider) {
      // look up the document and throw a Forbidden error if the item is not enabled
      // Set provider as undefined so we avoid an infinite loop if this hook is
      // set on the resource we are requesting.
      let params = Object.assign({}, hook.params, { provider: undefined });

      return hook.service.get(hook.id, params).then(function (data) {
        if (data.toJSON) {
          data = data.toJSON();
        } else if (data.toObject) {
          data = data.toObject();
        }

        if (!data || blacklist.includes(data.id)) {
          throw new errors.Forbidden('This item is blacklisted.');
        }

        return hook;
      });

    }

    return hook;
  };
};
