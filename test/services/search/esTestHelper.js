const winston = require('winston');
const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console()
  ]
});




const ESHelpers = {
  appMock(enableES) {

    return {
      get: function (param) {
        if ('elasticsearch' === param) {
          return {
            enable: !!enableES
          };
        }
      },
      log: function (...msg) {
        logger.log(msg);
      },
      info: function (...msg) {
        logger.info(msg);
      },
      debug: function (...msg) {
        logger.debug(msg);
      },
      error: function (...msg) {
        logger.error(msg);
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