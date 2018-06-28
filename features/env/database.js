/* eslint no-console: off */
const { Before, AfterAll, setWorldConstructor } = require('cucumber');

process.env.NODE_ENV = 'test'; // write into the test database
const backendApp = require('../../server/app');

function CustomWorld() {
  this.app = backendApp;
}
setWorldConstructor(CustomWorld);

// Asynchronous Promise
Before((_, callback) => {
  backendApp.get('mongooseClient').connection.dropDatabase().then(() => {
    callback();
  });
});

AfterAll((callback) => {
  backendApp.get('mongooseClient').disconnect().then(() => {
    callback();
  });
});
