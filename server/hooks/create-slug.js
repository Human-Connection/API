// https://www.npmjs.com/package/slug
const slug = require('slug');
const getUniqueSlug = require('../helper/get-unique-slug');

module.exports = function (options = { field: null }) {
  return function (hook) {
    if(!options.field) return hook;

    return new Promise(resolve => {
      const titleslug = slug(hook.data[options.field], {
        lower: true
      });

      getUniqueSlug(hook.service, titleslug).then((uniqueslug) => {
        hook.data.slug = uniqueslug;
        resolve(hook);
      });
    });
  };
};
