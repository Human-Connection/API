// Populate user data on organization users
const alterItems = require('../../../helper/alter-items');

module.exports = () => alterItems(handleItem);

// Really impressed, that this works, as alterItems is not async
const handleItem = async (item, hook) => {
  if (item.users) {
    const userIds = item.users.map(user => user.id);
    const result = await hook.app.service('users').find({
      query: {
        _id: {
          $in: userIds
        }
      },
      _populate: 'skip'
    });
    const usersData = result.data;
    if (!usersData) {
      return item;
    }
    item.users = item.users.map(user => {
      const userData = usersData.find(
        data => data._id.toString() === user.id.toString()
      );
      user.name = userData.name;
      user.slug = userData.slug;
      user.avatar = userData.avatar;
      return user;
    });
  }
  return item;
};