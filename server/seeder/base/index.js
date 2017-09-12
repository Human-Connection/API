// These seeders are used for
// production as well as for development
// Use them to seed basic data, such as categories

const categories = require('./categories');

// Add your seeder configs here
let configs = [
  categories
];

configs = configs.map(config => {
  config.delete = false;
  config.disabled = false;
  return config;
});

module.exports = configs;
