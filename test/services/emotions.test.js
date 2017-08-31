const assert = require('assert');
const app = require('../../server/app');

describe('\'emotions\' service', () => {
  it('registered the service', () => {
    const service = app.service('emotions');

    assert.ok(service, 'Registered the service');
  });
});
