const assert = require('assert');
const app = require('../../server/app');
const service = app.service('contributions');
const userService = app.service('users');
const notificationService = app.service('notifications');
const userData = {
  password: '1234',
  name: 'Peter',
  slug: 'peter',
  isnothere: true,
  timezone: 'Europe/Berlin',
  avatar: 'https://source.unsplash.com/random/100x100',
  coverImg: 'https://source.unsplash.com/random/1250x280',
  badgeIds: [],
  role: 'admin',
  doiToken: null,
  confirmedAt: null,
  deletedAt: null
};

let user;
let params;

describe('\'contributions\' service', () => {
  it('registered the service', () => {
    assert.ok(service, 'Registered the service');
  });

  it('runs create', async () => {
    userData.email = 'a@a.de';
    user = await userService.create(userData);
    params = { user };
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

  it('creates mention notification', async () => {
    userData.email = 'b@b.de';
    const mentionedUser = await userService.create(userData);
    const contribution = await service.create({
      title: 'c',
      type: 'post',
      content: `<a href="" class="hc-editor-mention-blot" data-hc-mention="{&quot;_id&quot;:&quot;${mentionedUser._id.toString()}&quot;,&quot;slug&quot;:&quot;$\{mentionedUser.slug}&quot;}">{mentionedUser.name}</a>`,
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