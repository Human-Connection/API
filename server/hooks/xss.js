const { getByDot, setByDot, getItems, replaceItems } = require('feathers-hooks-common');
const sanitizeHtml = require('sanitize-html');
// const embedToAnchor = require('quill-url-embeds/dist/embed-to-anchor');
const { isEmpty, intersection } = require('lodash');
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
  if (!dirty) {
    return dirty;
  }

  // Convert embeds to a-tags
  dirty = embedToAnchor(dirty);
  dirty = sanitizeHtml(dirty, {
    allowedTags: ['iframe', 'img', 'p', 'br', 'b', 'i', 'em', 'strong', 'a', 'pre', 'ul', 'li', 'ol', 's', 'strike', 'span', 'blockquote'],
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
      b: 'strong',
      s: 'strike'
    //   'img': function (tagName, attribs) {
    //     let src = attribs.src;
    //     if (isEmpty(hook.result)) {
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

// iterate through all fields and clean the values
function cleanAllFields (items, fields, hook) {
  if (!items) {
    return items;
  }

  if (Array.isArray(items)) {
    // items is an array so fall this function for all items
    items.forEach((item, key) => {
      items[key] = cleanAllFields(items[key], fields);
    });
  } else if (intersection(Object.keys(items), fields).length) {
    // clean value for all fields on the single given item
    fields.forEach((field) => {
      // get item by dot notation
      const value = getByDot(items, field);
      // set cleaned item by dot notation
      setByDot(items, field, clean(value));
    });
  }

  if (hook && items) {
    replaceItems(hook, items);
  }

  return items;
}

module.exports = function (options = { fields: [] }) {
  return function (hook) {
    return new Promise(resolve => {
      const isFindOrGet = ['find', 'get'].includes(hook.method);
      const items = getItems(hook);
      if (!isEmpty(items) && !(isFindOrGet && hook.type === 'before')) {
        cleanAllFields(items, options.fields, hook);
      }
      resolve(hook);
    });
  };
};
