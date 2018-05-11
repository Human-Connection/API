const assert = require('assert');
const app = require('../../server/app');
const service = app.service('authManagement');
const userService = app.service('users');
const fs = require('fs-extra');
const path = require('path');
const cheerio = require('cheerio');
let user = null;

describe('\'authManagement\' service', () => {
  before(function(done) {
    this.server = app.listen(3031);
    this.server.once('listening', () => done());
  });

  after(function(done) {
    this.server.close(done);
  });

  beforeEach(async () => {
    await app.get('mongooseClient').connection.dropDatabase();
    user = await userService.create({
      email: 'test@test.de',
      password: '1234',
      name: 'Peter',
      role: 'admin'
    });
  });

  afterEach(async () => {
    await app.get('mongooseClient').connection.dropDatabase();
    user = null;
  });

  it('registered the service', () => {
    assert.ok(service, 'Registered the service');
  });

  it('can reset password', async () => {
    await service.create({
      action: 'sendResetPwd',
      value: {
        email: user.email
      }
    });

    const token = await getTokenFromMail();

    const result = await service.create({
      action: 'resetPwdLong',
      value: {
        token,
        password: '123456'
      }
    });
    assert.ok(result, 'password can be reset');
  });
});

const getTokenFromMail = async () => {
  // Get token from tmp email file
  const mailDir = path.join(__dirname, '../../tmp/emails');
  const fileName = await fs.readdirSync(mailDir)[0];
  const mailFile = path.join(mailDir, fileName);
  const mailContent = await fs.readFileSync(mailFile, 'utf8');
  const $ = await cheerio.load(mailContent);
  let url;
  await $('a.btn-primary').each((i, el) => {
    url = el.attribs['href'];
  });
  const token = url.split('/').pop();
  return token;
};
