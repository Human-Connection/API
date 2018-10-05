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
  let contribution;

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
    contribution = await contributionService.create(contributionData, { user });

    commentData.contributionId = contribution._id;
    replyData.contributionId = contribution._id;
  });

  afterEach(async () => {
    user = null;
    replyUser = null;
    contribution = null;
    delete commentData.userId;
    delete commentData.contributionId;
    delete replyData.userId;
    delete replyData.contributionId;
  });

  it('registers the service', () => {
    assert.ok(service, 'Registered the comments service');
  });

  context('given a comment', () => {
    let comment;
    beforeEach(async () => {
      comment = await service.create(commentData, { user });
      replyData.parentCommentId = comment._id;
    });


    describe('create a reply', () => {
      it('response includes parentCommentId', async () => {
        const reply = await service.create(replyData, { user: replyUser });
        assert.ok(reply, 'created reply to comment');
        assert.strictEqual(comment._id.toString(), reply.parentCommentId);
      });
    });

    context('given a reply to the comment', () => {
      beforeEach(async () => {
        replyData.content = 'I am a reply';
        await service.create(replyData, { user: replyUser });
      });

      describe('get parent comment', () => {
        it('has replies', async () => {
          comment = await service.get(comment._id);
          assert.ok(comment.children, 'has children property');
          assert.strictEqual(comment.children.length, 1, 'comment has nested comment');
          assert.strictEqual(comment.children[0].content, 'I am a reply');
        });
      });

      describe('find', async () => {
        it('returns the comment and its reply', async () => {
          let comments = await service.find();
          assert.strictEqual(comments.total, 2);
        });

        it('comment includes reply', async () => {

          let commentsRes = await service.find();
          let comments = commentsRes.data;
          let parent = comments[0];
          let reply = comments[1];

          assert.ok(parent.children, 'parent has children');
          assert.strictEqual(parent.children[0].content, 'I am a reply');
          assert.strictEqual(reply.children.length, 0);
        });
      });
    });

  });
});
