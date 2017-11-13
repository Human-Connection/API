// These seeders are only used during development
// Use them to seed fake users, contributions, etc.

module.exports = function () {
  // Add your seeder configs here
  return [
    require('./users-admin'),
    require('./users'),
    require('./contributions'),
    require('./organizations'),
    require('./projects'),
    require('./follows'),
    require('./comments')
  ];
};
