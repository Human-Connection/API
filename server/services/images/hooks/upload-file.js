module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    return new Promise(resolve => {
      const uploadService = hook.app.service('uploads');
      const file = hook.params.file;

      if(!file) {
        resolve(hook);
      }

      uploadService.create(contributionId)
        .then(result => {
          const userId = result.userId;
          let name = hook.result.user.name;
          name = name !== undefined ? name : 'Someone';

          // Only create notification for other users
          if(userId == hook.result.userId) {
            resolve(hook);
            return false;
          }

          const notification = {
            userId: userId,
            message: `${name} has commented your contribution.`,
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
