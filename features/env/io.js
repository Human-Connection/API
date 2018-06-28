/* eslint no-console: off */
const { Before } = require('cucumber');
const fs = require('fs-extra');

const tmpDir = './tmp';

Before(() => fs.remove(tmpDir).then(() => fs.ensureDir(tmpDir)));

