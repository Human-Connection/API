// Database Seeder

// See https://www.npmjs.com/package/feathers-seeder
// Using faker models https://github.com/marak/Faker.js/

// const seeder = require('feathers-seeder');
const Seeder = require('feathers-seeder/lib/seeder');
const seederstore = {};

const optionsMainUser = () => {

  return {
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
          seederstore['testContributionId'] = contribution._id;
          return Promise.resolve([]);
        }
      });
    }
  };
};
const optionsUsers = () => {
  return {
    // Create 10 user
    path: 'users',
    count: 20,
    template: {
      email: '{{internet.email}}',
      password: '{{internet.password}}',
      name: '{{name.firstName}} {{name.lastName}}',
      slug: '{{lorem.slug}}',
      gender: () => Math.random() > 0.2 ? 'm' : 'f',
      isnothere: true,
      timezone: 'Europe/Berlin',
      avatar: '{{internet.avatar}}',
      doiToken: null,
      confirmedAt: null,
      deletedAt: null
    },

    callback(user, seed) {
      // push users to seederstore to use them later
      if (Array.isArray(seederstore.users)) {
        seederstore.users.push(user);
      } else {
        seederstore.users = [];
      }

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
              if (Math.random() > 0.2) {
                return Promise.resolve([]);
              }
              return seed({
                count: 1,
                path: 'comments',
                template: {
                  userId: () => user._id,
                  contributionId: () => seederstore['testContributionId'],
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
  };
};
module.exports = function () {

  return function() {
    // use this as feathes plugin so it can be attached by app.configre
    this.seed = () => {
      const seeder = new Seeder(this, {
        delete: false,
        // Only enable in development
        disabled: process.env.NODE_ENV !== 'development',
      });
      return new Promise((resolve, reject) => {
        /*
        * this can be used as control flow
        * in what order items may be seeded
        * use the seederstore at the top to share
        * data between seeds
        * e.g. if you need to seed some badges first
        * push them to the seederstore
        * then in 2nd or 3rd seed collect them and use them
        */
        seeder.seed(optionsMainUser())
          .then(() => {
            return seeder.seed(optionsUsers());
          })
          .then(() => resolve())
          .catch(reject);
      });
    };
  };
};
