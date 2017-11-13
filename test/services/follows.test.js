const assert = require('assert');
const app = require('../../server/app');

describe('\'follows\' service', () => {
  it('registered the service', () => {
    const service = app.service('follows');

    assert.ok(service, 'Registered the service');
  });
});
