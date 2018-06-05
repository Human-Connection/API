/* eslint-disable */
// https://github.com/yangsibai/node-html-excerpt
// const excerpt = require('html-excerpt');

const sanitizeHtml = require('sanitize-html');
const trunc = require('trunc-html');
const { getByDot, setByDot } = require('feathers-hooks-common');
const { isEmpty } = require('lodash');

const sanitizeOptions = {
  allowedTags: ['p', 'br', 'a', 'span', 'blockquote'],
  allowedAttributes: {
    a: ['href', 'class', 'target', 'data-*' , 'contenteditable'],
    span: ['contenteditable', 'class', 'data-*']
  },
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

      contentBefore = trunc(content, 9999999999);
      const contentTruncated = trunc(contentSanitized, options.length);
      hook.app.debug('contentBefore');
      hook.app.debug(contentBefore.text.length);
      hook.app.debug('contentTruncated');
      hook.app.debug(contentTruncated.text.length);

      const hasMore = contentBefore.text.length > (contentTruncated.text.length + 20);
      setByDot(hook.data, 'hasMore', hasMore);

      // set excerpt
      setByDot(hook.data, `${options.field}Excerpt`, hasMore ? contentTruncated.html : content.replace(/(\ ){2,}/ig, ' '))
    } catch (err) {
      throw new Error(err);
    }
    // trim content
    setByDot(hook.data, options.field, content.replace(/(\ ){2,}/ig, ' '));

    return hook;
  };
};
