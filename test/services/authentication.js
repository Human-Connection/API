const assert = require('assert');
const app = require('../../server/app');
const service = app.service('authentication');
const userService = app.service('users');

describe('\'authentication\' service', () => {
  before(function(done) {
    this.server = app.listen(3031);
    this.server.once('listening', () => done());
  });

  after(function(done) {
    this.server.close(done);
  });

  beforeEach(async () => {
    await app.get('mongooseClient').connection.dropDatabase();
  });

  afterEach(async () => {
    await app.get('mongooseClient').connection.dropDatabase();
  });

  it('registered the service', () => {
    assert.ok(service, 'Registered the service');
  });

  it('user can register', async () => {
    const user = await userService.create({
      email: 'test@test.de',
      password: '1234',
      name: 'Peter',
      role: 'admin'
    });

    assert.ok(user, 'user successfully registered');
  });

  it('user can login', async () => {
    await userService.create({
      email: 'test@test.de',
      password: '1234',
      name: 'Peter',
      role: 'admin'
    });
    const params = {
      provider: 'socketio'
    };
    const { accessToken } = await service.create({
      strategy: 'local',
      email: 'test@test.de',
      password: '1234',
    }, params);

    assert.ok(accessToken, 'user successfully logged in');
  });

  it('ignores uppercase letters on login', async () => {
    await userService.create({
      email: 'test@test.de',
      password: '1234',
      name: 'Peter',
      role: 'admin'
    });
    const params = {
      provider: 'socketio'
    };
    const { accessToken } = await service.create({
      strategy: 'local',
      email: 'Test@test.de',
      password: '1234',
    }, params);

    assert.ok(accessToken, 'uppercase letters are ignored');
  });
});
