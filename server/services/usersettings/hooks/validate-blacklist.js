const { BadRequest } = require('@feathersjs/errors');

const validateBlacklist = () => {
  return async (hook) => {
    const { data } = hook;
    const blacklist = data.blacklist;
    if (!blacklist) return hook;
    const userId = data.userId;

    if(blacklist && blacklist.includes(userId)) {
      throw new BadRequest('You can not blacklist yourself.');
    }

    const users = await hook.app.service('users').find({query: {_id: {$in: blacklist}}});
    const unblacklistable = users.data.find((user) => {
      return (user.role === 'admin') || (user.role === 'moderator');
    });
    if (unblacklistable){
      throw new BadRequest('You can not blacklist admin users or moderators.');
    }
    return hook;
  };
};
module.exports = validateBlacklist;
