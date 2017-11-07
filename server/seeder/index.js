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
