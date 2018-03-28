/* eslint-disable */

// https://github.com/yangsibai/node-html-excerpt
// const excerpt = require('html-excerpt');
const trunc = require('trunc-html');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {

    options = Object.assign({ length: 120, field: 'content' }, options);

    if(!hook.data || !hook.data[options.field]) {
      return hook;
    }

    try {
      /* eslint no-use-before-define: 0 */  // --> OFF
      const content = hook.data[options.field]
      // TODO: use html-sanatize package
      .replace(/\<br\>|\<\/br\>|\<\/ br\>|\<br\>|\<br\\\>|\<p\>|\<\/p\>/ig, "\n")
      .replace(/\<(strong|b|i|blockquote|pre|em|u|h[1-6]|a)>|\<\/(strong|b|i|blockquote|pre|em|u|h[1-6]|a)>/ig, '')
      .replace(/\<p\>\<br\>\<\/p\>/ig, ' ')
      .replace(/(\ )[2,]/ig, ' ')
      .trim();
      hook.data[`${options.field}Excerpt`] = trunc(content, options.length, {
        ignoreTags: ['img', 'script', 'iframe']
      }).html;
    } catch (err) {
      if (hook.data.teaserImg) {
        hook.data[`${options.field}Excerpt`] = '-----';
      } else {
        throw new Error('Text content needed!');
      }
    }
    hook.data[options.field] = hook.data[options.field]
      .replace(/(\ )[2,]/ig, ' ')

    return Promise.resolve(hook);
  };
};
