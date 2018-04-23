const { getItems, replaceItems, getByDot, setByDot } = require('feathers-hooks-common');
const { isEmpty } = require('lodash');

module.exports = () => async hook => {

  const userId = getByDot(hook, 'params.user._id') || getByDot(hook, 'data.userId');

  // get count of all follows currently followed service
  // const followersCount = await hook.app.service('follows').find({
  //   query: {
  //     foreignId: hook.data.userId,
  //     foreignService: hook.data.foreignService,
  //     $limit: 0
  //   }
  // });
  // // get count of all following services of current user
  // const followingCount = await hook.app.service('follows').find({
  //   query: {
  //     userId: hook.data.userId,
  //     foreignService: hook.data.foreignService,
  //     $limit: 0
  //   }
  // });

  const promises = [];

  let following = {};
  let followers = {};

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

  // const output = Object.assign(this.data || {}, result);

  // replaceItems(hook, {
  //   _id: output._id,
  //   userId: output.userId,
  //   foreignId: output.foreignId,
  //   foreignService: output.foreignService
  //   // followers: followers.total,
  //   // following: following.total
  // });

  // console.log(typeof hook.result);
  // hook.result = Object.assign(hook.result[0], {
  //   followersCount: followersCount.total,
  //   followingCount: followingCount.total
  // });
  // console.log(hook.result);

  return hook;
};
