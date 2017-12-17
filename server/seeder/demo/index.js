// These seeders are only used during development
// Use them to seed fake users, contributions, etc.

module.exports = function () {
  // Add your seeder configs here
  return [
    require('./contributions'),
    require('../development/emotions')
  ];
};
