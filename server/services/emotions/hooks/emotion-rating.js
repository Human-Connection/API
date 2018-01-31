// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const _ = require('lodash');

// calculate percent of current vote constalations
let calculatePercentValues = function(contribution) {
  const keys = _.keys(contribution.emotions);
  let sum = 0;
  keys.forEach(key => {
    sum += contribution.emotions[key].count;
  });
  keys.forEach(key => {
    contribution.emotions[key].percent = ( contribution.emotions[key].count / sum ) * 100;
  });
};

module.exports = function(options = {}) { // eslint-disable-line no-unused-vars
  return function(hook) {

    if (!hook.result || hook.method !== 'create') {
      return hook;
    }

    return new Promise(resolve => {
      // try to get
      const contributionService = hook.app.service('contributions');

      // remove all other votes from current user on that contribution
      let putQuery = {
        $inc: {
          'emotions.funny.count': 0,
          'emotions.happy.count': 0,
          'emotions.surprised.count': 0,
          'emotions.cry.count': 0,
          'emotions.angry.count': 0
        }
      };

      // if we creating a new entry, we have to make sure to remove the old vote
      // TODO: find a more elegante way to do that!?

      let removeQuery = {
        contributionId: hook.result.contributionId,
        userId: hook.result.userId,
        _id: {
          $ne: hook.result._id
        }
      };

      hook.service.remove(null, { query: removeQuery })
        .then(items => {
          items.forEach(item => {
            // set the decrement values for removed types
            putQuery.$inc[`emotions.${item.rated}.count`] -= 1;
          });
          putQuery.$inc[`emotions.${hook.result.rated}.count`] += 1;

          contributionService.patch( hook.result.contributionId, putQuery)
            .then(contribution => {

              calculatePercentValues(contribution);

              contributionService.patch( hook.result.contributionId, {
                $set: {
                  emotions: contribution.emotions
                }
              }).then(() => {
                resolve(hook);
              });
            });
        });
    });
  };
};
