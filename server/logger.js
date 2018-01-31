const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: 'info',
  format: format.json(),
  transports: [
    new transports.File({ filename: './data/error.log', level: 'error' }),
    new transports.File({ filename: './data/combined.log' })
  ]
});
// if (process.env.NODE_ENV !== 'production') {
logger.add(new transports.Console({
  format: format.combine(
    format.printf((info) => {
      const date = new Date();
      const levelColors = {
        info: '',
        debug: '\u001b[34m',
        warning: '\u001b[33m',
        error: '\u001b[31m'
      };
      return `${levelColors[info.level]}${date.toLocaleTimeString()} | ${info.level}: ${JSON.stringify(info.message)}\u001b[39m`;
    })
  ),
  level: 'debug'
}));
// }

module.exports = logger;
