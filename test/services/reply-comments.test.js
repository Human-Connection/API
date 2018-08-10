const assert = require('assert');
const app = require('../../server/app');
const service = app.service('comments');
const contributionService = app.service('contributions');
const userService = app.service('users');

const { userData } = require('../assets/users');
const { contributionData } = require('../assets/contributions');
const { commentData } = require('../assets/comments');

const replyData = {
  content: 'Nested comment'
};

const replyUserData = {
  email: 'test3@test3.de',
  password: '1234',
  name: 'Jack',
  timezone: 'Europe/Berlin',
  badgeIds: [],
  role: 'user'
};


describe('\'reply comments\' service', () => {
  let user;
  let replyUser;
  let params;
  let contribution;
  let comment;

  before(function(done) {
    this.server = app.listen(3031);
    this.server.once('listening', () => done());
  });

  after(function(done) {
    this.server.close(done);
  });

  beforeEach(async () => {
    await app.get('mongooseClient').connection.dropDatabase();
    user = await userService.create(userData);
    replyUser = await userService.create(replyUserData);

    params = {
      user
    };

    contribution = await contributionService.create(contributionData, params);

    commentData.userId = user._id;
    commentData.contributionId = contribution._id;

    replyData.userId = replyUser._id;
    replyData.contributionId = contribution._id;
  });

  afterEach(async () => {
    await app.get('mongooseClient').connection.dropDatabase();
    user = null;
    params = null;
    contribution = null;
    comment = null;
    delete commentData.userId;
    delete commentData.contributionId;
    delete replyData.userId;
    delete replyData.contributionId;
  });

  it('registered the service', () => {
    assert.ok(service, 'Registered the comments service');
  });

  describe('create reply to comment', () => {
    it('runs create reply to comment', async () => {
      comment = await service.create(commentData, params);

      replyData.parentCommentId = comment._id;
      const reply = await service.create(replyData, params);

      assert.ok(comment, 'created comment');
      assert.ok(reply, 'created reply to comment');

      assert.equal(comment._id, reply.parentCommentId, 'created nested comment');

      console.log('Comment: ' + JSON.stringify(comment, null, 2));
      console.log('ReplyComment: ' + JSON.stringify(reply, null, 2));
    });
  });
});
