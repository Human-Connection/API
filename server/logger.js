const { createLogger, format, transports } = require('winston');
const env = process.env.NODE_ENV;

const logger = createLogger({
  level: 'warn',
  format: format.json(),
  transports: [
    new transports.File({ filename: './data/error.log', level: 'error' }),
    new transports.File({ filename: './data/combined.log' })
  ]
});
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
  level: env === 'development' ? 'debug' : 'warn'
}));
module.exports = logger;
