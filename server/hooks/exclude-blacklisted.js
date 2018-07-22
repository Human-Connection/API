const errors = require('@feathersjs/errors');

module.exports = () => async (hook) => {
  if (hook.type !== 'before') {
    throw new Error('The \'excludeBlacklisted\' hook should only be used as a \'before\' hook.');
  }
  // If it was an internal call then skip this hook
  if (!hook.params.provider || hook.params.query.$disableStashBefore) {
    return hook;
  }

  // hook.params.before is undefined
  // even so stashBefore() hook is executed
  // eslint-disable-next-line
  console.log('stash before', hook.params.before);

  const authenticatedUser = hook.params.user;
  if (!authenticatedUser) return hook;

  let usersettings;
  let blacklist;

  if (hook.method === 'find' || hook.method === 'get' || hook.id === null) {
    usersettings = await hook.app.service('usersettings').find({
      query: {userId: authenticatedUser._id}
    });
    // User settings are not found consistently,
    // there seems to be a race condition
    // eslint-disable-next-line
    console.log('user settings', usersettings);
    if (!usersettings.data || !usersettings.data[0]) return hook;
    blacklist = usersettings.data[0].blacklist;
    if (!blacklist || blacklist.length <= 0) return hook;
  }

  if (hook.method === 'find') {
    hook.params.query.userId = {$nin: blacklist};
    return hook;
  }

  // Only after stash before
  if (hook.method === 'get' && hook.params.before) {
    const authorId = hook.params.before.userId;

    if (authorId && blacklist.includes(authorId)) {
      throw new errors.Forbidden('This item is blacklisted.');
    }
    return hook;
  }

  return hook;
};
