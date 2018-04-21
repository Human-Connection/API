/* eslint-disable */
// https://github.com/yangsibai/node-html-excerpt
// const excerpt = require('html-excerpt');

const sanitizeHtml = require('sanitize-html');
const trunc = require('trunc-html');

const sanitizeOptions = {
  allowedTags: [ 'br' ]
};

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {

    options = Object.assign({ length: 120, field: 'content' }, options);

    if(!hook.data || !hook.data[options.field]) {
      return hook;
    }

    try {
      /* eslint no-use-before-define: 0 */  // --> OFF
      const content = sanitizeHtml(hook.data[options.field], sanitizeOptions)
      .replace(/\<br\s*\>|\<br\s*\/\>/ig, "\n")
      .replace(/(\ ){2,}/ig, ' ')
      .trim();
      hook.data[`${options.field}Excerpt`] = trunc(content, options.length, {
        ignoreTags: ['img', 'script', 'iframe']
      }).html;
    } catch (err) {
      throw new Error('Text content needed!');
    }
    hook.data[options.field] = hook.data[options.field]
      .replace(/(\ ){2,}/ig, ' ')

    return Promise.resolve(hook);
  };
};
