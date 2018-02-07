const assert = require('assert');
const app = require('../../server/app');

describe('\'status\' service', () => {
  const service = app.service('status');

  beforeEach(() => {
    return service.update({}, {
      maintenance: false
    }, { secret: app.get('apiSecret') });
  });

  it('registered the service', () => {
    assert.ok(service, 'Registered the service');
  });

  it('get maintenance mode', async () => {
    const status = await service.find();
    assert.equal(status.maintenance, false);
  });

  it('set maintenance mode to true', async () => {
    await service.update({}, {
      maintenance: true
    }, { secret: app.get('apiSecret') });
    const status1 = await service.find();
    assert.equal(status1.maintenance, true);

    const status2 = await service.update({}, {
      maintenance: false
    }, { secret: app.get('apiSecret') });
    assert.equal(status2.maintenance, false);
  });
});
