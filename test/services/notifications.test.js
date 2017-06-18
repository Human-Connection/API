const assert = require('assert');
const app = require('../../server/app');

describe('\'notifications\' service', () => {
  it('registered the service', () => {
    const service = app.service('notifications');

    assert.ok(service, 'Registered the service');
  });
});
