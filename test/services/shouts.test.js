const mongoose = require('mongoose');
const assert = require('assert');
const app = require('../../server/app');

const shoutService = app.service('shouts');

let user1;
let user2;

let contribution1;

let shoutUser2Contribution1;

describe('\'shouts\' shoutService', () => {
  it('registered the shoutService', () => {
    assert.ok(shoutService, 'Registered the service');
  });

  it('create two users and a contribution with zero shouts', async () => {
    mongoose.connection.dropDatabase();

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
    assert.equal(contribution1.shoutCount, 0);
  });

  it('shout a contribution', async () => {

    // create shout
    shoutUser2Contribution1 = await shoutService.create({
      userId: user2._id,
      foreignId: contribution1._id,
      foreignService: 'contributions'
    });

    assert.equal(shoutUser2Contribution1.foreignId, contribution1._id);
    assert.equal(shoutUser2Contribution1.foreignService, 'contributions');

    // should have one shout
    contribution1 = await app.service('contributions').get(contribution1._id);
    assert.equal(contribution1.shoutCount, 1);

    // create shout
    await shoutService.create({
      userId: user1._id,
      foreignId: contribution1._id,
      foreignService: 'contributions'
    });

    // should have two shout
    contribution1 = await app.service('contributions').get(contribution1._id);
    assert.equal(contribution1.shoutCount, 2);

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
    assert.ok(/already exists/.test(error));

    contribution1 = await app.service('contributions').get(contribution1._id);

    // should still have two shout
    assert.equal(contribution1.shoutCount, 2);
  });

  it('remove a shut', async () => {
    await shoutService.remove(shoutUser2Contribution1._id);

    // should have one shout
    contribution1 = await app.service('contributions').get(contribution1._id);
    assert.equal(contribution1.shoutCount, 1);
  });
});
