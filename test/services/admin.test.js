const assert = require('assert');
const app = require('../../server/app');

describe('\'admin\' service', () => {
  it('registered the service', () => {
    const service = app.service('admin');

    assert.ok(service, 'Registered the service');
  });
});
