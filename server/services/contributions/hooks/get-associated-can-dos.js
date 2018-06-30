module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    return new Promise(resolve => {
      const contributionService = hook.app.service('contributions');
      const limit = 5;

      // Stop, if we have no result at all
      if (!hook.result) {
        return resolve(hook);
      }

      // Stop, if it was a find method and $limit was not set
      if (hook.method === 'find' && (!hook.params.query || (hook.params.query.$limit !== 1 && !hook.params.query.slug))) {
        return resolve(hook);
      }

      // Stop, if we have an empty array or more then one item
      let isArray = hook.result.data && Array.isArray(hook.result.data);
      if (isArray && (!hook.result.data.length || hook.result.data.length > 1)) {
        return resolve(hook);
      }

      let currentData = isArray ? hook.result.data[0] : hook.result;
      let categoryIds = currentData.categoryIds;
      if (!categoryIds || !categoryIds.length) {
        return resolve(hook);
      }

      return contributionService.find({
        query: {
          type: 'cando',
          isEnabled: true,
          categoryIds: {
            $in: categoryIds
          },
          $limit: limit,
        },
        _populate: 'skip'
      })
        .then(({data}) => {
          if (isArray) {
            hook.result.data[0].associatedCanDos = data;
          } else {
            hook.result.associatedCanDos = data;
          }
          return resolve(hook);
        })
        .catch(err => {
          // eslint-disable-next-line
          console.log(err);
          hook.app.error('issue while fetching associated candos');
          return resolve(hook);
        });
    });
  };
};
