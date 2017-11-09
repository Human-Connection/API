// Database Seeder

// See https://www.npmjs.com/package/feathers-seeder
// Using faker models https://github.com/marak/Faker.js/
let seederstore = {};

// const seeder = require('feathers-seeder');

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
    };
  };
};
