// Kick out every duplicate user
const alterItems = require('../../../helper/alter-items');

module.exports = () => alterItems(handleItem);

const handleItem = item => {
  if (item.users) {
    let ids = [];
    item.users = item.users.filter(user => {
      if (ids.includes(user.id)) {
        return false;
      }
      ids.push(user.id);
      return true;
    });
  }
  return item;
};