'use strict';

const crypto = require('crypto-js');

/**
 * @param {[type]} securityKey
 * @param {[type]} thumborServerUrl
 */
function ThumborUrlHelper(securityKey, thumborServerUrl) {
  'use strict';

  this.THUMBOR_SECURITY_KEY = securityKey;
  this.THUMBOR_URL_SERVER = thumborServerUrl;
}

ThumborUrlHelper.prototype = {
  /**
   * Set path of image
   * @param {String} imagePath [description]
   */
  setImagePath: function (imagePath) {
    this.imagePath = (imagePath.charAt(0) === '/') ?
      imagePath.substring(1, imagePath.length) : imagePath;
    return this;
  },
  /**
   * Combine image url and operations with secure and unsecure (unsafe) paths
   * @return {String}
   */
  buildUrl: function (operations) {

    if (this.THUMBOR_SECURITY_KEY) {

      let key = crypto.HmacSHA1(operations + '/' + this.imagePath, this.THUMBOR_SECURITY_KEY);
      key = crypto.enc.Base64.stringify(key);
      key = key.replace(/\+/g, '-').replace(/\//g, '_');

      return this.THUMBOR_URL_SERVER +
        '/' + key +
        '/' + operations + '/' +
        this.imagePath;
    } else {
      return this.THUMBOR_URL_SERVER + '/unsafe/' + operations + '/' +this.imagePath;
    }
  }
};

module.exports = ThumborUrlHelper;
