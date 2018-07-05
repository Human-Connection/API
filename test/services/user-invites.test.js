const assert = require('assert');
const app = require('../../server/app');

describe('\'user-invites\' service', () => {
  it('registered the service', () => {
    const service = app.service('user-invites');

    assert.ok(service, 'Registered the service');
  });
});
