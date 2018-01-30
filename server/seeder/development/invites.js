const seedHelpers = require('../../helper/seed-helpers');
const random = require('lodash/random');

function genCode () {
  const chars = '23456789abcdefghkmnpqrstuvwxyzABCDEFGHJKLMNPRSTUVWXYZ'; 
  let code = '';
  for (let i = 0; i < 8; i++) {
    const n = random(0, chars.length-1);
    code += chars.substr(n, 1);
  }
  return code;
}

// eslint-disable-next-line no-unused-vars
module.exports = (seederstore) => {
  return {
    services: [{
      path: 'invites',
      count: 10,
      template: {
        email: '{{internet.email}}',
        code: () => genCode(),
        badgeIds: () => seedHelpers.randomItems(seederstore.badges, '_id', 0, seederstore.badges.length),
        wasSeeded: true
      }
    }]
  };
};