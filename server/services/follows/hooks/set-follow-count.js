module.exports = () => async hook => {

  // get count of all follows currently followed service
  const followersCount = await hook.app.service('follows').find({
    query: {
      foreignId: hook.data.userId,
      foreignService: hook.data.foreignService,
      $limit: 0
    }
  });

  // get count of all following services of current user
  const followingCount = await hook.app.service('follows').find({
    query: {
      userId: hook.data.userId,
      foreignService: hook.data.foreignService,
      $limit: 0
    }
  });

  const promises = [];

  // set count on user service
  promises.push(new Promise(async (resolve) => {
    try {
      const query = {$set: {}};
      query.$set[`followingCounts.${hook.data.foreignService}`] = followingCount.total;
      await hook.app.service('users')
        .patch(hook.data.userId, query);

      resolve();
    } catch (err) {
      console.error(err);
      resolve();
    }
  }));

  // set count on foreign service
  promises.push(new Promise(async (resolve) => {
    try {
      const query = {$set: {}};
      query.$set[`followersCounts.${hook.data.foreignService}`] = followersCount.total;
      await hook.app.service('users')
        .patch(hook.data.userId, query);

      resolve();
    } catch (err) {
      console.error(err);
      resolve();
    }
  }));

  await Promise.all(promises);

  // console.log(typeof hook.result);
  // hook.result = Object.assign(hook.result[0], {
  //   followersCount: followersCount.total,
  //   followingCount: followingCount.total
  // });
  // console.log(hook.result);

  return hook;
};
