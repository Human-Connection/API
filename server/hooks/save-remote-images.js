// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const errors = require('feathers-errors');
const fs = require('fs');
const path = require('path');
const request = require('request');
const faker = require('faker');
const mime = require('mime/lite');

module.exports = function (options = []) { // eslint-disable-line no-unused-vars
  return function async (hook) {

    return new Promise((resolve, reject) => {

      let urls = [];

      let loading = 0;
      let imgCount = 0;

      try {
        let uploadDir = path.resolve('public/uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir);
        }

        const uploadsUrl = hook.app.get('baseURL') + '/uploads/';

        // save all given fields and update the hook data
        options.forEach((field) => {
          if (!hook.data[field] || hook.data[field].search(uploadsUrl) >= 0) {
            // skip invalid and local data
            return;
          }
          loading++;
          imgCount++;
          // TODO: fix that to use the data _id or somethink similar
          let uuid = faker.fake('{{random.uuid}}');
          const imgName = `${field}_${uuid}`;
          let imgPath = path.resolve('public', 'uploads/' + imgName);

          request({
            url: hook.data[field],
            encoding: null
          }, (err, res, body) => {
            if (err) {
              hook.app.error(err);
              reject(err);
            }
            try {
              const mimeType = res.headers['content-type'];
              if (mimeType.indexOf('image') !== 0) {
                hook.app.error('its not an image');
                reject('its not an image');
              }

              const ext = mime.getExtension(mimeType);

              imgPath += `.${ext}`;

              fs.writeFileSync(imgPath, body, {
                encoding: 'binary'
              });

              loading--;

              hook.data[field] = uploadsUrl + imgName + `.${ext}`;

              if (imgCount > 0 && loading <= 0) {
                hook.app.debug('Download(s) finished', urls);
                resolve(hook);
              }
            } catch (err) {
              hook.app.error(err);
            }
          });

          hook.app.debug('Downloading', hook.data[field]);
        });

        if (imgCount > 0 && loading <= 0) {
          hook.app.debug('Download(s) finished', urls);
          resolve(hook);
        } else if (!imgCount) {
          resolve(hook);
        }
      } catch(err) {
        // reject(err);
        if (imgCount) {
          hook.app.error('Thumbnail download failed');
          throw new errors.Unprocessable('Thumbnail download failed', { errors: err, urls: urls });
        } else {
          resolve(hook);
        }
      }
    });
  };
};
