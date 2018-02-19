/* eslint-disable */

// https://github.com/yangsibai/node-html-excerpt
// const excerpt = require('html-excerpt');
const trunc = require('trunc-html');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    if(!hook.data || !hook.data.content) {
      return hook;
    }
    /* eslint no-use-before-define: 0 */  // --> OFF
    const content = hook.data.content
      .replace(/\<br\>|\<\/br\>|\<\/ br\>|\<br\>|\<br\\\>|\<p\>|\<\/p\>/ig, "\n")
      .replace(/\<(strong|b|i|blockquote|pre|em|u|h[1-6])>|\<\/(strong|b|i|blockquote|pre|em|u|h[1-6])>/ig, '')
      .replace(/\<p\>\<br\>\<\/p\>/ig, ' ')
      .replace(/(\ )[2,]/ig, ' ')
      .trim();
    hook.data.contentExcerpt = trunc(content, 120, {
      ignoreTags: ['img', 'script']
    }).html;

    hook.data.content = hook.data.content
      .replace(/(\ )[2,]/ig, ' ')
    return Promise.resolve(hook);
  };
};