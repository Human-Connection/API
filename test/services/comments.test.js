const assert = require('assert');
const app = require('../../server/app');

describe('\'comments\' service', () => {
  it('registered the service', () => {
    const service = app.service('comments');

    assert.ok(service, 'Registered the service');
  });
});
