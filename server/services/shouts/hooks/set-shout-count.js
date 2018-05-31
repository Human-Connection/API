const { getItems } = require('feathers-hooks-common');
const { asyncForEach } = require('../../../helper/seed-helpers');

module.exports = () => async (hook) => {
  let items = getItems(hook);
  if (!Array.isArray(items)) {
    items = [items];
  }
  await asyncForEach(items, async (result) => {
    // get count of all shouts on this thing
    const shoutCount = await hook.app.service('shouts').find({
      query: {
        foreignService: result.foreignService,
        foreignId: result.foreignId,
        $limit: 0
      }
    });
    // update the shout count on the foreign service
    try {
      await hook.app.service(result.foreignService)
        .patch(result.foreignId, {
          $set: {
            shoutCount: shoutCount.total
          }
        });
    } catch (err) {
      hook.app.error(`issue setting shout count on '${result.foreignService}' with id '${result.foreignId}'`);
      hook.app.error(err);
    }
  });
  return hook;
};
