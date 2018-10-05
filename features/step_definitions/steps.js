/* eslint no-unused-expressions: off */
/* eslint func-names: off */
/* eslint no-underscore-dangle: off */
const { Given, When, Then } = require('cucumber');
const fetch = require('node-fetch');
const { expect } = require('chai');

const hcBackendUrl = 'http://localhost:3031';

let currentUser;
let currentUserPassword;
let httpResponse;
let currentUserAccessToken;
let lastPost;
let blacklistedUser;

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

function postRequest(route, body, callback) {
  const params = {
    method: 'post',
    body,
    headers: { 'Content-Type': 'application/json' },
  };
  return request(params, route, callback);
}

function getRequest(route, callback){
  const params = {
    method: 'get',
    headers: { 'Content-Type': 'application/json' },
  };
  return request(params, route, callback);
}

function request(params, route, callback) {
  const requestParams = Object.assign({}, params);
  if (currentUserAccessToken) {
    requestParams.headers.Authorization = `Bearer ${currentUserAccessToken}`;
  }
  fetch(`${hcBackendUrl}${route}`, requestParams)
    .then(response => response.json())
    .catch((err) => {
      throw (err);
    })
    .then((json) => {
      httpResponse = json;
      callback();
    });
}


Given('this is your user account:', function (dataTable) {
  const params = dataTable.hashes()[0];
  currentUserPassword = params.password;
  return this.app.service('users').create(params).then((user) => {
    currentUser = user;
  });
});

Given('these user accounts exist:', function (dataTable) {
  return Promise.all(dataTable.hashes().map(params => {
    return this.app.service('users').create(params);
  }));
});

Given('you are authenticated', () => authenticate(currentUser.email, currentUserPassword).then((accessToken) => {
  currentUserAccessToken = accessToken;
}));

When('you send a POST request to {string} with:', (route, body, callback) => postRequest(route, body, callback));

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


Then('these category ids are stored in your user settings', function () {
  return this.app.service('usersettings').find({userId: currentUser._id.toString()}).then((settings) => {
    expect(settings.total).to.eq(1);
    let usersettings = settings.data[0];
    expect(usersettings.uiLanguage).to.eq('en');
    expect(usersettings.filter.categoryIds).to.be.an('array')
      .that.does.include('5b310ab8b801653c1eb6c426')
      .that.does.include('5b310ab8b801653c1eb6c427')
      .that.does.include('5b310ab8b801653c1eb6c428');
  });
});

Then('your language {string} is stored in your user settings', function (lang) {
  return this.app.service('usersettings').find({query: {userId: currentUser._id.toString()}}).then((settings) => {
    expect(settings.total).to.eq(1);
    expect(settings.data[0].uiLanguage).to.eq(lang);
  });
});

Then('debug', function() {
  // eslint-disable-next-line no-debugger
  debugger;
});

When('you create your user settings via POST request to {string} with:', function (route, body, callback) {
  let jsonBody = JSON.parse(body);
  jsonBody.userId = currentUser._id.toString();
  postRequest(route, JSON.stringify(jsonBody), callback);
});

Then('you will stop seeing posts of the user with id {string}', function (blacklistedUserId) {
  return this.app.service('usersettings').find({userId: currentUser._id.toString()}).then((settings) => {
    expect(settings.total).to.eq(1);
    expect(settings.data[0].blacklist).to.be.an('array').that.does.include(blacklistedUserId);
  });
});

Given('you blacklisted the user {string} before', async function (blacklistedUserName) {
  const res = await this.app.service('users').find({query: {name: blacklistedUserName}});
  blacklistedUser = res.data[0];
  const params = {
    userId: currentUser._id,
    blacklist: [blacklistedUser._id]
  };
  return this.app.service('usersettings').create(params);
});

When('this user publishes a post', function () {
  const params = {
    title: 'Awful title',
    content: 'disgusting content',
    language: 'en',
    type: 'post',
    userId: blacklistedUser._id
  };
  return this.app.service('contributions').create(params);
});

When('you read your current news feed', function (callback) {
  getRequest('/contributions', callback);
});

Then('this post is not included', function () {
  expect(httpResponse.data).to.be.an('array').that.is.empty;
});

Given('there is a post {string} by user {string}', async function (postTitle, userName) {
  const users = await this.app.service('users').find({ query: {name: userName} });
  const user = users.data[0];
  const params = {
    title: postTitle,
    content: 'blah',
    language: 'en',
    type: 'post',
    userId: user._id
  };
  lastPost = await this.app.service('contributions').create(params);
  return lastPost;
});

Given('the blacklisted user wrote a comment on that post:', function (comment) {
  const commentParams = {
    userId: blacklistedUser._id,
    content: comment,
    contributionId: lastPost._id
  };
  return this.app.service('comments').create(commentParams);
});

When('you read through the comments of that post', function (callback) {
  getRequest('/comments', callback);
});

Then('you will see a hint instead of a comment:', function (hint) {
  const comment = httpResponse.data[0];
  expect(comment.content).to.eq(hint);
  expect(comment.contentExcerpt).to.eq(hint);
});
