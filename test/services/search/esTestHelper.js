module.exports = {
  appMock (enableES = true) {

    return {
      get: function(param) {
        //logger.info("param:" + param);
        if ('elasticsearch' === param) {
          return {
            enable: enableES
          };
        }
      }
    };
  }
};