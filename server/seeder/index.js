// Database Seeder Wrapper
// Needed for seeding more than one configs in specific order

const seeder = require('feathers-seeder');
const baseConfigs = require('./base');
const developmentConfigs = require('./development');
let configs = [...baseConfigs, ...developmentConfigs];

module.exports = () => {
  return function() {
    const app = this;

    app.seed = () => {
      return new Promise(resolve => {
        runSeeder(app, configs)
          .then(() => {
            resolve(app);
          })
          .catch(error => {
            console.log(error);
            resolve(app);
          });
      });
    };
  };
};

const runSeeder = (app, configs) => {
  return new Promise(resolve => {
    // Stop when we don't have any configs left
    if(configs.length < 1) {
      resolve();
    }

    // Otherwise seed with current config
    let config = configs.shift();
    app
      .configure(seeder(config));
    app
      .seed()
      .then(() => {
        runSeeder(app, configs)
          .then(() => {
            resolve();
          });
      });
  });
};
