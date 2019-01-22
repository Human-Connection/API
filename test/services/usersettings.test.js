const assert = require('assert');
const app = require('../../server/app');
const service = app.service('usersettings');
const userService = app.service('users');
const { userData } = require('../assets/users');

describe('\'usersettings\' service', () => {
  let user;

  before(function(done) {
    this.server = app.listen(3031);
    this.server.once('listening', () => done());
  });

  after(function(done) {
    this.server.close(done);
  });

  it('registered the service', () => {
    assert.ok(service, 'registered the service');
  });

  context('given a user', () => {
    beforeEach(async () => {
      await app.get('mongooseClient').connection.dropDatabase();
      user = await userService.create(userData);
    });

    afterEach(async () => {
      await app.get('mongooseClient').connection.dropDatabase();
      user = null;
    });

    describe('create', () => {
      it('succeeds', async () => {
        let data = {
          userId: user._id
        };
        const usersettings = await service.create(data);
        assert.ok(usersettings);
      });
    });
  });
});
