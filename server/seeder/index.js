// Database Seeder

// See https://www.npmjs.com/package/feathers-seeder
// Using faker models https://github.com/marak/Faker.js/
let seederstore = {};

// const seeder = require('feathers-seeder');
// const mongoose = require('mongoose');

const faker = require('faker/locale/de');
faker.locale = 'de_DE';

const Seeder = require('feathers-seeder/lib/seeder');
const baseConfigs = require('./base')();
const developmentConfigs = require('./development')();
const _ = require('lodash');

let configs = [...baseConfigs, ...developmentConfigs];

// set seeds to german language
// const seederstore = {};
// const optionsNgos = () => {
//   // seed 10 ngos with their main users
//   return {
//     path: 'users',
//     count: 10,
//     template: {
//       email: '{{internet.email}}',
//       password: '{{internet.password}}',
//       name: '{{name.firstName}} {{name.lastName}}',
//       slug: '{{lorem.slug}}',
//       gender: () => Math.random() > 0.2 ? 'm' : 'f',
//       isnothere: true,
//       timezone: 'Europe/Berlin',
//       avatar: '{{internet.avatar}}',
//       doiToken: null,
//       confirmedAt: null,
//       deletedAt: nullw
//     } /*,
//     callback(user, seed) {
//       // Create contribution test user
//       return seed({
//         // Create test user
//         path: 'ngos',
//         count: 1,
//         template: {
//           name: '{{lorem.slug}}',
//           followerIds: [],
//           userId: () => user._id,
//           text: '{{lorem.sentence}}'
//         },
//         callback(ngo) {
//           if (Array.isArray(seederstore.ngos)) {
//             seederstore.ngos.push(ngo);
//           } else {
//             seederstore.ngos = [];
//           }
//           return Promise.resolve([]);
//         }
//       });
//     } */
//   };
// };
// const optionsProjects = () => {
//   // seed 10 projects with their main users
//   return {
//     path: 'users',
//     count: 10,
//     template: {
//       email: '{{internet.email}}',
//       password: '{{internet.password}}',
//       name: '{{name.firstName}} {{name.lastName}}',
//       slug: '{{lorem.slug}}',
//       gender: () => Math.random() > 0.2 ? 'm' : 'f',
//       isnothere: true,
//       timezone: 'Europe/Berlin',
//       avatar: '{{internet.avatar}}',
//       doiToken: null,
//       confirmedAt: null,
//       deletedAt: null
//     },
//     callback(user, seed) {
//       // Create contribution test user
//       return seed({
//         // Create test user
//         path: 'projects',
//         count: 1,
//         template: {
//           name: '{{lorem.slug}}',
//           followerIds: [],
//           userId: () => user._id,
//           text: '{{lorem.sentence}}'
//         },
//         callback(project) {
//           if (Array.isArray(seederstore.projects)) {
//             seederstore.projects.push(project);
//           } else {
//             seederstore.projects = [];
//           }
//           return Promise.resolve([]);
//         }
//       });
//     }
//   };
// };
// const optionsMainUser = () => {
//
//   return {
//     // Create test user
//     path: 'users',
//     count: 1,
//     template: {
//       email: 'test@test.de',
//       password: '1234',
//       name: 'Peter Pan',
//       slug: 'peter-pan',
//       gender: 'm',
//       isnothere: true,
//       timezone: 'Europe/Berlin',
//       avatar: '{{internet.avatar}}',
//       doiToken: null,
//       confirmedAt: null,
//       deletedAt: null
//     } /*,
//     callback(user, seed) {
//       // Create contribution test user
//       return seed({
//         count: 1,
//         path: 'contributions',
//         template: {
//           userId: () => user._id,
//           title: '{{lorem.sentence}}',
//           type: 'post',
//           content: '{{lorem.text}} {{lorem.text}}',
//           teaserImg: '{{random.image}}',
//           language: 'de_DE',
//           createdAt: '{{date.recent}}',
//           updatedAt: '{{date.recent}}'
//         },
//         callback(contribution) {
//           // Save test contribution for later use
//           seederstore['testContributionId'] = contribution._id;
//           return Promise.resolve([]);
//         }
//       });
//     } */
//   };
// };
// const optionsUsers = () => {
//   return {
//     // Create 10 user
//     path: 'users',
//     count: 20,
//     template: {
//       email: '{{internet.email}}',
//       password: '{{internet.password}}',
//       name: '{{name.firstName}} {{name.lastName}}',
//       slug: '{{lorem.slug}}',
//       isnothere: true,
//       timezone: 'Europe/Berlin',
//       avatar: '{{internet.avatar}}',
//       doiToken: null,
//       confirmedAt: null,
//       deletedAt: null
//     }/* ,
//
//     callback(user, seed) {
//       // push users to seederstore to use them later
//       if (Array.isArray(seederstore.users)) {
//         seederstore.users.push(user);
//       } else {
//         seederstore.users = [];
//       }
//
//       // Create contributions for each user
//       return seed({
//         count: 1,
//         path: 'contributions',
//         templates: [
//           {
//             userId: () => user._id,
//             title: '{{lorem.sentence}}',
//             type: 'post',
//             content: '{{lorem.text}} {{lorem.text}}',
//             teaserImg: '{{random.image}}',
//             language: 'de_DE',
//             createdAt: '{{date.recent}}',
//             updatedAt: '{{date.recent}}'
//           },
//           {
//             userId: () => user._id,
//             title: '{{lorem.sentence}}',
//             type: 'post',
//             content: '{{lorem.text}} {{lorem.text}}',
//             language: 'de_DE',
//             createdAt: '{{date.recent}}',
//             updatedAt: '{{date.recent}}'
//           }
//         ],
//         callback(contribution, seed) {
//           // Create comments for each contribution
//           return seed({
//             count: 2,
//             path: 'comments',
//             template: {
//               userId: () => user._id,
//               contributionId: () => contribution._id,
//               content: '{{lorem.text}} {{lorem.text}}',
//               language: 'de_DE',
//               createdAt: '{{date.recent}}',
//               updatedAt: '{{date.recent}}'
//             },
//             callback(comment, seed) {
//               // Create a view comments for test contribution
//               if (Math.random() > 0.2) {
//                 return Promise.resolve([]);
//               }
//               return seed({
//                 count: 1,
//                 path: 'comments',
//                 template: {
//                   userId: () => user._id,
//                   contributionId: () => seederstore['testContributionId'],
//                   content: '{{lorem.text}} {{lorem.text}}',
//                   language: 'de_DE',
//                   createdAt: '{{date.recent}}',
//                   updatedAt: '{{date.recent}}'
//                 }
//               });
//             }
//           });
//         }
//       });
//     } */
//   };
// };
// const optionsContributions = (seederstore) => {
//   return {
//     count: _.keys(seederstore.users).length,
//       path: 'contributions',
//       templates: [
//       {
//         userId: () => randomItem(seederstore.users)._id,
//         title: '{{lorem.sentence}}',
//         type: 'post',
//         content: '{{lorem.text}} {{lorem.text}}',
//         teaserImg: '{{random.image}}',
//         language: 'de_DE',
//         createdAt: '{{date.recent}}',
//         updatedAt: '{{date.recent}}'
//       },
//       {
//         userId: () => randomItem(seederstore.users)._id,
//         title: '{{lorem.sentence}}',
//         type: 'post',
//         content: '{{lorem.text}} {{lorem.text}}',
//         language: 'de_DE',
//         createdAt: '{{date.recent}}',
//         updatedAt: '{{date.recent}}'
//       }
//     ]
//   };
// };

