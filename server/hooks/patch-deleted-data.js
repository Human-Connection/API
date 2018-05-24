// Patch deleted records with given data
const alterItems = require('../helper/alter-items');

const defaults = {
  data: {
    content: 'DELETED'
  }
};

module.exports = (options = defaults) => alterItems(handleItem(options));

const handleItem = options => item => {
  if (item.deleted) {
    item = {...item, ...options.data};
  }
  return item;
};