const assert = require('assert');
const app = require('../../server/app');
const service = app.service('contributions');
const userService = app.service('users');
const notificationService = app.service('notifications');

describe('\'contributions\' service', () => {
  before(function(done) {
    this.server = app.listen(3031);
    this.server.once('listening', () => done());
  });

  after(function(done) {
    this.server.close(done);
  });

  beforeEach(async () => {
    await app.get('mongooseClient').connection.dropDatabase();
  });

  afterEach(async () => {
    await app.get('mongooseClient').connection.dropDatabase();
  });

  it('registered the service', () => {
    assert.ok(service, 'Registered the service');
  });

  describe('contribution creation', () => {
    let params;

    beforeEach(async () => {
      const email = 'test@test.de';
      const password = '1234';
      const user = await userService.create({
        email,
        password,
        name: 'Peter',
        timezone: 'Europe/Berlin',
        badgeIds: [],
        role: 'admin'
      });
      params = {
        user
      };
    });

    afterEach(async () => {
      params = null;
    });

    it('runs create', async () => {
      const contribution = await service.create({
        title: 'a',
        type: 'post',
        content: 'My contribution content',
        language: 'en'
      }, params);
      assert.ok(contribution, 'Created contribution');
    });

    it('has required fields after create', async () => {
      const contribution = await service.create({
        title: 'b',
        type: 'post',
        content: 'My contribution content',
        language: 'en'
      }, params);
      assert.ok(contribution._id, 'Has _id');
      assert.ok(contribution.type, 'Has userId');
      assert.ok(contribution.type, 'Has type');
      assert.ok(contribution.title, 'Has title');
      assert.ok(contribution.content, 'Has content');
    });

    it('has correct _id after create with _id: null in data', async () => {
      const contribution = await service.create({
        _id: null,
        title: 'b',
        type: 'post',
        content: 'My contribution content',
        language: 'en'
      }, params);
      assert.ok(contribution._id !== null, 'Has _id');
    });

    it('creates mention notification', async () => {
      const mentionedUser = await userService.create({
        email: 'test2@test2.de',
        password: '1234',
        name: 'Peter',
        slug: 'peter',
        timezone: 'Europe/Berlin',
        badgeIds: [],
        role: 'user'
      });
      const contribution = await service.create({
        title: 'c',
        type: 'post',
        content: `<a href="" class="hc-editor-mention-blot" data-hc-mention="{&quot;_id&quot;:&quot;${mentionedUser._id.toString()}&quot;,&quot;slug&quot;:&quot;${mentionedUser.slug}&quot;}">${mentionedUser.name}</a>`,
        language: 'en'
      }, params);
      const result = await notificationService.find({
        query: {
          userId: mentionedUser._id
        }
      });
      const notification = result.data[0];
      assert.ok(notification, 'Created notification');
      assert.ok(notification.userId, 'Has userId');
      assert.ok(notification.relatedContributionId, 'Has relatedContributionId');
      assert.equal(notification.relatedContributionId, contribution._id, 'Has correct relatedContributionId');
    });
  });
});