const { getItems, replaceItems } = require('feathers-hooks-common');

/**
 * Alter items in hook.data or hook.result
 *
 * Example usage in hook module:
 * module.exports = (options = defaults) => alterItems(handleItem(options));
 *
 * handleItem() is the function in which changes are made
 */
module.exports = func => hook => {
  if (!func || typeof func !== 'function') {
    return hook;
  }
  let items = getItems(hook);
  if (Array.isArray(items)) {
    items = items.map(item => func(item, hook));
  } else if (items) {
    items = func(items, hook);
  }
  replaceItems(hook, items);
  return hook;
};
