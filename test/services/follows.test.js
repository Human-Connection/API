const assert = require('assert');
const app = require('../../server/app');
const service = app.service('follows');
const userService = app.service('users');
// const notificationService = app.service('notifications');

describe('\'follows\' service', () => {
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

  describe('follow a user', () => {
    let params;

    let userA;
    let userB;

    beforeEach(async () => {
      userA = await userService.create({
        email: 'test@test.de',
        password: '1234',
        name: 'Peter',
        role: 'user'
      });
      userB = await userService.create({
        email: 'test2@test2.de',
        password: '4321',
        name: 'Hans',
        role: 'user'
      });
      params = {
        user: userA
      };
    });

    afterEach(async () => {
      params = null;
    });

    it('runs create', async () => {
      const follows = await service.create({
        'userId': params.user._id,
        'foreignId': userB._id,
        'foreignService': 'users'
      }, params);
      assert.ok(follows, 'Created follows');
    });

    it('has required fields after create', async () => {
      const follows = await service.create({
        'userId': params.user._id,
        'foreignId': userB._id,
        'foreignService': 'users'
      }, params);
      assert.ok(follows._id, 'Has _id');
      assert.ok(follows.userId, 'Has userId');
      assert.ok(follows.foreignId, 'Has foreignId');
      assert.ok(follows.foreignService, 'Has foreignService');
    });

    // it('creates mention notification', async () => {
    //   const mentionedUser = await userService.create({
    //     email: 'test2@test2.de',
    //     password: '1234',
    //     name: 'Peter',
    //     slug: 'peter',
    //     timezone: 'Europe/Berlin',
    //     badgeIds: [],
    //     role: 'user'
    //   });
    //   const follows = await service.create({
    //     title: 'c',
    //     type: 'post',
    //     content: `<a href="" class="hc-editor-mention-blot" data-hc-mention="{&quot;_id&quot;:&quot;${mentionedUser._id.toString()}&quot;,&quot;slug&quot;:&quot;${mentionedUser.slug}&quot;}">${mentionedUser.name}</a>`,
    //     language: 'en'
    //   }, params);
    //   const result = await notificationService.find({
    //     query: {
    //       userId: mentionedUser._id
    //     }
    //   });
    //   const notification = result.data[0];
    //   assert.ok(notification, 'Created notification');
    //   assert.ok(notification.userId, 'Has userId');
    //   assert.ok(notification.relatedfollowsId, 'Has relatedfollowsId');
    //   assert.strictEqual(notification.relatedfollowsId, follows._id, 'Has correct relatedfollowsId');
    // });
  });
});
