const assert = require('assert');
const app = require('../../server/app');
const service = app.service('usersettings');
const userService = app.service('users');
const { userData } = require('../assets/users');

describe('\'usersettings\' service', () => {
  let user;

  before(function(done) {
    this.server = app.listen(3031);
    this.server.once('listening', () => done());
  });

  after(function(done) {
    this.server.close(done);
  });

  it('registered the service', () => {
    assert.ok(service, 'registered the service');
  });

  context('given a user', () => {
    beforeEach(async () => {
      await app.get('mongooseClient').connection.dropDatabase();
      user = await userService.create(userData);
    });

    afterEach(async () => {
      await app.get('mongooseClient').connection.dropDatabase();
      user = null;
    });

    describe('create', () => {
      it('succeeds', async () => {
        let data = {
          userId: user._id
        };
        const usersettings = await service.create(data);
        assert.ok(usersettings);
      });

      describe('blacklist', () => {
        const testSetup = async (blacklistedUserData) => {
          let blacklistedUser = await userService.create({
            ...userData,
            ...blacklistedUserData,
            email: 'someoneelse@test.de',
            name: 'Someone'
          });
          let data = {
            userId: user._id,
            blacklist: [blacklistedUser._id]
          };
          const usersettings = await service.create(data);
          return usersettings[0].blacklist;
        };

        context('ordinary account', () => {
          it('succeeds', async () => {
            const blacklist = await testSetup({});
            assert.equal(blacklist.length, 1);
          });
        });

        context('own account', () => {
          it('rejects', async () => {
            try {
              let data = {
                userId: user._id,
                blacklist: [user._id]
              };
              await service.create(data);
            } catch(BadRequest) {
              const usersettings = await service.find({userId: user._id});
              assert.equal(usersettings.total, 0);
              return;
            }
            assert.fail('Blacklisting yourself was not rejected');
          });
        });

        context('moderator account', () => {
          it('rejects', async () => {
            try {
              await testSetup({role: 'moderator'});
            } catch(BadRequest){
              const usersettings = await service.find({userId: user._id});
              assert.equal(usersettings.total, 0);
              return;
            }
            assert.fail('Blacklisting a moderator was not rejected');
          });
        });

        context('admin account', () => {
          it('rejects', async () => {
            try {
              await testSetup({role: 'admin'});
            } catch(BadRequest){
              const usersettings = await service.find({userId: user._id});
              assert.equal(usersettings.total, 0);
              return;
            }
            assert.fail('Blacklisting an admin user was not rejected');
          });
        });
      });
    });
  });
});
