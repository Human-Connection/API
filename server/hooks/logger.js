// A hook that logs service method before, after and error

module.exports = function () {
  return function (hook) {
    let message = `${hook.type}: ${hook.path} - Method: ${hook.method}`;

    if (hook.type === 'error') {
      message += `: ${hook.error.message}`;
    }

    hook.app.info(message);
    // hook.app.debug({
    //   hook:
    //   {
    //     data: hook.data,
    //     params: hook.params
    //   }
    // });

    // if (hook.result) {
    //   hook.app.debug('hook.result', hook.result);
    // }

    // if (hook.error) {
    //   hook.app.error(hook.error);
    // }
  };
};
