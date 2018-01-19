// https://github.com/yangsibai/node-html-excerpt
const excerpt = require('html-excerpt');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    if(!hook.data || !hook.data.content) {
      return hook;
    }
    const content = hook.data.content
      .replace(/\<br\>|\<\/br\>|\<\/ br\>|\<\/(strong|b|h[1-6])>/ig, "\n")
      .replace(/(<([^>]+)>)/ig, '');
    hook.data.contentExcerpt = excerpt.text(content, 120, '...');
    return Promise.resolve(hook);
  };
};