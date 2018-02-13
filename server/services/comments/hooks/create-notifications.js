module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    return new Promise(resolve => {
      const notificationService = hook.app.service('notifications');
      const contributionService = hook.app.service('contributions');

      // Check required fields
      if(!hook.result || !hook.result._id || !hook.result.userId || !hook.result.contributionId) {
        resolve(hook);
        return false;
      }

      const commentId = hook.result._id;
      const contributionId = hook.result.contributionId;
      const creatorId = hook.result.userId;

      contributionService.get(contributionId)
        .then(result => {
          const userId = result.userId;

          // Only create notification for users other than creator
          // and only if user has not already been sent a mention
          // notification by previous hook
          if(userId == creatorId || (hook.data.userMentions && hook.data.userMentions[userId])) {
            resolve(hook);
            return false;
          }

          const notification = {
            userId: userId,
            type: 'comment',
            relatedUserId: creatorId,
            relatedContributionId: contributionId,
            relatedCommentId: commentId,
          };

          notificationService.create(notification)
            .then(resolve(hook))
            .catch(() => {
              resolve(hook);
            });
        })
        .catch(() => {
          resolve(hook);
        });
    });
  };
};
