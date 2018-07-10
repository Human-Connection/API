const { keys } = require('lodash');

module.exports = (seederstore) => {
  return {
    services: [{
      // Create test user
      path: 'users',
      randomize: false,
      templates: [{
        email: 'test@test.de',
        password: '1234',
        name: 'Peter',
        slug: 'peter',
        timezone: 'Europe/Berlin',
        avatar: '{{internet.avatar}}',
        coverImg: 'https://source.unsplash.com/random/1250x280',
        badgeIds: () => {
          let badges = [keys(seederstore.badges)[0]];
          if (process.env.NODE_ENV !== 'production') {
            badges.push(keys(seederstore.badges)[5]);
            badges.push(keys(seederstore.badges)[10]);
            badges.push(keys(seederstore.badges)[16]);
          }
          return badges;
        },
        role: 'admin',
        doiToken: null,
        confirmedAt: null,
        deletedAt: null
      },
      {
        email: 'test2@test2.de',
        password: '1234',
        name: 'Hans',
        slug: 'hans',
        timezone: 'Europe/Berlin',
        avatar: '{{internet.avatar}}',
        coverImg: 'https://source.unsplash.com/random/1250x280',
        role: 'moderator',
        badgeIds: () => [keys(seederstore.badges)[1]],
        doiToken: null,
        confirmedAt: null,
        deletedAt: null
      },
      {
        email: 'test3@test3.de',
        password: '1234',
        name: 'Sepp',
        slug: 'sepp',
        timezone: 'Europe/Berlin',
        avatar: '{{internet.avatar}}',
        coverImg: 'https://source.unsplash.com/random/1250x280',
        role: 'user',
        badgeIds: () => [keys(seederstore.badges)[1]],
        doiToken: null,
        confirmedAt: null,
        deletedAt: null
      }]
    }]
  };
};
