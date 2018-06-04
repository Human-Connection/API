/* eslint-disable */
// https://github.com/yangsibai/node-html-excerpt
// const excerpt = require('html-excerpt');

const sanitizeHtml = require('sanitize-html');
const trunc = require('trunc-html');
const { getByDot, setByDot } = require('feathers-hooks-common');
const { isEmpty } = require('lodash');

const sanitizeOptions = {
  allowedTags: [ 'br', 'a', 'p' ]
};

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {

    options = Object.assign({ length: 120, field: 'content' }, options);

    let content = getByDot(hook.data, options.field);

    if(!hook.data || isEmpty(content)) {
      return hook;
    }

    try {
      /* eslint no-use-before-define: 0 */  // --> OFF
      let contentSanitized = sanitizeHtml(content, sanitizeOptions)
      .replace(/\<br\s*\>|\<br\s*\/\>/ig, "\n")
      .replace(/(\ ){2,}/ig, ' ')
      .trim();

      contentSanitized = trunc(contentSanitized, options.length).html;

      setByDot(hook.data, 'hasMore', contentSanitized.length < content.length);

      // set excerpt
      setByDot(hook.data, `${options.field}Excerpt`, contentSanitized)
    } catch (err) {
      hook.app.error(err);
      throw new Error(err);
    }
    // trim content
    setByDot(hook.data, options.field, content.replace(/(\ ){2,}/ig, ' '));

    return hook;
  };
};
