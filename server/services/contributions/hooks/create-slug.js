// https://www.npmjs.com/package/slug
const slug = require('slug');
const getUniqueSlug = require('../../../helper/get-unique-slug');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    return new Promise(resolve => {
      const contributions = hook.app.service('contributions');
      const titleslug = slug(hook.data.title, {
        lower: true
      });

      getUniqueSlug(contributions, titleslug).then((uniqueslug) => {
        hook.data.slug = uniqueslug;
        resolve(hook);
      });
    });
  };
};
