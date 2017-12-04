const ESHelpers = {
  appMock (enableES) {

    return {
      get: function(param) {
        if ('elasticsearch' === param) {
          return {
            enable: !!enableES
          };
        }
      },
      log: function(...msg) {
        console.log(msg);
      },
      info: function(...msg) {
        console.info(msg);
      },
      debug: function(...msg) {
        console.debug(msg);
      },
      error: function(...msg) {
        console.error(msg);
      }
    };
  },

  ESMock: class {
    constructor() {
      this.deleteParam = '';
    }

    delete(param) {
      ESHelpers.appMock().debug('ESMock.delete:' + JSON.stringify(param));
      this.deleteParam = param;
      return 0;
    }

    getDeleteParam() {
      return this.deleteParam;
    }
  },

  esClientMock: () => {
    return {
      function(param) {
        ESHelpers.appMock().debug('DELETE call at mock detected:' + param);
      }
    };
  }
};

module.exports = ESHelpers;