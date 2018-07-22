const assert = require('assert');
const app = require('../../server/app');
const service = app.service('usersettings');
const userService = app.service('users');
const { adminData } = require('../assets/users');
const { usersettingsData } = require('../assets/usersettings');

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

  describe('usersettings create', () => {
    it('runs create', async () => {
      const settings = await service.create(usersettingsData, params);
      assert.ok(settings, 'created settings');
    });

    it('has required fields after create', async () => {
      const settings = await service.create(usersettingsData, params);
      assert.ok(settings._id, 'has _id');
      assert.ok(settings.userId, 'has userId');
      assert.ok(settings.uiLanguage, 'has language');
      assert.ok(settings.contentLanguages, 'has content languages');
      assert.ok(settings.blacklist, 'has blacklist');
    });

  });

  describe('usersettings find', () => {
    let usersettings;

    beforeEach(async() => {
      usersettings = await service.create(usersettingsData, params);
    });

    afterEach(async() => {
      usersettings = null;
    });

    it('finds all', async () => {
      const result = await service.find();
      assert.ok(result.data, 'has result');
      assert.ok(result.data[0], 'result has one item');
      assert.equal(result.data[0]._id, usersettings._id.toString(), 'item has correct id');
    });

    it('finds settings for given user', async () => {
      const result = await service.find({query: { userId: user._id }});
      assert.ok(result.data, 'has result');
      assert.ok(result.data[0], 'result has one item');
      assert.equal(result.data[0].userId, user._id.toString(), 'item has correct userId');
    });
  });
});
