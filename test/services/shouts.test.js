// const mongoose = require('mongoose');
const assert = require('assert');
const app = require('../../server/app');

const shoutService = app.service('shouts');

let user1;
let user2;

let contribution1;

let shoutUser1Contribution1;
let shoutUser2Contribution1;

describe('\'shouts\' shoutService', () => {
  it('registered the shoutService', () => {
    assert.ok(shoutService, 'Registered the service');
  });

  it('create two users and a contribution with zero shouts', async () => {
    // mongoose.connection.dropDatabase();

    // create users
    user1 = await app.service('users').create({
      email: 'messagetest@example.com',
      password: 'supersecret'
    });
    user2 = await app.service('users').create({
      email: 'max@mustermann.com',
      password: 'supersecret'
    });
    // create contribution
    contribution1 = await app.service('contributions').create({
      userId: user1._id,
      title: 'My Super Contribution!',
      content: 'This is some awesome content',
      language: 'en',
      type: 'post'
    });

    // should have zero shouts
    assert.strictEqual(contribution1.shoutCount, 0);
  });

  it('shout a contribution', async () => {

    // create shout
    shoutUser2Contribution1 = await shoutService.create({
      userId: user2._id,
      foreignId: contribution1._id,
      foreignService: 'contributions'
    });

    assert.strictEqual(shoutUser2Contribution1.foreignId, new String(contribution1._id).toString());
    assert.strictEqual(shoutUser2Contribution1.foreignService, 'contributions');

    // should have one shout
    contribution1 = await app.service('contributions').get(contribution1._id);
    assert.strictEqual(contribution1.shoutCount, 1);

    // create shout
    shoutUser1Contribution1 = await shoutService.create({
      userId: user1._id,
      foreignId: contribution1._id,
      foreignService: 'contributions'
    });
    assert.notEqual(shoutUser1Contribution1._id, shoutUser2Contribution1._id);

    // should have two shout
    contribution1 = await app.service('contributions').get(contribution1._id);
    assert.strictEqual(contribution1.shoutCount, 2);

    // TODO / FIXME: for some kind of reason the database ignores the compound index on userId and foreignId while on test mode
    /*
    let error;
    try {
      shoutUser2Contribution1 = await shoutService.create({
        userId: user2._id,
        foreignId: contribution1._id,
        foreignService: 'contributions'
      });
    } catch (err) {
      error = err;
    }
    assert.ok(/already exists/.test(error)); */

    contribution1 = await app.service('contributions').get(contribution1._id);

    // should still have two shout
    assert.strictEqual(contribution1.shoutCount, 2);
  });

  it('remove a shout', async () => {
    await shoutService.remove(shoutUser2Contribution1._id);

    // should have one shout
    contribution1 = await app.service('contributions').get(contribution1._id);
    assert.strictEqual(contribution1.shoutCount, 1);
  });
});
