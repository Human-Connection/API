/* eslint-disable */

// https://github.com/yangsibai/node-html-excerpt
// const excerpt = require('html-excerpt');
const trunc = require('trunc-html');

module.exports = function (options = {
  field: 'content',
  length: 120
}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    console.log('TRY TO CREATE EXCERPT');
    console.log('field', options.field);
    if(!options.field || !hook.data[options.field]) return hook;

    if(!hook.data || !hook.data[options.field]) {
      return hook;
    }
    /* eslint no-use-before-define: 0 */  // --> OFF
    const text = hook.data[options.field]
      .replace(/\<br\>|\<\/br\>|\<\/ br\>|\<br\>|\<br\\\>|\<p\>|\<\/p\>/ig, "\n")
      .replace(/\<(strong|b|i|blockquote|pre|em|u|h[1-6])>|\<\/(strong|b|i|blockquote|pre|em|u|h[1-6])>/ig, '')
      .replace(/\<p\>\<br\>\<\/p\>/ig, ' ')
      .replace(/(\ )[2,]/ig, ' ')
      .trim();
    hook.data[`${options.field}Excerpt`] = trunc(text, options.length, {
      ignoreTags: ['img', 'script']
    }).html;

    hook.data[options.field] = hook.data[options.field]
      .replace(/(\ )[2,]/ig, ' ')
    return Promise.resolve(hook);
  };
};