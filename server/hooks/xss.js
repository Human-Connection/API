const sanitizeHtml = require('sanitize-html');
// const embedToAnchor = require('quill-url-embeds/dist/embed-to-anchor');
const _ = require('lodash');
const cheerio = require('cheerio');

const embedToAnchor = (content) => {
  const $ = cheerio.load(content);
  $('div[data-url-embed]').each((i, el) => {
    let url = el.attribs['data-url-embed'];
    let aTag = $(`<a href="${url}" target="_blank" data-url-embed="">${url}</a>`);
    $(el).replaceWith(aTag);
  });
  return $('body').html();
};

function clean (dirty) {
  // Convert embeds to a-tags
  dirty = embedToAnchor(dirty);
  dirty = sanitizeHtml(dirty, {
    allowedTags: ['iframe', 'img', 'p', 'br', 'b', 'i', 'em', 'strong', 'a', 'pre', 'ul', 'li', 'ol', 'span'],
    allowedAttributes: {
      a: ['href', 'class', 'target', 'data-*'],
      img: [ 'src' ],
      iframe: ['src', 'class', 'frameborder', 'allowfullscreen']
    },
    allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com'],
    parser: {
      lowerCaseTags: true
    },
    transformTags: {
      i: 'em',
      // a: function (tagName, attribs) {
      //   return {
      //     tagName: 'a',
      //     attribs: {
      //       href: attribs.href,
      //       target: '_blank'
      //     }
      //   };
      // },
      b: 'strong'
    //   'img': function (tagName, attribs) {
    //     let src = attribs.src;
    //     if (_.isEmpty(hook.result)) {
    //       const config = hook.app.get('thumbor');
    //       if (config && src.indexOf(config < 0)) {
    //         // download image
    //
    //         // const ThumborUrlHelper = require('../helper/thumbor-helper');
    //         // const Thumbor = new ThumborUrlHelper(config.key || null, config.url || null);
    //         // src = Thumbor
    //         //   .setImagePath(src)
    //         //   .buildUrl('740x0');
    //       }
    //     }
    //     return {
    //       tagName: 'img',
    //       attribs: {
    //         src: src
    //       }
    //     };
    //   }
    }
  });

  // remove empty html tags and duplicated returns
  dirty = dirty
    .replace(/<[a-z]>[\s]*<\/[a-z]>/igm, '')
    .replace(/(<iframe(?!.*?src=(['"]).*?\2)[^>]*)(>)[^>]*\/*>/igm, '')
    .replace(/<p>[\s]*(<br ?\/?>)+[\s]*<\/p>/igm, '<br />')
    .replace(/(<br ?\/?>){2,}/igm, '<br />')
    .replace(/[\n]{3,}/igm, '\n\n');
  return dirty;
}

module.exports = function (options = { fields: [] }) {
  return function (hook) {
    return new Promise(resolve => {
      options.fields.forEach(field => {
        try {
          if (!_.isEmpty(hook.result) && !_.isEmpty(hook.result[field])) {
            hook.result[field] = clean(hook.result[field], hook);
          } else if (!_.isEmpty(hook.result) && !_.isEmpty(hook.result.data)) {
            hook.result.data.forEach((result, i) => {
              if (!_.isEmpty(hook.result.data[i][field])) {
                hook.result.data[i][field] = clean(hook.result.data[i][field], hook);
              }
            });
          } else if (!_.isEmpty(hook.data) && !_.isEmpty(hook.data[field])) {
            hook.data[field] = clean(hook.data[field]);
          }
        } catch (err) {
          hook.app.error(err);
        }
      });
      resolve(hook);
    });
  };
};
