const assert = require('assert');
const app = require('../../server/app');
const service = app.service('comments');
const contributionService = app.service('contributions');
const userService = app.service('users');

const { userData } = require('../assets/users');
const { contributionData } = require('../assets/contributions');
const { commentData } = require('../assets/comments');

describe('\'comments\' service', () => {
  let user;
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
    contribution = await contributionService.create(contributionData, { user });

    commentData.contributionId = contribution._id;
  });

  afterEach(async () => {
    user = null;
    contribution = null;
    delete commentData.userId;
    delete commentData.contributionId;
  });

  it('registered the service', () => {
    assert.ok(service, 'Registered the service');
  });

  describe('comments create', () => {
    it('runs create', async () => {
      const comment = await service.create(commentData, { user });
      assert.ok(comment, 'created comment');
    });
  });

  describe('comments patch', () => {
    let comment;

    beforeEach(async () => {
      comment = await service.create(commentData, { user });
    });

    it('runs patch', async () => {
      const result = await service.patch(
        comment._id,
        { content: 'Test' },
        { user }
      );
      assert.ok(result, 'returns result');
      assert.strictEqual(result.content, 'Test', 'patched content');
    });
  });

  describe('comments find', () => {
    beforeEach(async () => {
      await service.create(commentData, { user });
    });

    it('runs find', async () => {
      const result = await service.find();
      assert.ok(result.data[0], 'returns data');
    });
  });
});
