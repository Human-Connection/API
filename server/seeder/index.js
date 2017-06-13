// Database Seeder

// See https://www.npmjs.com/package/feathers-seeder
// Using faker models https://github.com/marak/Faker.js/

const seeder = require('feathers-seeder');

module.exports = function () {
  const options = {
    services: [
      {
        // Create 10 user
        path: 'users',
        count: 10,
        template: {
          email: '{{internet.email}}',
          password: '{{internet.password}}',
        },

        callback(user, seed) {
          // Create 5 contributions for each user
          const userId = () => user._id;

          return seed({
            count: 5,
            path: 'contributions',
            template: {
              text: '{{lorem.text}}',
              userId: userId
            },
          });
        }
      }
    ]
  };

  return seeder(options);
};
