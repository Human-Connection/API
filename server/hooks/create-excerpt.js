/* eslint-disable */

// https://github.com/yangsibai/node-html-excerpt
const excerpt = require('html-excerpt');

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
      .replace(/\<br\>|\<\/br\>|\<\/ br\>|<br \/\>|\<\/(strong|b|h[1-6])>/ig, "\n")
      .replace(/(<([^>]+)>)/ig, '');
    hook.data[`${options.field}Excerpt`] = excerpt.text(text, options.length, '...');
    return Promise.resolve(hook);
  };
};