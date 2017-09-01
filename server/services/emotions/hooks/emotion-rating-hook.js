// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function(options = {}) { // eslint-disable-line no-unused-vars
  return function(hook) {

    if (!hook.result || hook.method !== 'create') {
      console.log('ERROR', hook.method);

      throw new Error('FAILED');
    }

    return new Promise(resolve => {
      // try to get
      const contributionService = hook.app.service('contributions');

      // remove all other votes from current user on that contribution
      let putQuery = {
        $inc: {
          'emotions.funny': 0,
          'emotions.happy': 0,
          'emotions.surprised': 0,
          'emotions.cry': 0,
          'emotions.angry': 0
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

      console.log('removeQuery');
      console.log(removeQuery);

      hook.service.remove(null, { query: removeQuery })
        .then(items => {
          items.forEach(item => {
            // set the decrement values for removed types
            putQuery.$inc[`emotions.${item.rated}`] -= 1;
          });
          putQuery.$inc[`emotions.${hook.result.rated}`] += 1;

          contributionService.patch( hook.result.contributionId, putQuery);
        });

      resolve(hook);
    });
  };
};
