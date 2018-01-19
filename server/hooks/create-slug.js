// https://www.npmjs.com/package/slug
const slug = require('slug');
const getUniqueSlug = require('../helper/get-unique-slug');
const _ = require('lodash');

module.exports = function (options = { field: null }) {
  return function (hook) {
    if(!options.field || !hook.data[options.field]) return hook;

    // do not overwrite existing slug
    // TODO: we should make that possible and relying on ids for routing insead only on slugs
    // the slug should be there for seo reasons but the id should be what counts
    if (!_.isEmpty(hook.data.slug)) return hook;

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
