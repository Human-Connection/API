const { getByDot } = require('feathers-hooks-common');
const { isEmpty } = require('lodash');

module.exports = () => async hook => {

  const userId = getByDot(hook, 'params.user._id') || getByDot(hook, 'data.userId');

  const promises = [];

  const inc = hook.method === 'remove' ? -1 : 1;

  let result = Array.isArray(hook.result) ? hook.result[0] : hook.result;

  if (!isEmpty(result)) {
    // set count on user service
    promises.push(new Promise(async (resolve) => {
      try {
        const query = {$inc: {}};
        query.$inc['followingCounts.users'] = inc;
        following = await hook.app.service('users')
          .patch(userId, query);

        resolve();
      } catch (err) {
        hook.app.error(err);
        resolve();
      }
    }));

    // set count on foreign service
    promises.push(new Promise(async (resolve) => {
      try {
        const query = {$inc: {}};
        query.$inc['followersCounts.users'] = inc;
        followers = await hook.app.service(result.foreignService)
          .patch(result.foreignId, query);

        resolve();
      } catch (err) {
        hook.app.error(err);
        resolve();
      }
    }));
    await Promise.all(promises);
  }

  return hook;
};
