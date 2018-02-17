// Set done date, when cando is done
module.exports = () => async hook => {

  // get count of all shouts on this thing
  const shoutCount = await hook.app.service('shouts').find({
    query: {
      foreignService: hook.result.foreignService,
      foreignId: hook.result.foreignId,
      $limit: 0
    }
  });

  // update the shoud count on the foreign service
  await hook.app.service(hook.result.foreignService)
    .patch(hook.result.foreignId, {
      $set: {
        shoutCount: shoutCount.total
      }
    });

  return hook;
};
