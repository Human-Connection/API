const assert = require('assert');
const app = require('../../server/app');

describe('\'ngos\' service', () => {
  it('registered the service', () => {
    const service = app.service('ngos');

    assert.ok(service, 'Registered the service');
  });
});
