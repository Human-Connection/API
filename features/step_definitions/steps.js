/* eslint no-unused-expressions: off */
/* eslint func-names: off */
/* eslint no-underscore-dangle: off */
const { Given, When, Then } = require('cucumber');
const fetch = require('node-fetch');
const { expect } = require('chai');
const fs = require('fs-extra');
const { spawnSync } = require('child_process');
const waitOn = require('wait-on');

const hcBackendUrl = 'http://localhost:3030';

let currentUser;
let currentUserPassword;
let httpResponse;
let currentUserAccessToken;
let commandOutput;

function authenticate(email, plainTextPassword) {
  const formData = {
    email,
    password: plainTextPassword,
    strategy: 'local',
  };
  return fetch(`${hcBackendUrl}/authentication`, {
    method: 'post',
    body: JSON.stringify(formData),
    headers: { 'Content-Type': 'application/json' },
  }).then(response => response.json())
    .catch((err) => {
      throw (err);
    })
    .then(json => json.accessToken);
}

function execute(command) {
  const script = command.replace(/node\s*/, '');
  return spawnSync((process.env.NODE_PATH || 'node'), [script], {
    cwd: './tmp/',
  });
}

Given(/^the Human Connection API is up and running(?: on "http:\/\/localhost:3030")?/, (callback) => {
  waitOn({ resources: ['tcp:3030'], timeout: 30000 }, (err) => {
    if (err) throw (err);
    return callback();
  });
});

Given("there is a 3rd party application running, e.g. 'Democracy'", () => {
  // Just documentation
});

Given('there is a user in Human Connection with these credentials:', function (dataTable) {
  const params = dataTable.hashes()[0];
  currentUserPassword = params.password;
  return this.app.service('users').create(params).then((user) => {
    currentUser = user;
  });
});

Given('you are authenticated', () => authenticate(currentUser.email, currentUserPassword).then((accessToken) => {
  currentUserAccessToken = accessToken;
}));

When('you send a POST request to {string} with:', (route, body, callback) => {
  const params = {
    method: 'post',
    body,
    headers: { 'Content-Type': 'application/json' },
  };
  if (currentUserAccessToken) {
    params.headers.Authorization = `Bearer ${currentUserAccessToken}`;
  }
  fetch(`${hcBackendUrl}${route}`, params)
    .then(response => response.json())
    .catch((err) => {
      throw (err);
    })
    .then((json) => {
      httpResponse = json;
      callback();
    });
});

Then('there is an access token in the response:', (jsonResponse) => {
  expect(httpResponse.accessToken).to.be.a('string');
  expect(httpResponse.accessToken.length).to.eq(342);
  const expectedAccessToken = JSON.parse(jsonResponse).accessToken;
  const expectedFirstPartOfJwt = expectedAccessToken.split('.')[0];
  expect(httpResponse.accessToken.split('.')[0]).to.eq(expectedFirstPartOfJwt);
});

Then('a new post is created', function () {
  return this.app.service('contributions').find({}).then((contributions) => {
    expect(contributions.total).to.eq(1);
    expect(contributions.data[0].type).to.eq('post');
  });
});

