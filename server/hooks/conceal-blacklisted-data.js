const alterItems = require('../helper/alter-items');

const defaults = {
  data: {
    content: 'You have blacklisted this user'
  }
};

module.exports = (options = defaults) => alterItems(handleItem(options));

const handleItem = options => item => {
  item = {...item, ...options.data};
  return item;
};
