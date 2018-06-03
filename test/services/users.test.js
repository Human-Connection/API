const assert = require('assert');
const app = require('../../server/app');
const service = app.service('users');
const { userData, adminData } = require('../assets/users');

describe('\'users\' service', () => {
  let admin;
  let adminParams;
  let user;
  let userParams;

  before(function(done) {
    this.server = app.listen(3031);
    this.server.once('listening', () => done());
  });

  after(function(done) {
    this.server.close(done);
  });

  beforeEach(async () => {
    await app.get('mongooseClient').connection.dropDatabase();
    admin = await service.create(adminData);
    adminParams = {
      user: admin
    };
    user = await service.create(userData);
    userParams = {
      user: user
    };
  });

  afterEach(async () => {
    await app.get('mongooseClient').connection.dropDatabase();
    admin = null;
    adminParams = null;
    user = null;
    userParams = null;
  });

  it('registered the service', () => {
    assert.ok(service, 'Registered the service');
  });

  describe('users create', () => {
    it('runs create', () => {
      assert.ok(user, 'Created user');
    });

    it('does not generate slug', () => {
      assert.strictEqual(user.slug, undefined);
    });
  });

  describe('users patch', () => {
    it('runs patch', async () => {
      const result = await service.patch(user._id, {
        name: 'Alice'
      }, userParams);
      assert.ok(result, 'Patched user');
      assert.equal(result.name, 'Alice', 'Patched user name');
    });

    it('generates slug from name', async () => {
      const result = await service.patch(user._id, {
        name: 'Alice'
      }, userParams);
      assert.equal(result.slug, 'alice');
    });
  });

  describe('users find', () => {
    it('returns users', async () => {
      const result = await service.find();
      assert.ok(result.data[0]);
    });

    it('does not populate badges, candos and userSettings', async () => {
      const result = await service.find(userParams);
      assert.strictEqual(result.data[0].badges, undefined);
      assert.strictEqual(result.data[0].candos, undefined);
      assert.strictEqual(result.data[0].userSettings, undefined);
    });

    it('populates userSettings for admins', async () => {
      const result = await service.find(adminParams);
      assert.notStrictEqual(result.data[0].userSettings, undefined);
    });
  });

  describe('users find by slug', () => {
    let query;

    // Slug is generated in first patch call
    beforeEach(async () => {
      const result = await service.patch(user._id, {
        name: user.name
      }, userParams);
      user.slug = result.slug;
      query = {
        slug: user.slug
      };
    });

    it('returns one user', async () => {
      const result = await service.find({ query });
      assert.ok(result.data[0], 'returns data');
      assert.equal(result.data.length, 1), 'returns only one entry';
    });

    it('populates badges, candos and userSettings', async () => {
      const result = await service.find({ query });
      assert.notStrictEqual(result.data[0].badges, undefined, 'has badges');
      assert.notStrictEqual(result.data[0].candos, undefined, 'has candos');
      assert.notStrictEqual(result.data[0].userSettings, undefined, 'has userSettings');
    });
  });

  describe('users get', () => {
    it('returns user', async () => {
      const result = await service.get(user._id);
      assert.ok(result, 'returns data');
    });

    it('populates badges, candos and userSettings', async () => {
      const result = await service.get(user._id);
      assert.notStrictEqual(result.badges, undefined, 'has badges');
      assert.notStrictEqual(result.candos, undefined, 'has candos');
      assert.notStrictEqual(result.userSettings, undefined, 'has userSettings');
    });
  });
});
