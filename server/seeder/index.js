// Database Seeder

// See https://www.npmjs.com/package/feathers-seeder
// Using faker models https://github.com/marak/Faker.js/

const seeder = require('feathers-seeder');

module.exports = function () {
  const options = {
    delete: false,
    // Only enable in development
    disabled: process.env.NODE_ENV !== 'development',
    services: [
      {
        // Create 10 user
        path: 'users',
        count: 20,
        template: {
          email: '{{internet.email}}',
          password: '{{internet.password}}',
          username: '{{name.firstName}} {{name.lastName}}',
          slug: '{{lorem.slug}}',
          gender: '',
          isnothere: true,
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
          // Create contributions for each user
          return seed({
            count: 1,
            path: 'contributions',
            templates: [
              {
                userId: () => user._id,
                title: '{{lorem.sentence}}',
                type: 'post',
                content: '{{lorem.text}} {{lorem.text}}',
                teaserImg: '{{random.image}}',
                language: 'de_DE',
                visibilityTypeId: 3,
                createdAt: '{{date.recent}}',
                updatedAt: '{{date.recent}}'
              },
              {
                userId: () => user._id,
                title: '{{lorem.sentence}}',
                type: 'post',
                content: '{{lorem.text}} {{lorem.text}}',
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
