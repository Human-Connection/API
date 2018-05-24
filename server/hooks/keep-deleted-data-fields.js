// Remove data from deleted items
const alterItems = require('../helper/alter-items');

const defaults = {
  fields: [
    '_id',
    'deleted',
    'createdAt',
    'updatedAt'
  ]
};

module.exports = (options = defaults) => alterItems(handleItem(options));

const handleItem = options => item => {
  if (item.deleted) {
    Object.keys(item).forEach(key => {
      if (!options.fields.includes(key)) {
        delete item[key];
      }
    });
  }
  return item;
};