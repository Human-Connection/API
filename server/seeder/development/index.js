// These seeders are only used during development
// Use them to seed fake users, contributions, etc.

module.exports = function () {
  // Add your seeder configs here
  return [
    require('./users'),
    require('./moderators'),
    require('./contributions'),
    require('./organizations'),
    require('./candos'),
    require('./users-candos'),
    require('./projects'),
    require('./follows'),
    require('./comments'),
    require('./emotions'),
    require('./invites')
  ];
};
