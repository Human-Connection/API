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
      if (hook.method === 'find' && (!hook.params.query || hook.params.query.$limit !== 1)) {
        return resolve(hook);
      }

      // Stop, if we have an empty array or more then one item
      let isArray = hook.result.data && Array.isArray(hook.result.data);
      if (isArray && (!hook.result.data.length || hook.result.data.length > 1)) {
        return resolve(hook);
      }

      let currentData = isArray ? hook.result.data[0] : hook.result;
      if (!currentData.categoryIds || !currentData.categoryIds.length) {
        return resolve(hook);
      }

      return contributionService.find({
        query: {
          type: 'cando'
        }
      })
        .then(({data}) => {
          let associatedCanDos = [];
          let categoryIds = currentData.categoryIds;
          if (categoryIds && categoryIds.length) {
            while (associatedCanDos.length < limit && data.length) {
              let item = data.shift();
              let check = categoryIds.some(category => {
                return item.categoryIds.includes(category);
              });
              if (check && item._id.toString() !== currentData._id.toString()) {
                associatedCanDos.push(item);
              }
            }
          }
          if (isArray) {
            hook.result.data[0].associatedCanDos = associatedCanDos;
          } else {
            hook.result.associatedCanDos = associatedCanDos;
          }
          return resolve(hook);
        })
        .catch(() => {
          return resolve(hook);
        });
    });
  };
};
