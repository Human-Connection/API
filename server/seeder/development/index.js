// These seeder configs are only used during development
// Use them to seed fake users, contributions, etc.

const userContributions = require('./user-contributions');

// Add your configs here
let configs = [
  userContributions
]

configs = configs.map(config => {
  config.delete = false;
  // Only enable in development
  config.disabled = process.env.NODE_ENV !== 'development';
  return config;
});

module.exports = configs;
