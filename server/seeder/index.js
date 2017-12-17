// Database Seeder

const { asyncForEach } = require('../helper/seed-helpers');

// See https://www.npmjs.com/package/feathers-seeder
// Using faker models https://github.com/marak/Faker.js/
let seederstore = {};

// const seeder = require('feathers-seeder');

const faker = require('faker');
// const faker = require('faker/locale/de');
// faker.locale = 'de_DE';

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

module.exports = function (app = null, store = null) {
  seederstore = store || seederstore;

  return function () {
    app = app || this;
    seederstore = store || seederstore;

    console.debug('###size of seeder store: ', _.size(seederstore));

    app.seed = async (conf = null) => {
      if (_.isArray(conf) && conf.length) {
        configs = conf
      }

      const seeder = new Seeder(app, {
        delete: false,
        disabled: app.get('seeder').runOnInit !== true && _.isEmpty(store),
      });
      await asyncForEach(configs, async (config) => {
        if (_.isEmpty(config.services)) {
          config = config(seederstore);
        } else {
          app.error('config was empty!');
        }
        await asyncForEach(config.services, async (service) => {
          await seedAndAssign(service, seeder);
        });
      });
      console.log('>>>>>> SEEDING COMPLETED <<<<<<');
    };
  };
};
