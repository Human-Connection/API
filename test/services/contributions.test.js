const assert = require('assert');
const app = require('../../server/app');
const service = app.service('contributions');
const userService = app.service('users');
const notificationService = app.service('notifications');
const categoryService = app.service('categories');
const usersettingsService = app.service('usersettings');
const { userData, adminData } = require('../assets/users');
const {
  contributionData,
  contributionData2,
  contributionCandoData
} = require('../assets/contributions');
const { categoryData } = require('../assets/categories');

describe('\'contributions\' service', () => {
  let user;
  let params;

  before(function(done) {
    this.server = app.listen(3031);
    this.server.once('listening', () => done());
  });

  after(function(done) {
    this.server.close(done);
  });

  beforeEach(async () => {
    await app.get('mongooseClient').connection.dropDatabase();
    user = await userService.create(adminData);
    params = {
      user
    };
  });

  afterEach(async () => {
    await app.get('mongooseClient').connection.dropDatabase();
    user = null;
    params = null;
  });

  it('registered the service', () => {
    assert.ok(service, 'registered the service');
  });

  describe('contributions create', () => {
    it('runs create', async () => {
      const contribution = await service.create(contributionData, params);
      assert.ok(contribution, 'created contribution');
    });

    it('has required fields after create', async () => {
      const contribution = await service.create(contributionData, params);
      assert.ok(contribution._id, 'has _id');
      assert.ok(contribution.userId, 'has userId');
      assert.ok(contribution.type, 'has type');
      assert.ok(contribution.title, 'has title');
      assert.ok(contribution.content, 'has content');
    });

    it('has correct _id after create with _id: null in data', async () => {
      contributionData._id = null;
      const contribution = await service.create(contributionData, params);
      assert.ok(contribution._id !== null, 'has _id');
      delete contributionData._id;
    });

    it('creates mention notification', async () => {
      const mentionedUser = await userService.create(userData);
      const data = Object.assign({}, contributionData);
      data.content += ` <a href="" class="hc-editor-mention-blot" data-hc-mention="{&quot;_id&quot;:&quot;${mentionedUser._id.toString()}&quot;,&quot;slug&quot;:&quot;${mentionedUser.slug}&quot;}">${mentionedUser.name}</a>`;
      const contribution = await service.create(data, params);
      const result = await notificationService.find({
        query: {
          userId: mentionedUser._id.toString()
        }
      });
      const notification = result.data[0];
      assert.ok(notification, 'created notification');
      assert.ok(notification.userId, 'has userId');
      assert.ok(notification.relatedContributionId, 'has relatedContributionId');
      assert.equal(notification.relatedContributionId, contribution._id, 'has correct relatedContributionId');
    });

    context('given soft-deleted contribution', () => {
      const contributionAttributes = {
        title: 'title',
        type: 'post',
        content: 'blah',
        language: 'en',
      };

      beforeEach(async () => {
        const deletedContributionAttributes = Object.assign({}, contributionAttributes, {
          deleted: true,
          slug: 'title'
        });
        await service.create(deletedContributionAttributes, params);
      });

      it('increments title slug', async () => {
        let contribution = await service.create(contributionAttributes, params);
        assert.ok(contribution, 'created contribution');
        assert.equal(contribution.slug, 'title1');
      });
    });

    context('given disabled contribution', () => {
      const contributionAttributes = {
        title: 'title',
        type: 'post',
        content: 'blah',
        language: 'en',
      };

      beforeEach(async () => {
        const disabledContributionAttributes = Object.assign({}, contributionAttributes, {
          isEnabled: false,
          slug: 'title'
        });
        await service.create(disabledContributionAttributes, params);
      });

      it('increments title slug', async () => {
        let contribution = await service.create(contributionAttributes, params);
        assert.ok(contribution, 'created contribution');
        assert.equal(contribution.slug, 'title1');
      });
    });
  });

  describe('contributions patch', () => {
    let contribution;

    beforeEach(async () => {
      contribution = await service.create(contributionData, params);
    });

    afterEach(async () => {
      contribution = null;
    });

    it('runs patch', async () => {
      const result = await service.patch(contribution._id, {
        title: 'Test'
      }, params);
      assert.ok(result, 'returns data');
      assert.equal(result.title, 'Test', 'patched data');
    });
  });

  describe('contributions find', () => {
    beforeEach(async () => {
      let category = await categoryService.create(categoryData);
      let data = {
        ...contributionData,
        categoryIds: [ category._id ]
      };
      await service.create(data, params);
    });

    it('returns contributions', async () => {
      const result = await service.find();
      assert.ok(result.data[0], 'returns data');
    });

    it('does not populate associatedCanDos', async () => {
      const result = await service.find();
      assert.strictEqual(
        result.data[0].associatedCanDos,
        undefined,
        'does not populate'
      );
    });

    describe('of an author', () => {
      let author;
      beforeEach(async() => {
        author = await userService.create({
          email: 'bad.guy@example.org',
          name: 'Bad guy'
        });
        const data = { ...contributionData, userId: author._id };
        await service.create(data);
      });

      context('who is not blacklisted', () => {
        it('is included', async () => {
          const contributions = await service.find(params);
          assert.equal(contributions.total, 2);
        });
      });

      context('who is blacklisted', () => {
        beforeEach(async() => {
          await usersettingsService.create({
            userId: user._id,
            blacklist: [author._id]
          });
        });

        it('is filtered', async () => {
          const contributions = await service.find(params);
          assert.equal(contributions.total, 1);
        });

        context('but if user is not authenticated', () => {
          it('is not filtered', async () => {
            const contributions = await service.find();
            assert.equal(contributions.total, 2);
          });
        });
      });
    });
  });

  describe('contributions find by slug', () => {
    let query;
    let category;
    let contribution;

    beforeEach(async () => {
      category = await categoryService.create(categoryData);
      let data = {
        ...contributionData,
        categoryIds: [ category._id ]
      };
      contribution = await service.create(data, params);
      await service.create(contributionData2, params);
      query = {
        slug: contribution.slug
      };
    });

    afterEach(async () => {
      contribution = null;
      query = null;
    });

    it('returns one contribution', async () => {
      const result = await service.find({ query });
      assert.ok(result.data[0], 'returns data');
      assert.equal(result.data.length, 1, 'returns only one entry');
    });

    it('populates associatedCanDos', async () => {
      const result = await service.find({ query });
      assert.notStrictEqual(
        result.data[0].associatedCanDos,
        undefined,
        'does populate'
      );
    });

    it('finds associatedCanDos', async () => {
      let candoData = {
        ...contributionCandoData,
        categoryIds: [ category._id ]
      };
      await service.create(candoData, params);
      const result = await service.find({ query });
      assert.ok(result.data[0].associatedCanDos[0], 'finds result');
    });
  });
});
