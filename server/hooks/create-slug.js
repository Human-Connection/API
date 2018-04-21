// https://www.npmjs.com/package/slug
const slug = require('slug');
const getUniqueSlug = require('../helper/get-unique-slug');
const { isEmpty } = require('lodash');

module.exports = function (options = { field: null, overwrite: false }) {
  return function (hook) {
    if (!options.field || !hook.data[options.field]) return hook;

    // do not overwrite existing slug
    // TODO: we should make that possible and relying on ids for routing instead only on slugs
    // the slug should be there for seo reasons but the id should be what counts
    if (!isEmpty(hook.data.slug) && options.overwrite !== true) return hook;

    return new Promise(resolve => {
      const titleSlug = slug(hook.data[options.field], {
        lower: true
      });
      getUniqueSlug(hook.service, titleSlug, null, hook.id)
        .then((uniqueSlug) => {
          hook.data.slug = uniqueSlug;
          resolve(hook);
        });
    });
  };
};
