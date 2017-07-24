// Database Seeder

// See https://www.npmjs.com/package/feathers-seeder
// Using faker models https://github.com/marak/Faker.js/

const seeder = require('feathers-seeder');

module.exports = function () {
  let testContributionId = false;

  const options = {
    delete: false,
    // Only enable in development
    disabled: process.env.NODE_ENV !== 'development',
    services: [
      {
        // Create test user
        path: 'users',
        count: 1,
        template: {
          email: 'test@test.de',
          password: '1234',
          name: 'Peter Pan',
          slug: 'peter-pan',
          gender: 'm',
          isnothere: true,
          timezone: 'Europe/Berlin',
          avatar: '{{internet.avatar}}',
          doiToken: null,
          confirmedAt: null,
          deletedAt: null
        },
        callback(user, seed) {
          // Create contribution test user
          return seed({
            count: 1,
            path: 'contributions',
            template: {
              userId: () => user._id,
              title: '{{lorem.sentence}}',
              type: 'post',
              content: '{{lorem.text}} {{lorem.text}}',
              teaserImg: '{{random.image}}',
              language: 'de_DE',
              createdAt: '{{date.recent}}',
              updatedAt: '{{date.recent}}'
            },
            callback(contribution) {
              // Save test contribution for later use
              testContributionId = contribution._id;
              return true;
            }
          });
        }
      },
      {
        // Create 10 user
        path: 'users',
        count: 20,
        template: {
          email: '{{internet.email}}',
          password: '{{internet.password}}',
          name: '{{name.firstName}} {{name.lastName}}',
          slug: '{{lorem.slug}}',
          gender: '',
          isnothere: true,
          timezone: 'Europe/Berlin',
          avatar: '{{internet.avatar}}',
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
                createdAt: '{{date.recent}}',
                updatedAt: '{{date.recent}}'
              },
              {
                userId: () => user._id,
                title: '{{lorem.sentence}}',
                type: 'post',
                content: '{{lorem.text}} {{lorem.text}}',
                language: 'de_DE',
                createdAt: '{{date.recent}}',
                updatedAt: '{{date.recent}}'
              }
            ],
            callback(contribution, seed) {
              // Create comments for each contribution
              return seed({
                count: 2,
                path: 'comments',
                template: {
                  userId: () => user._id,
                  contributionId: () => contribution._id,
                  content: '{{lorem.text}} {{lorem.text}}',
                  language: 'de_DE',
                  createdAt: '{{date.recent}}',
                  updatedAt: '{{date.recent}}'
                },
                callback(comment, seed) {
                  // Create a view comments for test contribution
                  if(Math.random() > 0.2) return true;
                  return seed({
                    count: 1,
                    path: 'comments',
                    template: {
                      userId: () => user._id,
                      contributionId: () => testContributionId,
                      content: '{{lorem.text}} {{lorem.text}}',
                      language: 'de_DE',
                      createdAt: '{{date.recent}}',
                      updatedAt: '{{date.recent}}'
                    }
                  });
                }
              });
            }
          });
        }
      }
    ]
  };

  return seeder(options);
};
