const assert = require('assert');
const app = require('../../server/app');
const service = app.service('usersettings');
const userService = app.service('users');
const { userData, adminData } = require('../assets/users');

describe('\'usersettings\' service', () => {
  let user;
  let params;

  before(function(done) {
    this.server = app.listen(3031);
    this.server.once('listening', () => done());
  });

  after(function(done) {
    this.server.close(done);
  });

  beforeEach(async () => {
    await app.get('mongooseClient').connection.dropDatabase();
    user = await userService.create(adminData);
    params = {
      user
    };
  });

  afterEach(async () => {
    await app.get('mongooseClient').connection.dropDatabase();
    user = null;
    params = null;
  });

  it('registered the service', () => {
    assert.ok(service, 'registered the service');
  });
});
