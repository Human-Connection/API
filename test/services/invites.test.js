const assert = require('assert');
const app = require('../../server/app');

describe('\'invites\' service', () => {
  it('registered the service', () => {
    const service = app.service('invites');

    assert.ok(service, 'Registered the service');
  });
});
