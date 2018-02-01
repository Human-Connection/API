const assert = require('assert');
const app = require('../../server/app');

describe('\'users-candos\' service', () => {
  it('registered the service', () => {
    const service = app.service('users-candos');

    assert.ok(service, 'Registered the service');
  });
});
