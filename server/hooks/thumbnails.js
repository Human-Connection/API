/**
 * Hoot which generates signed thumbor urls
 * The url is taken from the field and then
 * combined with the options and signed with the
 * SECURITY_KEY which is configured under thumbor.key
 */

const _ = require('lodash');

/**
 * @param options
 * {
 *   logo: {
 *     medium: '400x0',
 *     cover: '200x200/trim/smart',
 *     placeholder: '100x0/filters:blur(30)'
 *   },
 *   avatar: {
 *     medium: '100x100/smart'
 *   }
 * }
 * @description
 *   - The object keys are the model fields that contains the image urls
 *   - There inside are the configuration keys and the thumbor operation string
 *     for generating the correct urls for the given opteration which will be signed
 *     to prevent attacs on the thumbnail service
 * @returns {Function}
 */
module.exports = function (options) {
  return function (hook) {
    const ThumborUrlHelper = require('../helper/thumbor-helper');
    // init url generator
    const config = hook.app.get('thumbor');
    const Thumbor = new ThumborUrlHelper(config.key || null, config.url || null);
    return new Promise(resolve => {
      const data = !_.isEmpty(hook.result.data) ? hook.result.data : hook.result;

      _.castArray(data).forEach(result => {
        // skip on no result
        if (!_.isObject(result)) {
          return;
        }
        // add thumbnails object
        result.thumbnails = {};
        // try to generate thumnail urls for every field specefied in options
        _.keys(options).forEach(field => {
          // skip of no image was found
          if (!result || _.isEmpty(result[field])) {
            return;
          }
          // prepare thumbnails object
          result.thumbnails[field] = {};
          // generate a urls for every specefied size
          _.keys(options[field]).forEach(size => {
            if (!_.isEmpty(config.url)) {
              // use the thumbor operations to create the thumbnail url
              result.thumbnails[field][size] = Thumbor
                .setImagePath(result[field])
                .buildUrl(options[field][size]);
            } else {
              // fallback to original image when no configuration is specefied
              result.thumbnails[field][size] = result[field];
            }
          });
        });
      });
      resolve(hook);
    });
  };
};
