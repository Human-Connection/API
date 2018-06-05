// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

/**
 * TODO: Refactor and test that hook
 */
const { isEmpty } = require('lodash');
const fs = require('fs');
const path = require('path');
const request = require('request');
const faker = require('faker');
const mime = require('mime/lite');
const validUrl = require('valid-url');

function createUploadDirIfNeeded () {
  const uploadDir = path.resolve('public/uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
}

// lass SaveRemoveImage {
//  constructor (hook) {
//    this.hook = hook;
//  }
//  uploadBlob () {
//
//  }
//

module.exports = function (options = []) { // eslint-disable-line no-unused-vars
  return function async (hook) {

    return new Promise((resolve) => {

      let urls = [];

      let loading = 0;
      let imgCount = 0;

      try {
        createUploadDirIfNeeded();
        const uploadsUrl = hook.app.get('baseURL') + '/uploads/';

        // save all given fields and update the hook data
        options.forEach((field) => {
          if (isEmpty(hook.data[field]) || (typeof hook.data[field] === 'string' && hook.data[field].search(uploadsUrl) >= 0)) {
            // skip invalid and local data
            // hook.app.debug(`skip invalid and local data: ${field} - ${hook.data[field]}`);
            return;
          }
          // cant only check for validUrl as we also get blobs
          // if (!validUrl.isWebUri(hook.data[field])) {
          //   // cancel on invalid image url
          //   hook.app.debug(`cancel on invalid image url: ${hook.data[field]}`);
          //   return;
          // }
          // hook.app.debug(`###try to get image: ${hook.data[field]}`);

          loading++;
          imgCount++;
          // TODO: fix that to use the data _id or somethink similar
          let uuid = faker.fake('{{random.uuid}}');
          const imgName = `${field}_${uuid}`;
          let imgPath = path.resolve('public', 'uploads/' + imgName);

          if (typeof hook.data[field] === 'object') {
            try {
              hook.app.debug('SAVE REMOTE IMAGES HOOK');
              hook.app.debug(typeof hook.data[field]);

              fs.writeFileSync(`${imgPath}.png`, hook.data[field], {
                encoding: 'binary'
              });
              loading--;
              hook.data[field] = uploadsUrl + imgName + '.png';

              if (imgCount > 0 && loading <= 0) {
                hook.app.debug('Download(s) finished', urls);
                resolve(hook);
              }
            } catch (err) {
              loading--;
              hook.data[field] = null;
              hook.app.error(err);
              // reject(err);
            }
          } else if (validUrl.isUri(hook.data[field])) {
            // hook.app.debug('SAVE REMOTE IMAGES HOOK');
            // hook.app.debug(`###request url: ${hook.data[field]}`);
            request({
              url: hook.data[field],
              encoding: null,
              timeout: 30000
            }, (err, res, body) => {
              if (err) {
                hook.app.error(err);
                loading--;
                hook.data[field] = null;
                return;
                // reject(err);
              }
              // hook.app.debug(`###got answer for: ${hook.data[field]}`);
              try {
                const mimeType = res.headers['content-type'];
                if (mimeType.indexOf('image') !== 0) {
                  hook.app.error('its not an image');
                  loading--;
                  hook.data[field] = null;
                  return;
                  // reject(new Error('its not an image'));
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
                } else if (!imgCount) {
                  resolve(hook);
                }
              } catch (err) {
                hook.app.error(err);
                loading--;
                hook.data[field] = null;
                // reject(err);
              }
            });
          } else {
            resolve(hook);
          }

          hook.app.debug(`Downloading: ${hook.data[field]}`);
        });

        if (imgCount > 0 && loading <= 0) {
          hook.app.debug('Download(s) finished', urls);
          resolve(hook);
        } else if (!imgCount) {
          resolve(hook);
        }
      } catch (err) {
        // // reject(err);
        if (imgCount) {
          hook.app.error('Thumbnail download failed');
          // throw new errors.Unprocessable('Thumbnail download failed', { errors: err, urls: urls });
          resolve(hook);
        } else {
          resolve(hook);
        }
      }
    });
  };
};