const seedAndAssign = async (config, seeder) => {
  const key = config.path;
  const res = await seeder.seed(config);
  if (_.isEmpty(seederstore[key])) {
    seederstore[key] = {}
  }
  _.merge(seederstore[key], _.mapKeys(res, '_id'));
};
const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
};

module.exports = function () {

  return function() {
    const app = this;
    // use this as feathes plugin so it can be attached by app.configre
    app.seed = async () => {

      const seeder = new Seeder(this, {
        delete: false,
        disabled: app.get('seeder').runOnInit !== true,
      });

      await asyncForEach(configs, async (config) => {
        if (_.isEmpty(config.services)) {
          config = config(seederstore);
        }
        await asyncForEach(config.services, async (service) => {
          await seedAndAssign(service, seeder);
        });
      });

      // setup followers
      // const mapper = (type) => (items) => {
      //   const itemMap = items.map((item) => {
      //     // get 2 random users from store
      //     let len = seederstore.users.length;
      //     let rand = Math.floor(Math.random() * len);
      //     let user1 = seederstore.users[rand];
      //     let user2 = seederstore.users[(rand > 0 ? rand - 1 : 0)];
      //     item.followerIds.push(user1._id);
      //     item.followerIds.push(user2._id);
      //     item.save().then(() => {
      //       // after saving ngo/project save to the user also
      //       let query = {_id: {$in: [user1._id, user2._id]}};
      //       return userModel.find(query)
      //         .then((users) => {
      //           return Promise.all(users.map((user) => {
      //             user.follows.push({
      //               type: type,
      //               id: item._id.toString()
      //             });
      //             return user.save();
      //           }));
      //         });
      //     }).catch((e) => {
      //       return Promise.reject(e);
      //     });
      //   });
      //   return Promise.all(itemMap);
      // }
      // ngosAndProjects.push(ngoModel.find({}).then(mapper('ngos')));
      // ngosAndProjects.push(projectsModel.find({}).then(mapper('projects')));
      // return Promise.all(ngosAndProjects);
    };
  };
};
