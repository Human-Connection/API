const assert = require('assert');
const app = require('../../server/app');
const { userData, adminData } = require('../assets/users');
const { merge } = require('lodash');
const userService = app.service('users');

describe('"settings" service', () => {
  const service = app.service('settings');
  let res;
  let user;
  let adminUser;
  let params;
  let adminParams;
  let settingRes;

  const settingsObject = {
    invites: {
      userCanInvite: true,
      maxInvitesByUser: 3
    },
    maintenance: false
  };

  before(async () => {
    await app.get('mongooseClient').connection.dropDatabase();

    user = await userService.create(userData);
    params = {
      user: user
    };

    adminUser = await userService.create(adminData);
    adminParams = {
      user: adminUser
    };
  });

  it('registered the service', () => {
    assert.ok(service, 'Registered the service');
  });

  it('fails to create settings for non admin users', async () => {
    let error;
    try {
      res = await service.create(settingsObject, params);
    } catch (err) {
      error = err;
    }
    assert.ok(error, 'error is thrown for non admins');
    assert.strictEqual(error.name, 'Forbidden');
    assert.strictEqual(error.message, 'You don\'t have admin rights.');
  });

  it('create settings', async () => {
    res = await service.create(settingsObject, adminParams);
    settingRes = res.pop();

    assert.ok(settingRes, 'settingRes object is here');
    assert.strictEqual(settingRes.invites.userCanInvite, settingsObject.invites.userCanInvite, 'invites.userCanInvite was set');
    assert.strictEqual(settingRes.invites.maxInvitesByUser, settingsObject.invites.maxInvitesByUser, 'invites.maxInvitesByUser was set');
    assert.strictEqual(settingRes.maintenance, settingsObject.maintenance, 'maintenance was set');
  });

  it('update settings', async () => {
    res = await service.create(settingsObject, adminParams);
    settingRes = res.pop();

    const updatedData = merge(settingRes, {
      invites: {
        userCanInvite: false
      }
    });

    res = await service.patch(settingRes._id, updatedData, adminParams);

    assert.ok(res, 'res object is here');
    assert.strictEqual(res.invites.userCanInvite, false, 'invites.userCanInvite was set');
    assert.strictEqual(res.invites.maxInvitesByUser, settingsObject.invites.maxInvitesByUser, 'invites.maxInvitesByUser was not changed');
    assert.strictEqual(res.maintenance, settingsObject.maintenance, 'maintenance was not changed');
  });
});
