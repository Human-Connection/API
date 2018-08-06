const assert = require('assert');
const app = require('../../server/app');
const service = app.service('organizations');
const userService = app.service('users');
const categoryService = app.service('categories');
const {
  userData,
  userData2,
  adminData
} = require('../assets/users');
const {
  organizationData,
  organizationData2,
  addressData,
  addressData2
} = require('../assets/organizations');
const { categoryData } = require('../assets/categories');

describe('\'organizations\' service', () => {
  let user;
  let category;
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
    category = await categoryService.create(categoryData);
    organizationData.categoryIds = [category._id];
    organizationData2.categoryIds = [category._id];
  });

  afterEach(async () => {
    await app.get('mongooseClient').connection.dropDatabase();
    user = null;
    params = null;
    delete organizationData.categoryIds;
    delete organizationData2.categoryIds;
  });

  it('registered the service', () => {
    assert.ok(service, 'registered the service');
  });

  describe('organizations create', () => {
    it('runs create', async () => {
      const organization = await service.create(organizationData, params);
      assert.ok(organization, 'created organization');
    });

    it('has required fields after create', async () => {
      const organization = await service.create(organizationData, params);
      assert.ok(organization._id, 'has _id');
      assert.ok(organization.slug, 'has slug');
      assert.ok(organization.categoryIds, 'has categoryIds');
      assert.ok(organization.creatorId, 'has creatorId');
      assert.ok(organization.language, 'has language');
      assert.ok(organization.type, 'has type');
      assert.ok(organization.users, 'has users');
      assert.ok(organization.description, 'has description');
    });

    it('has correct _id after create with _id: null in data', async () => {
      organizationData._id = null;
      const organization = await service.create(organizationData, params);
      assert.ok(organization._id !== null, 'has _id');
      delete organizationData._id;
    });

    it('has creator as admin user', async () => {
      const organization = await service.create(organizationData, params);
      const firstUser = organization.users[0];
      assert.ok(firstUser, 'has one user entry');
      assert.equal(
        firstUser.id,
        user._id.toString(),
        'has correct user id'
      );
      assert.equal(
        firstUser.role,
        'admin',
        'user is admin'
      );
    });

    it('cannot add users on creation', async () => {
      const user2 = await userService.create(userData2);
      organizationData.users = [{ id: user2._id }];
      const organization = await service.create(organizationData, params);
      const users = organization.users;
      assert.equal(
        users[0].id,
        user._id.toString(),
        'has correct user id'
      );
      assert.equal(
        users[1],
        undefined,
        'does not have second user'
      );
    });
  });

  describe('organizations find', () => {
    beforeEach(async () => {
      await service.create(organizationData, params);
    });

    it('finds organizations', async () => {
      const result = await service.find();
      assert.ok(result.data[0], 'returns data');
    });
  });

  describe('organizations find by slug', () => {
    let query;
    let organization;

    beforeEach(async () => {
      organization = await service.create(organizationData, params);
      await service.create(organizationData2, params);
      query = {
        slug: organization.slug
      };
    });

    afterEach(async () => {
      organization = null;
      query = null;
    });

    it('returns one organization', async () => {
      const result = await service.find({query});
      assert.ok(result.data[0], 'returns data');
      assert.equal(result.data.length, 1), 'returns only one entry';
    });
  });

  describe('organizations find by user', () => {
    let query;
    let organization;

    beforeEach(async () => {
      organization = await service.create(organizationData, params);
      await service.create(organizationData2, params);
      query = {
        'users.id': organization.users[0].id
      };
    });

    afterEach(async () => {
      organization = null;
      query = null;
    });

    it('returns organizations', async () => {
      const result = await service.find({query});
      assert.ok(result.data[0], 'returns data');
      assert.equal(result.data.length, 2), 'returns two entries';
    });
  });

  describe('organizations addresses', () => {
    beforeEach(async () => {
      organizationData.addresses = [
        addressData,
        addressData2
      ];
    });

    afterEach(async () => {
      delete organizationData.addresses;
    });

    it('first address is primary address', async () => {
      const result = await service.create(organizationData, params);
      const address = result.addresses[0];
      assert.ok(address, 'has address');
      assert.strictEqual(
        result.primaryAddressIndex, 0, 'has primary address index'
      );
      assert.strictEqual(
        address.primary, true, 'address has primary flag'
      );
    });
  });

  describe('organizations users', () => {
    let user2;
    let organization;

    beforeEach(async () => {
      user2 = await userService.create(userData2);
      organization = await service.create(organizationData, params);
    });

    afterEach(async () => {
      user2 = null;
      organization = null;
    });

    it('a user can only be added once', async () => {
      const data = {
        users: [
          ...organization.users,
          { id: user2._id },
          { id: user2._id }
        ]
      };
      const result = await service.patch(organization._id, data, params);
      assert.strictEqual(result.users[2], undefined, 'has not same user twice');
    });
  });

  describe('organizations admin roles', () => {
    let user2;
    let organization;

    beforeEach(async () => {
      user2 = await userService.create(userData2);
      organization = await service.create(organizationData, params);
    });

    afterEach(async () => {
      user2 = null;
      organization = null;
    });

    it('admin can add user to organization', async () => {
      const data = {
        users: [
          ...organization.users,
          { id: user2._id }
        ]
      };
      const result = await service.patch(organization._id, data, params);
      const newUser = result.users[1];
      assert.ok(newUser, 'has new user');
      assert.strictEqual(
        newUser.id.toString(), user2._id.toString(), 'new user has correct id'
      );
    });

    it('admin can delete organization', async () => {
      const result = await service.remove(organization._id, params);
      assert.strictEqual(result.deleted, true, 'organization is deleted');
    });
  });

  describe('organizations editor roles', () => {
    let editor;
    let user2;
    let editorParams;
    let organization;

    beforeEach(async () => {
      editor = await userService.create(userData);
      editorParams = {
        user: editor
      };
      organization = await service.create(organizationData, params);
      const data = {
        users: [
          ...organization.users,
          {
            id: editor._id,
            role: 'editor'
          }
        ]
      };
      organization = await service.patch(organization._id, data, params);
      user2 = await userService.create(userData2);
    });

    afterEach(async () => {
      editor = null;
      user2 = null;
      editorParams = null;
      organization = null;
    });

    it('editor cannot add user to organization', async () => {
      const data = {
        users: [
          ...organization.users,
          { id: user2._id }
        ]
      };
      const result = await service.patch(organization._id, data, editorParams);
      assert.strictEqual(result.users[2], undefined, 'has not added user');
    });

    it('editor cannot change roles on user', async () => {
      const data = {
        users: organization.users
      };
      data.users[1].role = 'admin';
      const result = await service.patch(organization._id, data, editorParams);
      assert.notEqual(result.users[1].role, 'admin', 'has not changed role');
    });

    it('editor cannot delete organization', async () => {
      let error = false;
      try {
        await service.remove(organization._id, editorParams);
      } catch (e) {
        error = e;
      }
      assert.ok(error, 'throws an error');
    });
  });
});
