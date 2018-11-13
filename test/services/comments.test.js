const assert = require('assert');
const app = require('../../server/app');
const service = app.service('comments');
const contributionService = app.service('contributions');
const userService = app.service('users');
const usersettingsService = app.service('usersettings');

const { userData } = require('../assets/users');
const { contributionData } = require('../assets/contributions');
const { commentData } = require('../assets/comments');

describe('\'comments\' service', () => {
  let user;
  let params;
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
    params = {
      user
    };
    contribution = await contributionService.create(contributionData, params);
    commentData.userId = user._id;
    commentData.contributionId = contribution._id;
  });

  afterEach(async () => {
    await app.get('mongooseClient').connection.dropDatabase();
    user = null;
    params = null;
    contribution = null;
    delete commentData.userId;
    delete commentData.contributionId;
  });

  it('registered the service', () => {
    assert.ok(service, 'Registered the service');
  });

  describe('comments create', () => {
    it('runs create', async () => {
      const comment = await service.create(commentData, params);
      assert.ok(comment, 'created comment');
    });
  });

  describe('comments patch', () => {
    let comment;

    beforeEach(async () => {
      comment = await service.create(commentData, params);
    });

    it('runs patch', async () => {
      const result = await service.patch(
        comment._id,
        { content: 'Test' },
        params
      );
      assert.ok(result, 'returns result');
      assert.equal(result.content, 'Test', 'patched content');
    });
  });

  describe('comments find', () => {
    beforeEach(async () => {
      await service.create(commentData, params);
    });

    it('runs find', async () => {
      const result = await service.find();
      assert.ok(result.data[0], 'returns data');
    });

    describe('of an author', () => {
      let author;
      beforeEach(async() => {
        author = await userService.create({
          email: 'bad.guy@example.org',
          name: 'Bad guy'
        });
        const data = {
          ...commentData,
          userId: author._id,
          content: 'Original content'
        };
        await service.create(data);
      });

      context('who is not blacklisted', () => {
        it('is visible', async () => {
          const comments = await service.find(params);
          const comment = comments.data[1];
          assert.equal(comment.content, 'Original content');
          assert.equal(comment.contentExcerpt, 'Original content');
        });

        context('usersettings exist, but without blacklist', () => {
          beforeEach(async() => {
            await usersettingsService.create({
              userId: user._id
            });
          });

          it('is visible', async () => {
            const comments = await service.find(params);
            const comment = comments.data[1];
            assert.equal(comment.content, 'Original content');
            assert.equal(comment.contentExcerpt, 'Original content');
          });
        });
      });

      context('who is blacklisted', () => {
        beforeEach(async() => {
          await usersettingsService.create({
            userId: user._id,
            blacklist: [author._id]
          });
        });

        it('is concealed', async () => {
          const comments = await service.find(params);
          const comment = comments.data[1];
          assert.equal(comment.content, 'Comments of this blacklisted user are not visible.');
          assert.equal(comment.contentExcerpt, 'Comments of this blacklisted user are not visible.');
        });

        it('sends isBlacklisted: true', async () => {
          const comments = await service.find(params);
          const comment = comments.data[1];
          assert.equal(comment.isBlacklisted, true);
        });

        context('but if user is not authenticated', () => {
          it('is visible', async () => {
            const comments = await service.find();
            const comment = comments.data[1];
            assert.equal(comment.content, 'Original content');
            assert.equal(comment.contentExcerpt, 'Original content');
          });
        });
      });
    });
  });
});
