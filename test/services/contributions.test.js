const assert = require('assert');
const app = require('../../server/app');

describe('\'contributions\' service', () => {
  it('registered the service', () => {
    const service = app.service('contributions');

    assert.ok(service, 'Registered the service');
  });
});
