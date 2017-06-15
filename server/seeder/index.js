// Database Seeder

// See https://www.npmjs.com/package/feathers-seeder
// Using faker models https://github.com/marak/Faker.js/

const seeder = require('feathers-seeder');

module.exports = function () {
  const options = {
    delete: true,
    // Disable, if we are not in production
    disabled: process.env.NODE_ENV === 'production',
    services: [
      {
        // Create 10 user
        path: 'users',
        count: 10,
        template: {
          email: '{{internet.email}}',
          password: '{{internet.password}}',
          username: '{{name.firstName}} {{name.lastName}}',
          slug: '{{lorem.slug}}',
          gender: '',
          isnothere: 'true',
          firstname: '{{name.firstName}}',
          lastname: '{{name.lastName}}',
          timezone: 'Europe/Berlin',
          avatar: {
            large: '{{internet.avatar}}',
            small: '{{internet.avatar}}',
            medium: '{{internet.avatar}}'
          },
          doiToken: null,
          confirmedAt: null,
          deletedAt: null
        },

        callback(user, seed) {
          // Create 5 contributions for each user
          return seed({
            count: 1,
            path: 'contributions',
            templates: [
              {
                userId: () => user._id,
                title: '{{lorem.sentence}}',
                slug: '{{lorem.slug}}',
                type: 'post',
                content: '{{lorem.text}}',
                contentExcerpt: '{{lorem.sentence}} {{lorem.sentence}}',
                teaserImg: '{{random.image}}',
                language: 'de_DE',
                visibilityTypeId: 3,
                createdAt: '{{date.recent}}',
                updatedAt: '{{date.recent}}'
              },
              {
                userId: () => user._id,
                title: '{{lorem.sentence}}',
                slug: '{{lorem.slug}}',
                type: 'post',
                content: '{{lorem.text}}',
                contentExcerpt: '{{lorem.sentence}} {{lorem.sentence}}',
                language: 'de_DE',
                visibilityTypeId: 3,
                createdAt: '{{date.recent}}',
                updatedAt: '{{date.recent}}'
              }
            ],
          });
        }
      }
    ]
  };

  return seeder(options);
};
