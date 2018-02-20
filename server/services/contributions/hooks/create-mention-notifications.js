// Create user mention notifications for contribution
const logger = require('winston');
const getMentions = require('../../../helper/get-mentions');

module.exports = function() {
  return function (hook) {
    return new Promise(async (resolve, reject) => {
      if (hook.result === undefined) {
        return reject('Make sure to run this as an after hook.');
      }

      // Check required fields
      if(!hook.result.content || !hook.result._id || !hook.result.userId) {
        resolve(hook);
        return false;
      }

      const contribution = hook.result;
      const creatorId = hook.result.userId;

      let mentions = await getMentions(hook.app, contribution.content);

      // Exit if no user mentions were found
      if (!mentions) {
        return resolve(hook);
      }

      const notifications = [];

      hook.data.userMentions = {};
      Object.keys(mentions).forEach(id => {
        // Don't notify creator
        if (id !== creatorId) {
          // Save user mention ids for later comparison
          hook.data.userMentions[id] = true;

          notifications.push({
            userId: id,
            type: 'contribution-mention',
            relatedUserId: creatorId,
            relatedContributionId: contribution._id
          });
        }
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
