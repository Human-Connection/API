/* eslint no-console: off */
const { AfterAll, BeforeAll } = require('cucumber');
const { spawn } = require('child_process');

let hcApi;

// Asynchronous Callback
BeforeAll(() => {
  hcApi = spawn((process.env.NODE_PATH || 'node'), ['server/'], {
    env: {
      NODE_ENV: 'test',
    },
  }).on('error', (err) => { throw err; });

  hcApi.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  hcApi.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });
});

// Asynchronous Promise
AfterAll(() => {
  // perform some shared teardown
  hcApi.kill();
  return Promise.resolve();
});
