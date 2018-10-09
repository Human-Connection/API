const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const excludeBlacklisted = require('../../server/hooks/exclude-blacklisted');

let app;
let usersettings = {};
beforeEach(() => {
  // Create a new plain Feathers application
  app = feathers();

  // Register a dummy custom service that just return the
  // message data back
  app.use('/usersettings', {
    async find() {
      return {
        data: [usersettings]
      };
    }
  });
});

describe('\'exclude-blacklisted\' hook', () => {
  context('given a blacklist', () => {
    let mock;
    beforeEach(() => {
      usersettings = { blacklist: ['4711'] };
      mock = {
        type: 'before',
        method: 'find',
        params: {
          user: { _id: 'whatever' }
        },
        app
      };
    });

    context('query param `userId` is an object', () => {
      it('adds one key', () => {
        mock.params.query = {
          userId: { $ne: 'user id' }
        };

        const hook = excludeBlacklisted();
        return hook(mock).then(result => {
          assert.deepEqual(result.params.query.userId, {
            $ne: 'user id',
            $nin: ['4711']
          });
        });
      });
    });

    context('query param `userId` is set to an exact id', () => {
      it('has no effect', () => {
        mock.params.query = {
          userId: 'exact user id'
        };

        const hook = excludeBlacklisted();
        return hook(mock).then(result => {
          assert.deepEqual(result.params.query.userId, 'exact user id' );
        });
      });
    });
  });
});
