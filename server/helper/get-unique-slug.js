const getUniqueSlug = (service, slug, count, id) => {
  return new Promise(resolve => {
    const testSlug = count ? slug + count : slug;

    // Test if we already have data with this slug
    const query = {
      slug: testSlug
    };
    // ignore entry with given id (if set)
    if (id) {
      query._id = {
        $ne: id
      };
    }
    service.find({
      query
    }).then((result) => {
      if (result.data.length > 0) {
        count = count ? count + 1 : 1;
        resolve(getUniqueSlug(service, slug, count));
      } else {
        resolve(testSlug);
      }
    });
  });
};

module.exports = getUniqueSlug;
