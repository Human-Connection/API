// notify followers for contribution
const logger = require('winston');

module.exports = function () {
  return function (hook) {
    return new Promise(async (resolve, reject) => {
      if (hook.result === undefined) {
        return reject('Make sure to run this as an after hook.');
      }

      // Check required fields
      if (!hook.result.content || !hook.result._id || !hook.result.userId) {
        resolve(hook);
        return false;
      }

      const contribution = hook.result;
      const creatorId = hook.result.userId;

      // get all followers
      const followers = await hook.app.service('follows').find({
        query: {
          $limit: 1000,
          foreignService: 'users',
          foreignId: creatorId
        }
      });

      const notifications = [];

      // inform all followers
      followers.data.forEach(follower => {
        notifications.push({
          userId: follower.userId,
          type: 'following-contribution',
          relatedUserId: creatorId,
          relatedContributionId: contribution._id
        });
      });

      if (!notifications.length) {
        return resolve(hook);
      }

      return hook.app.service('notifications').create(notifications)
        .then(() => {
          resolve(hook);
        })
        .catch(error => {
          logger.error(error);
          resolve(hook);
        });
    });
  };
};
