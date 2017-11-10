const assert = require('assert');
const app = require('../../server/app');

describe('\'organizations\' service', () => {
  it('registered the service', () => {
    const service = app.service('organizations');

    assert.ok(service, 'Registered the service');
  });
});
